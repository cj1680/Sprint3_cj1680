from flask import Blueprint, jsonify, request
import anthropic
import os
from dotenv import load_dotenv
import base64

bp = Blueprint("algebra", __name__, url_prefix="/algebra")

@bp.route("/", methods=["POST"])
def algebra():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image_file = request.files["image"]

    # Read and encode image
    image_data = base64.b64encode(image_file.read()).decode("utf-8")

    client = anthropic.Anthropic(api_key=os.getenv('AI_ACCESS_KEY'))

    try:
        message = client.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=300,
            messages=[
                {
                    "role": "user",
                    "content": "Extract the equation from the image and output it in a fully readable text format. Use words for symbols where needed to ensure clarity for a voice generator. Output ONLY the worded equation"
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": "image/png",
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