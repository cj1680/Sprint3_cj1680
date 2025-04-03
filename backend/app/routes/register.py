from flask import Blueprint, jsonify, request
import os
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash
import psycopg2

bp = Blueprint("register", __name__, url_prefix="/register")

@bp.route("/", methods=["POST"])
def register():
    url = os.environ.get('DATABASE_ACCESS_KEY')

    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')


    # Hash the password
    hashed_password = generate_password_hash(password)

    try:
        # Connect to the database
        conn = psycopg2.connect(url)
        cursor = conn.cursor()

        # Insert user into the database
        cursor.execute('''
            INSERT INTO users(name, email, password) 
                VALUES (%s, %s, %s)
        ''', (name, email, hashed_password))

        conn.commit()
        return jsonify({"message": "Registration Complete!"}), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()