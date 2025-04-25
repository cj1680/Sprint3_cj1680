from flask import Blueprint, jsonify, request
import os
import cloudinary
import cloudinary.uploader
import psycopg2

bp = Blueprint("deleteConvo", __name__, url_prefix="/deleteConvo")

@bp.route("/", methods=["POST"])
def deleteConvo():
    url = os.environ.get('DATABASE_ACCESS_KEY')

    data = request.json
    c_id = data.get('c_id')

    try:
        # Connect to the database
        conn = psycopg2.connect(url)
        cursor = conn.cursor()

        # Fetch the image_id using c_id
        cursor.execute('''
            SELECT image_id 
            FROM conversations 
            WHERE c_id = %s
        ''', (c_id,))
        result = cursor.fetchone()

        if not result:
            return jsonify({"message": "Conversation not found"}), 404

        image_id = result[0]

        # Delete the image from Cloudinary
        cloudinary.config(
            cloud_name=os.getenv('CLOUDINARY_NAME'),
            api_key=os.getenv('CLOUDINARY_KEY'),
            api_secret=os.getenv('CLOUDINARY_SECRET')
        )
        cloudinary.uploader.destroy(image_id)

        # Delete the conversation from the database
        cursor.execute('''
            DELETE 
            FROM conversations 
            WHERE c_id = %s
        ''', (c_id,))
        conn.commit()

        return jsonify({"message": "Deletion successful"}), 200

    except Exception as e:
        return jsonify({"message": "Deletion failed", "error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()