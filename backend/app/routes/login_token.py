from flask import Blueprint, jsonify, request
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

bp = Blueprint("login_token", __name__, url_prefix="/login_token")

@bp.route("/", methods=["POST"])
def login_token():
    data = request.json
    token = data.get("token")

    if not token:
        return jsonify({"error": "Token required"}), 400

    try:
        # Connect to PostgreSQL
        conn = psycopg2.connect(os.environ.get('DATABASE_ACCESS_KEY'))
        cursor = conn.cursor()

        # Check if token exists
        cursor.execute("SELECT 1 FROM users WHERE token = %s", (token,))
        exists = cursor.fetchone() is not None

        return jsonify({"valid": exists}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
