from flask import Blueprint
import os
from dotenv import load_dotenv
import psycopg2

bp = Blueprint("startup", __name__, url_prefix="/startup")

@bp.route("/", methods=["POST"])
def startup():
    url = os.environ.get('DATABASE_ACCESS_KEY')

    try:
        conn = psycopg2.connect(url)
        cursor = conn.cursor()
        
        # Create users table if it doesn't exist
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL,
                name VARCHAR(50),
                email VARCHAR(50),
                password VARCHAR(255),
                CONSTRAINT pk_users PRIMARY KEY (id),
                CONSTRAINT nn_name NOT NULL (name),
                CONSTRAINT nn_email NOT NULL (email),
                CONSTRAINT nn_password NOT NULL (password),
                CONSTRAINT email_unique UNIQUE (email)
            );
        ''')
        conn.commit()

    except Exception as e:
        print(f"Error initializing tables: {e}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()