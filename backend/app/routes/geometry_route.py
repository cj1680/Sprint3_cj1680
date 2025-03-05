from flask import Blueprint, jsonify, request
import anthropic
import os
from dotenv import load_dotenv
import base64

bp = Blueprint("geometry", __name__, url_prefix="/geometry")

@bp.route("/", methods=["POST"])
def geometry():
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
                    "content": "Extract the shape and its properties in this format: Shape:[Name] A:[°], B:[°], C:[°], A-B:[Length]u, B-C:[Length]u, C-A:[Length]u. Use 'null' for unknown values. ONLY output the desired format"
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