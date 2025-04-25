from flask import Blueprint, jsonify, request
import anthropic
import os
from dotenv import load_dotenv
import base64
import cloudinary
import cloudinary.uploader
from io import BytesIO
import psycopg2

bp = Blueprint("graphs", __name__, url_prefix="/graphs")

@bp.route("/", methods=["POST"])
def graphs():

    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    #Get file and the file extension
    image_file = request.files["image"]
    filename = image_file.filename.lower()

    #Checks for valid file extension
    if filename.endswith(".jpg") or filename.endswith(".jpeg"):
        media_type = "image/jpeg"
    elif filename.endswith(".png"):
        media_type = "image/png"
    else:
        return jsonify({"error": "Unsupported image format. Only PNG and JPG are supported."}), 400

    #Read image once into memory
    image_bytes = image_file.read()
    encoded_image = base64.b64encode(image_bytes).decode("utf-8")

    client = anthropic.Anthropic(api_key=os.getenv('AI_ACCESS_KEY'))

    try:
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=300,
            messages=[
                {
                    "role": "user",
                    "content": "If the input is not a graph, output 0. Otherwise, describe the overall shape of the line (e.g., increasing, decreasing, U-shape, V-shape). Extract only the points where the line intersects the major grid lines, including x- and y-intercepts. Use the format: 'The shape is a [describe the curve]. It has [number of points] points. The first point is: at [point x], [point y]. Next: at [point x], [point y]... Finally: at [point x], [point y].' For negative values, use 'negative' instead of the minus sign."
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": media_type,
                                "data": encoded_image
                            }
                        }
                    ]
                }
            ]
        )

        response_content = [
            block.text if hasattr(block, "text") else str(block)
            for block in message.content
        ]

        #If valid image
        if '0' not in response_content:
            # Rewind the stream for upload
            image_stream = BytesIO(image_bytes)


            #Database
            conn = psycopg2.connect(os.environ.get("DATABASE_ACCESS_KEY"))
            cursor = conn.cursor()

            # Get token from request
            token = request.form.get("token")
            
            # Get u_id from token
            cursor.execute("SELECT u_id FROM users WHERE token = %s", (token,))
            user = cursor.fetchone()
            if user:

                cloudinary.config(
                cloud_name=os.getenv('CLOUDINARY_NAME'),
                api_key=os.getenv('CLOUDINARY_KEY'),
                api_secret=os.getenv('CLOUDINARY_SECRET')
                )

                #Upload image to storage
                upload_result = cloudinary.uploader.upload(image_stream)
                image_url = upload_result['secure_url']
                image_id = upload_result['public_id']

                u_id = user[0]

                # Insert into conversations
                cursor.execute('''
                    INSERT INTO conversations (u_id_fk, branch, image_url, image_id, conversation, filename)
                    VALUES (%s, %s, %s, %s, %s, %s)
                ''', (u_id, 'graphs', image_url, image_id, response_content, filename))

            conn.commit()
            if cursor:
                cursor.close()
            if conn:
                conn.close()

        return jsonify({"response": response_content})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
