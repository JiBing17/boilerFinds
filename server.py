from flask import Flask, request, jsonify
import psycopg2
from psycopg2 import sql
from flask_cors import CORS
from dotenv import load_dotenv
import os
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from flask import send_from_directory
from flask_mail import Mail, Message
import requests
from math import radians, sin, cos, sqrt, atan2


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


OVERPASS_URL = "https://overpass-api.de/api/interpreter"


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
            password_hash TEXT NOT NULL,
            bio TEXT,
            country VARCHAR(100),
            phone VARCHAR(20),
            dob VARCHAR(20),
            occupation VARCHAR(100),
            profile_pic TEXT
        );
        """
        cur.execute(create_table_query)
        conn.commit()

        cur.close()
        conn.close()
        print("✅ Table 'users' checked/created successfully.")
    except Exception as e:
        print(f"⚠️ Error creating users table: {e}")
        
# function to create the 'saved movies' table if it doesn't exist
        
def create_saved_movies_table():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        create_table_query = """
        CREATE TABLE IF NOT EXISTS saved_movies (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            movie_id INTEGER NOT NULL,
            title VARCHAR(255) NOT NULL,
            poster_path TEXT,
            vote_average DECIMAL(3,1)
        );
        """
        cur.execute(create_table_query)
        conn.commit()
        cur.close()
        conn.close()
        print("✅ Table 'saved_movies' checked/created successfully.")
    except Exception as e:
        print(f"⚠️ Error creating saved_movies table: {e}")

# function to create the 'friend request' table if it doesn't exist
def create_friend_requests_table():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        create_table_query = """
        CREATE TABLE IF NOT EXISTS friend_requests (
            id SERIAL PRIMARY KEY,
            requester_id INTEGER NOT NULL,
            recipient_id INTEGER NOT NULL,
            status VARCHAR(20) DEFAULT 'pending',
            UNIQUE(requester_id, recipient_id)
        );
        """
        cur.execute(create_table_query)
        conn.commit()
        cur.close()
        conn.close()
        print("✅ Table 'friend_requests' checked/created successfully.")
    except Exception as e:
        print(f"⚠️ Error creating friend_requests table: {e}")
        
# function to create the 'messages' table if it doesn't exist
def create_messages_table():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        create_table_query = """
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                sender_id INTEGER NOT NULL,
                recipient_id INTEGER NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """
        cur.execute(create_table_query)
        conn.commit()
        cur.close()
        conn.close()
        print("✅ Table 'messages' checked/created successfully.")
    except Exception as e:
        print(f"⚠️ Error creating messages table: {e}")
        
# tables gets created on server start
create_items_table()
create_users_table()
create_saved_movies_table()
create_friend_requests_table()
create_messages_table()

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
        # extract data from passed in form
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
    
    
# route for obtaining current user's info
@app.route('/userinfo', methods=['GET'])
def get_user_info():
    
    
    email = request.args.get('email') # get email passed in from call
    if not email:
        return jsonify({"error": "Email parameter is required"}), 400

    try:
        # connect and fetch user info based on email 
        conn = get_db_connection() 
        cur = conn.cursor()
        
        # obtain certain user info from SELECT sql query
        cur.execute("SELECT id, name, email, occupation, bio, country, phone, dob, profile_pic FROM users WHERE email = %s", (email,))
        user = cur.fetchone()
        cur.close()
        conn.close()
        
        # if user exists return the user's info
        if user:
            # return the user info as JSON based on SELECT
            return jsonify({
                "id": user[0],
                "name": user[1],
                "email": user[2],
                "occupation": user[3],
                "bio": user[4],
                "country": user[5],
                "phone": user[6],
                "dob": user[7],
                "profile_pic": user[8]
                 
            }), 200
        # no user with that email
        else:
            return jsonify({"error": "User not found"}), 404
        
    # general error for connection to server
    except Exception as e:
        print(f"Error fetching user: {e}")
        return jsonify({"error": "An error occurred while fetching user info"}), 500
    
# route used to update user's profile
@app.route('/update_profile', methods=['POST'])
def update_profile():
    
   # Get text fields from the form data
    user_id = request.form.get('id')
    name = request.form.get('name')
    email = request.form.get('email')
    occupation = request.form.get('occupation')
    phone = request.form.get('phone') or ""
    dob = request.form.get('dob') or ""
    country = request.form.get('country') or ""
    bio = request.form.get('bio') or ""
    
    # set pfp if selected from frontend
    profile_pic_filename = None
    print("files: ", request.files)
    if 'profile_pic' in request.files:
        file = request.files['profile_pic']
        if file.filename:
            
            # secure file name and set/save path of current file
            profile_pic_filename = secure_filename(file.filename)
            upload_path = os.path.join(app.config['UPLOAD_FOLDER'], profile_pic_filename)
            file.save(upload_path)

    # update db based on the passed in data
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # if no new file is provided, first fetch the current profile_pic value
        if profile_pic_filename is None:
            cur.execute("SELECT profile_pic FROM users WHERE id = %s", (user_id,))
            row = cur.fetchone()
            if row:
                profile_pic_filename = row[0]  # keep existing filename
        
        # sql query for update 
        update_query = """
            UPDATE users 
            SET name=%s, email=%s, occupation=%s, bio=%s, dob=%s, country=%s, phone=%s, profile_pic=%s
            WHERE id=%s
        """
        # run that sql query
        cur.execute(update_query, (name, email, occupation, bio, dob, country, phone, profile_pic_filename, user_id))
        
        # save and close db
        conn.commit()
        cur.close()
        conn.close()
        
        # return success message
        return jsonify({"message": "Profile updated successfully!"}), 200
    
    # return error message
    except Exception as e:
        print(f"Error updating profile: {e}")
        return jsonify({"error": "An error occurred while updating the profile."}), 500

# route for returning an array of ALL users except current user
@app.route('/all_users', methods=['GET'])
def get_all_users():
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # get the logged-in user's email from query params
        current_user_email = request.args.get("email")

        # First, get the current user's ID
        cur.execute("SELECT id FROM users WHERE email = %s", (current_user_email,))
        user_row = cur.fetchone()
        if not user_row:
            return jsonify({"error": "User not found"}), 404
        current_user_id = user_row[0]

        # Exclude users that are:
        # 1. The current user.
        # 2. Already friends (accepted friend_requests in either direction).
        # 3. Already have a pending friend request (sent by current user).
        query = """
            SELECT id, name, email, profile_pic FROM users
            WHERE email != %s 
            AND id NOT IN (
                SELECT recipient_id FROM friend_requests 
                WHERE requester_id = %s AND status IN ('pending', 'accepted')
                UNION
                SELECT requester_id FROM friend_requests 
                WHERE recipient_id = %s AND status = 'accepted'
            )
        """
        cur.execute(query, (current_user_email, current_user_id, current_user_id)) # run the SQL query
        users = cur.fetchall() # obtain all rows that match

        cur.close() # close cursor
        conn.close() # close db connection

        # store results in an array of dicts
        user_list = [
            {"id": user[0], "name": user[1], "email": user[2], "profile_pic": user[3] or ""}
            for user in users
        ]
        # return array as string
        return jsonify(user_list), 200
    
    # db connection error handling 
    except Exception as e:
        print(f"⚠️ Error fetching users: {e}")
        return jsonify({"error": "Failed to fetch users"}), 500
    
# Function to calculate the distance between two coordinates
def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Radius of the Earth in km
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    distance_km = R * c  # Distance in km
    distance_miles = distance_km * 0.621371  # Convert to miles
    return distance_miles


    
# route for call Overpass API to obtain info on nearby food places
@app.route('/api/food-info')
def food_info():
    
    # retrieve lat and long passed in from call 
    lat = request.args.get('lat')
    lng = request.args.get('lng')
    
    # not enough info
    if not lat or not lng:
        return jsonify({'error': 'Latitude and Longitude are required.'}), 400

    # convert values into float
    try:
        lat = float(lat)
        lng = float(lng)
        
    except ValueError:
        return jsonify({'error': 'Latitude and Longitude must be numbers.'}), 400

    # Define search radius in meters 
    radius = 1000

    # build the Overpass QL query to find restaurants
    query = f"""
    [out:json];
    (
      node["amenity"="restaurant"](around:{radius},{lat},{lng});
      way["amenity"="restaurant"](around:{radius},{lat},{lng});
      relation["amenity"="restaurant"](around:{radius},{lat},{lng});
    );
    out center;
    """

    # Send the request to Overpass API
    response = requests.post(OVERPASS_URL, data={'data': query})
    
    # fail case
    if response.status_code != 200:
        return jsonify({'error': 'Failed to fetch data from Overpass API'}), response.status_code

    # obtain data from sucess call
    data = response.json()
    
    # print(data)
    
    """ Sample : {'type': 'way', 
         'id': 71497486, 
         'center': {'lat': 40.4245646, 'lon': -86.907766}, 
         'nodes': [1312604431, 850436980, 850436891, 1312604494, 1312604431], 
         'tags': {'amenity': 'restaurant', 'building': 'yes', 'name': 'Rolling Bowl'}},  
    """
    
    # process the elements returned by Overpass
    restaurants = []
    cuisines_set = set()  # To store unique cuisines

    for element in data.get('elements', []):
        
        tags = element.get('tags', {})
        cuisine = tags.get("cuisine", "Unknown")

        # Handle multiple cuisines separated by `;`
        cuisine_list = cuisine.split(";") if ";" in cuisine else [cuisine]
        for c in cuisine_list:
            cuisines_set.add(c.strip())  # Add each cuisine type
            
        restaurant = {
            "id": element.get('id'),
            "tags": tags,  
        }
        # extract coordinates either from the element directly or from its center
        if element.get('lat') and element.get('lon'):
            restaurant["lat"] = element.get('lat')
            restaurant["lon"] = element.get('lon')
        elif element.get('center'):
            restaurant["lat"] = element.get('center', {}).get('lat')
            restaurant["lon"] = element.get('center', {}).get('lon')
        restaurants.append(restaurant)    
        
        # Calculate distance if coordinates exist
        if "lat" in restaurant and "lon" in restaurant:
            restaurant["distance_km"] = round(haversine(lat, lng, restaurant["lat"], restaurant["lon"]), 2)
        
        
        # print("res: ", restaurants)
    
    return jsonify({
        "restaurants": restaurants,
        "cuisines": sorted(cuisines_set)  # Convert to sorted list for UI
    })

# End point to save movie 
@app.route('/save_movie', methods=['POST'])
def save_movie():
    
    # get passed in args from POST call from frontend
    data = request.get_json()
    user_id = data.get('user_id')
    movie_id = data.get('movie_id')
    title = data.get('title')
    poster_path = data.get('poster_path')
    vote_average = data.get('vote_average')

    if not all([user_id, movie_id, title]):
        return jsonify({"error": "User ID, movie ID, and title are required."}), 400

    try:
        # get db connection
        conn = get_db_connection()
        cur = conn.cursor()

        # check if this movie is already saved for the user
        cur.execute("SELECT id FROM saved_movies WHERE user_id=%s AND movie_id=%s", (user_id, movie_id))
        result = cur.fetchone()

        if result:
            # movie is already saved, remove it (toggle off)
            cur.execute("DELETE FROM saved_movies WHERE user_id=%s AND movie_id=%s", (user_id, movie_id))
            message = "Movie unsaved successfully."
        else:
            # movie is not saved, insert it
            cur.execute(
                "INSERT INTO saved_movies (user_id, movie_id, title, poster_path, vote_average) VALUES (%s, %s, %s, %s, %s)",
                (user_id, movie_id, title, poster_path, vote_average)
            )
            message = "Movie saved successfully."

        # save changes and close db connection
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({"message": message}), 200
    except Exception as e:
        print(f"Error saving movie: {e}")
        return jsonify({"error": "An error occurred while saving the movie."}), 500


# End point for fetching saved movies based on current user_id 
@app.route('/saved_movies', methods=['GET'])
def get_saved_movies():
    
    # obtain passed in user_id from frontend get call
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "User ID is required."}), 400

    try:
        # connect to db
        conn = get_db_connection()
        cur = conn.cursor()
        
        # run query to get all rows where user_id matches
        cur.execute("SELECT movie_id, title, poster_path, vote_average FROM saved_movies WHERE user_id=%s", (user_id,))
        rows = cur.fetchall()
        
        # close db connection (no save needed)
        cur.close()
        conn.close()

        # store result in array of dictionaries
        movies = []
        for row in rows:
            movies.append({
                "movie_id": row[0],
                "title": row[1],
                "poster_path": row[2],
                "vote_average": float(row[3]) if row[3] is not None else None
            })
        # return that array to frontend
        return jsonify(movies), 200
    # error handling for server error
    except Exception as e:
        print(f"Error fetching saved movies: {e}")
        return jsonify({"error": "An error occurred while fetching saved movies."}), 500
    
# end point for handling friend requests
@app.route('/send_friend_request', methods=['POST'])
def send_friend_request():
    data = request.get_json() # parse string into dict
    requester_id = data.get('requester_id') # obtain requester id from body 
    recipient_id = data.get('recipient_id') # obtain recipient id from body
    
    if not all([requester_id, recipient_id]): # error handling for missing arguments needed
        return jsonify({"error": "Both requester_id and recipient_id are required."}), 400
    
    try:
        # connect to db 
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Check if a request (or friendship) already exists
        cur.execute("""
            SELECT status FROM friend_requests 
            WHERE requester_id = %s AND recipient_id = %s
        """, (requester_id, recipient_id))
        existing = cur.fetchone()
        
        # requester and recipient already have interacted (status isn't null)
        if existing:
            
            status = existing[0]
            # already sent a request
            if status == 'pending':
                return jsonify({"message": "Friend request already sent and pending."}), 200
            # already friends 
            elif status == 'accepted':
                return jsonify({"message": "You are already friends."}), 200
        
        # insert new friend request if no existing relationship
        cur.execute("""
            INSERT INTO friend_requests (requester_id, recipient_id)
            VALUES (%s, %s)
        """, (requester_id, recipient_id))
        
        # save and close db changes
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({"message": "Friend request sent!"}), 200
    
    # error handling for db connection
    except Exception as e:
        print(f"Error sending friend request: {e}")
        return jsonify({"error": "An error occurred while sending the friend request."}), 500
    
@app.route('/friend_requests', methods=['GET'])
def get_friend_requests():
    try:
        # Get the current user's ID from query parameters
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"error": "User id is required."}), 400
        
        # Connect to the database
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Query pending friend requests where the current user is the recipient,
        # and join with the users table to get the requester's details.
        query = """
            SELECT fr.id, fr.requester_id, u.name, u.email, u.profile_pic
            FROM friend_requests fr
            JOIN users u ON fr.requester_id = u.id
            WHERE fr.recipient_id = %s AND fr.status = 'pending'
        """
        cur.execute(query, (user_id,))
        rows = cur.fetchall()
        
        cur.close()
        conn.close()
        
        # Build the list of friend requests
        friend_requests = []
        for row in rows:
            friend_requests.append({
                "request_id": row[0],
                "requester_id": row[1],
                "requester": {
                    "name": row[2],
                    "email": row[3],
                    "profile_pic": row[4] if row[4] is not None else ""
                }
            })
        
        return jsonify(friend_requests), 200
    except Exception as e:
        print(f"Error fetching friend requests: {e}")
        return jsonify({"error": "An error occurred while fetching friend requests."}), 500
    
# endpoint for accepting friend requests
@app.route('/accept_friend_request', methods=['POST'])
def accept_friend_request():
    try:
        data = request.get_json() # parse JSON string into dict
        request_id = data.get('request_id') # get request id from passed in argument from body
        if not request_id:
            return jsonify({"error": "Request id is required."}), 400
        
        # connect to db and activiate cursor for SQL queries
        conn = get_db_connection()  
        cur = conn.cursor()
        
        # Update the friend request status to 'accepted'
        cur.execute("UPDATE friend_requests SET status = 'accepted' WHERE id = %s", (request_id,))
        if cur.rowcount == 0:
            return jsonify({"error": "Friend request not found."}), 404
        
        # save and close changes
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": "Friend request accepted!"}), 200
    
    # error handling
    except Exception as e:
        print(f"Error accepting friend request: {e}")
        return jsonify({"error": "An error occurred while accepting the friend request."}), 500
    
# endpoint to reject friend request 
@app.route('/reject_friend_request', methods=['POST'])
def reject_friend_request():
    try:
        data = request.get_json() # parse JSON string into dict
        request_id = data.get('request_id')
        if not request_id: # needs request id from body 
            return jsonify({"error": "Request id is required."}), 400
        
        # connect to db
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Update the friend request status to 'rejected'
        cur.execute("UPDATE friend_requests SET status = 'rejected' WHERE id = %s", (request_id,))
        if cur.rowcount == 0:
            return jsonify({"error": "Friend request not found."}), 404
        
        # save and close db connection
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({"message": "Friend request rejected!"}), 200
    # db error handling
    except Exception as e:
        print(f"Error rejecting friend request: {e}")
        return jsonify({"error": "An error occurred while rejecting the friend request."}), 500
    
# endpoint used to display current user's friends
@app.route('/friends', methods=['GET'])
def get_friends():
    try:
        user_id = request.args.get('user_id') # get current user's id from query argument
        if not user_id:
            return jsonify({"error": "User id is required."}), 400

        # connect to db
        conn = get_db_connection()
        cur = conn.cursor()

        # The query selects accepted friend relationships.
        # It uses a CASE statement to determine the friend's ID.
        query = """
            SELECT fr.id,
                CASE 
                    WHEN fr.requester_id = %s THEN fr.recipient_id 
                    ELSE fr.requester_id 
                END AS friend_id,
                u.name, u.email, u.profile_pic
            FROM friend_requests fr
            JOIN users u 
              ON u.id = CASE 
                          WHEN fr.requester_id = %s THEN fr.recipient_id 
                          ELSE fr.requester_id 
                        END
            WHERE fr.status = 'accepted' 
              AND (fr.requester_id = %s OR fr.recipient_id = %s)
        """
        
        # run SQL query
        cur.execute(query, (user_id, user_id, user_id, user_id))
        
        # store result in array for the SQL query
        rows = cur.fetchall()
        
        # close db connection
        cur.close()
        conn.close()

        friends = []
        
        # store result into array of dicts
        for row in rows:
            friends.append({
                "friendship_id": row[0],
                "friend_id": row[1],
                "name": row[2],
                "email": row[3],
                "profile_pic": row[4] if row[4] is not None else ""
            })

        return jsonify(friends), 200
    # db error handling
    except Exception as e:
        print(f"Error fetching friends: {e}")
        return jsonify({"error": "An error occurred while fetching friends."}), 500
    
@app.route('/send_message', methods=['POST'])
def send_message():
    try:
        data = request.get_json()
        sender_id = data.get('sender_id')
        recipient_id = data.get('recipient_id')
        content = data.get('content')
        
        if not all([sender_id, recipient_id, content]):
            return jsonify({"error": "Sender, recipient, and content are required."}), 400
        
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO messages (sender_id, recipient_id, content)
            VALUES (%s, %s, %s)
            RETURNING id, created_at
        """, (sender_id, recipient_id, content))
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({
            "message": "Message sent successfully!",
            "message_id": row[0],
            "timestamp": row[1].isoformat() if row[1] else None
        }), 200
        
    except Exception as e:
        print(f"Error sending message: {e}")
        return jsonify({"error": "An error occurred while sending the message."}), 500
    
@app.route('/messages', methods=['GET'])
def get_messages():
    try:
        sender_id = request.args.get('sender_id')
        recipient_id = request.args.get('recipient_id')
        
        if not all([sender_id, recipient_id]):
            return jsonify({"error": "Sender and recipient IDs are required."}), 400
        
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT id, sender_id, recipient_id, content, created_at
            FROM messages
            WHERE (sender_id = %s AND recipient_id = %s)
               OR (sender_id = %s AND recipient_id = %s)
            ORDER BY created_at ASC
        """, (sender_id, recipient_id, recipient_id, sender_id))
        rows = cur.fetchall()
        cur.close()
        conn.close()
        
        messages = []
        for row in rows:
            messages.append({
                "id": row[0],
                "sender_id": row[1],
                "recipient_id": row[2],
                "content": row[3],
                "timestamp": row[4].isoformat() if row[4] else None
            })
            
        return jsonify(messages), 200
        
    except Exception as e:
        print(f"Error retrieving messages: {e}")
        return jsonify({"error": "An error occurred while retrieving messages."}), 500


# run server
if __name__ == '__main__':
    app.run(debug=True)
