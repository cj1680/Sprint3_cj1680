from flask import Blueprint, jsonify, request
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

bp = Blueprint("history", __name__, url_prefix="/history")

@bp.route("/", methods=["POST"])
def history():
    print('we made it')
    data = request.json
    token = data.get("token")
    branch = data.get("branch")

    # if not token:
    #     return jsonify({"error": "Token required"}), 400

    conn = None
    cursor = None

    try:
        # Connect to PostgreSQL
        conn = psycopg2.connect(os.environ.get('DATABASE_ACCESS_KEY'))
        cursor = conn.cursor()

        # Fetch user's previous conversation history
        cursor.execute('''
            SELECT date, branch, url, conversation
            FROM conversations
            WHERE u_id_fk IN (
                SELECT u_id
                FROM users
                WHERE token = %s
            )
            AND branch = %s
            ORDER BY date DESC;
        ''', (token, branch))
        conversations = cursor.fetchall()

        return jsonify({"valid": conversations}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
