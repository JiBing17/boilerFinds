from flask import Flask, request, jsonify
import psycopg2
from psycopg2 import sql
from flask_cors import CORS
from dotenv import load_dotenv
import os
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from flask import send_from_directory


app = Flask(__name__)
CORS(app)  # enable CORS so React can call the Flask API
load_dotenv()  # load environment variables from .env file

# build the path to the uploads folder inside the src folder
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'src', 'uploads')

# folder for submited item pics
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# route for accessing pics
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


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
            email VARCHAR(100) NOT NULL,
            image TEXT
        );
        """
        cur.execute(create_table_query)
        conn.commit()

        cur.close()
        conn.close()
        print("✅ Table 'items' checked/created successfully.")
    except Exception as e:
        print(f"⚠️ Error creating table: {e}")
        
# function to create the 'users' table if it doesn't exist
def create_users_table():
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        create_table_query = """
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        );
        """
        cur.execute(create_table_query)
        conn.commit()

        cur.close()
        conn.close()
        print("✅ Table 'users' checked/created successfully.")
    except Exception as e:
        print(f"⚠️ Error creating users table: {e}")


# tables gets created on server start
create_items_table()
create_users_table()

# signup endpoint
@app.route('/signup', methods=['POST'])
def signup():
    try:
        
        # get sign up info from call
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        
        # all filled
        if not all([name, email, password]):
            return jsonify({"error": "All fields are required!"}), 400
        
        
        hashed_password = generate_password_hash(password)  # hash password
        
        # add to db user info
        conn = get_db_connection()
        cur = conn.cursor()

        # insert user data
        insert_query = sql.SQL(
            "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s)"
        )
        cur.execute(insert_query, (name, email, hashed_password))
        
        # save and close db
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"message": "User registered successfully!"}), 201

    except psycopg2.IntegrityError:
        return jsonify({"error": "Email already exists!"}), 400
    except Exception as e:
        print(f"⚠️ Error inserting user: {e}")
        return jsonify({"error": "An error occurred while registering."}), 500

# login endpoint
@app.route('/login', methods=['POST'])
def login():
    try:
        
        # get info from call
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # not filled
        if not all([email, password]):
            return jsonify({"error": "All fields are required!"}), 400
        
        # connect to db and run SQL query for grabbing user with that email and password
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, name, password_hash FROM users WHERE email = %s", (email,))
        user = cur.fetchone()
        
        # close db
        cur.close()
        conn.close()

        # valid and user exist
        if user and check_password_hash(user[2], password):
            return jsonify({"message": "Login successful!", "user": {"id": user[0], "name": user[1], "email": email}}), 200
        # failed
        else:
            return jsonify({"error": "Invalid credentials!"}), 401
        
    # server error when getting data
    except Exception as e:
        print(f"⚠️ Error during login: {e}")
        return jsonify({"error": "An error occurred during login."}), 500


# flask route to handle form submission
@app.route('/submit', methods=['POST'])
def submit_form():
    try:
        # Using multipart/form-data: get text fields from request.form and file from request.files
        name = request.form.get('name')
        item = request.form.get('item')
        price = request.form.get('price')
        description = request.form.get('description')
        email = request.form.get('email')
        image_file = request.files.get('image')
        image_filename = None
        
        if image_file:
            image_filename = secure_filename(image_file.filename)
            image_file.save(os.path.join(app.config['UPLOAD_FOLDER'], image_filename))
                    
                    
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
            "INSERT INTO items (name, item, price, description, email, image) VALUES (%s, %s, %s, %s, %s, %s)"
        )
        cur.execute(insert_query, (name, item, price, description, email, image_filename)) # write to db given table and parameters + values
        
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
        cur.execute("SELECT id, name, item, price, description, email, image FROM items ORDER BY id DESC;")
        items = cur.fetchall()
        
        # close all connection to postgres
        cur.close()
        conn.close()

        # store data in array of objects
        items_list = [  
            {"id": row[0], "name": row[1], "item": row[2], "price": float(row[3]), "description": row[4], "email": row[5], "image": row[6]}
            for row in items
        ]
        # return that data
        return jsonify(items_list), 200

    # server error when getting data
    except Exception as e:
        print(f"⚠️ Error fetching data: {e}")
        return jsonify({"error": "Failed to retrieve items."}), 500

# run server
if __name__ == '__main__':
    app.run(debug=True)
