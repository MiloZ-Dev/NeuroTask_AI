import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

POSTGRES_DB = os.getenv("POSTGRES_DB")
POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")

def create_database_if_not_exists():
    try:
        conn = psycopg2.connect(
        dbname='postgres',
        user=POSTGRES_USER,
        password=POSTGRES_PASSWORD,
        host=POSTGRES_HOST,
        port=POSTGRES_PORT
        )
        conn.autocommit = True
        cursor = conn.cursor()

        # Verify if the database already exists
        cursor.execute(f"SELECT 1 FROM pg_database WHERE datname = '{POSTGRES_DB}'")
        exists = cursor.fetchone()

        if not exists:
            # Create the database if it does not exist
            cursor.execute(f"CREATE DATABASE {POSTGRES_DB} with encoding 'UTF8'")
            print(f"Database {POSTGRES_DB} created successfully.")
        else:
            print(f"Database {POSTGRES_DB} already exists.")

        cursor.close()
        conn.close()
    except Exception as e:
        print(f"An error occurred while creating the database: {e}")
