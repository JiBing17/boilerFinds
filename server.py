from flask import Flask, request, jsonify
import psycopg2
from psycopg2 import sql
from flask_cors import CORS
from dotenv import load_dotenv
import os


app = Flask(__name__)
CORS(app)  # enable CORS so React can call the Flask API
load_dotenv()  # load environment variables from .env file


# function to connect to PostgreSQL
def get_db_connection():
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("DATABASE_NAME"),
            user=os.getenv("DATABASE_USER"),
            password=os.getenv("DATABASE_PASSWORD"),
            host=os.getenv("DATABASE_HOST"),
            port=os.getenv("DATABASE_PORT")
        )
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None
    
    
# function to create the 'items' table if it doesn't exist
def create_items_table():
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        create_table_query = """
        CREATE TABLE IF NOT EXISTS items (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            item VARCHAR(100) NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            description TEXT,
            email VARCHAR(100) NOT NULL
        );
        """
        cur.execute(create_table_query)
        conn.commit()

        cur.close()
        conn.close()
        print("✅ Table 'items' checked/created successfully.")
    except Exception as e:
        print(f"⚠️ Error creating table: {e}")

# tables gets created on server start
create_items_table()


# flask route to handle form submission
@app.route('/submit', methods=['POST'])
def submit_form():
    try:
        # get JSON data from the request that was passed in
        data = request.get_json()
        name = data.get('name')
        item = data.get('item')
        price = data.get('price')
        description = data.get('description')
        email = data.get('email')

        # all fields must be filled
        if not all([name, item, price, description, email]):
            return jsonify({"error": "All fields are required!"}), 400

        # cpnnect to PostgreSQL 
        conn = get_db_connection()
        
        if conn is None: # failed connection
            return jsonify({"error": "Database connection failed!"}), 500
        
        # tool used to write SQL queries here
        cur = conn.cursor()

        # get table to insert and parameters 
        insert_query = sql.SQL(
            "INSERT INTO items (name, item, price, description, email) VALUES (%s, %s, %s, %s, %s)"
        )
        
        cur.execute(insert_query, (name, item, price, description, email)) # write to db given table and parameters + values
        
        # commit and close the connection
        conn.commit()
        cur.close()
        conn.close()

        # return success message
        return jsonify({"message": "Item submitted successfully!"}), 200

    # return error message
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while submitting the form."}), 500
    
# API endpoint to retrieve all items from the database
@app.route('/items', methods=['GET'])
def get_items():
    try:
        
        # get connection and write SQL query to fetch ALL rows within given table
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, name, item, price, description, email FROM items ORDER BY id DESC;")
        items = cur.fetchall()
        
        # close all connection to postgres
        cur.close()
        conn.close()

        # store data in array of objects
        items_list = [  
            {"id": row[0], "name": row[1], "item": row[2], "price": float(row[3]), "description": row[4], "email": row[5]}
            for row in items
        ]
        # return that data
        return jsonify(items_list), 200

    except Exception as e:
        print(f"⚠️ Error fetching data: {e}")
        return jsonify({"error": "Failed to retrieve items."}), 500

if __name__ == '__main__':
    app.run(debug=True)
