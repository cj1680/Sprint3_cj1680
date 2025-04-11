from flask import Blueprint, jsonify, request
import anthropic
import os
from dotenv import load_dotenv
import base64
import cloudinary
import cloudinary.uploader
from io import BytesIO
import psycopg2

bp = Blueprint("geometry", __name__, url_prefix="/geometry")

@bp.route("/", methods=["POST"])
def geometry():

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
                    "content": "If not a geometric image, output 0. Else, extract the shape and its properties in this format: Shape:[Name] A:[°], B:[°], C:[°], A-B:[Length]u, B-C:[Length]u, C-A:[Length]u. Use 'null' for unknown values. ONLY output the desired format."
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

                u_id = user[0]

                # Insert into conversations
                cursor.execute('''
                    INSERT INTO conversations (u_id_fk, branch, url, conversation)
                    VALUES (%s, %s, %s, %s)
                ''', (u_id, 'geometry', image_url, response_content))

            conn.commit()
            if cursor:
                cursor.close()
            if conn:
                conn.close()

        return jsonify({"response": response_content})

    except Exception as e:
        return jsonify({"error": str(e)}), 500