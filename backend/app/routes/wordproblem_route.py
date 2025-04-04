from flask import Blueprint, jsonify, request
import anthropic
import os
from dotenv import load_dotenv
import base64

bp = Blueprint("wordproblem", __name__, url_prefix="/wordproblem")

@bp.route("/", methods=["POST"])
def wordproblem():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image_file = request.files["image"]
    filename = image_file.filename.lower()

    if filename.endswith(".jpg") or filename.endswith(".jpeg"):
        media_type = "image/jpeg"
    elif filename.endswith(".png"):
        media_type = "image/png"
    else:
        return jsonify({"error": "Unsupported image format. Only PNG and JPG are supported."}), 400
    
    # Read and encode image
    image_data = base64.b64encode(image_file.read()).decode("utf-8")

    client = anthropic.Anthropic(api_key=os.getenv('AI_ACCESS_KEY'))

    try:
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=300,
            messages=[
                {
                    "role": "user",
                    "content": "If not a math word problem, state how the file is not a math word problem. Else, extract the text from the image as long as it is a math word problem. Output nothing else."
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": media_type,
                                "data": image_data
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

        return jsonify({"response": response_content})

    except Exception as e:
        return jsonify({"error": str(e)}), 500