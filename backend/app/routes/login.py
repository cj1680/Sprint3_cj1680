from flask import Blueprint, jsonify, request
import os
from dotenv import load_dotenv
from werkzeug.security import check_password_hash
import psycopg2
import string
import secrets

bp = Blueprint("login", __name__, url_prefix="/login")

@bp.route("/", methods=["POST"])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Connect to the database
    try:
        conn = psycopg2.connect(os.environ.get('DATABASE_ACCESS_KEY'))
        cursor = conn.cursor()

        # Fetch user data by email
        cursor.execute('''
            SELECT password 
            FROM users 
            WHERE email = %s
        ''', (email,))
        user = cursor.fetchone()

        if user is None:
            return jsonify({"error": "Invalid email or password"}), 401

        # Check if password matches
        hashed_password = user[0]
        if check_password_hash(hashed_password, password):
            # Generate auth token
            characters = string.ascii_letters + string.digits  # A-Z, a-z, 0-9
            token = ''.join(secrets.choice(characters) for _ in range(128))

            # Add login token to database
            cursor.execute('''
                UPDATE users 
                SET token = %s 
                WHERE email = %s
            ''', (token, email))
            conn.commit()

            return jsonify({"message": "Login successful!", "token": token}), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()