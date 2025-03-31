from app import create_app
from flask_cors import CORS
import os
from dotenv import load_dotenv
import psycopg2

app = create_app()
CORS(app)

@app.before_request
def startup():
    url = os.environ.get('DATABASE_ACCESS_KEY')

    try:
        conn = psycopg2.connect(url)
        cursor = conn.cursor()
        
        # Create users table if it doesn't exist
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL
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

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)