from flask import Blueprint, jsonify, request
import os
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash
import psycopg2
import string
import secrets

bp = Blueprint("register", __name__, url_prefix="/register")

@bp.route("/", methods=["POST"])
def register():
    url = os.environ.get('DATABASE_ACCESS_KEY')

    data = request.json
    email = data.get('email')
    password = data.get('password')


    # Hash the password
    hashed_password = generate_password_hash(password)

    # Generate auth token
    characters = string.ascii_letters + string.digits  # A-Z, a-z, 0-9
    token = ''.join(secrets.choice(characters) for _ in range(128))

    try:
        # Connect to the database
        conn = psycopg2.connect(url)
        cursor = conn.cursor()

        # Insert user into the database
        cursor.execute('''
            INSERT INTO users(email, password, token) 
                VALUES (%s, %s, %s)
        ''', (email, hashed_password, token))

        conn.commit()
        return jsonify({"message": "Registration Complete!", "token": token}), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()