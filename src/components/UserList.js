import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import avatarPlaceholder from '../pictures/avatarPFP.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header';
import findFriendsPic from '../pictures/findFriends.jpg'

const UsersList = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // retrieve the currently logged in user's email from localStorage
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const currentUserEmail = storedUser?.email;

  useEffect(() => {
    if (!currentUserEmail) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    // fetch all users except the current one
    fetch(`http://127.0.0.1:5000/all_users?email=${encodeURIComponent(currentUserEmail)}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setUsers(data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
        setError("Error loading users.");
        setLoading(false);
      });
  }, [currentUserEmail]);

  console.log(users)

  return (
    <>
        <Header/>
        <div
            className=" mt-5 p-4"
            style={{
                backgroundColor: "#101010",
            }}
        >   
            <div className='d-flex align-items-center justify-content-center p-4'>
                <div>
                    <h2 className="text-center" style={{ color: "#ffffff" }}>
                        Find and Add Friends
                    </h2>
                    <p className="text-center text-white mx-auto">
                        Connect with people you know and expand your network. Easily find and add friends to stay updated with their latest activities.  
                        Search for users, send friend requests, and build meaningful connections effortlessly.
                    </p>
                </div>
                <div className='d-flex align-items-center justify-content-center'>
                    <img src={findFriendsPic} style={{
                        width: "60%",
                        height: "auto",
                        borderRadius: "10px",
                        boxShadow: "0px 4px 8px rgba(255, 255, 255, 0.2)"
                    }}/>
                </div>
                
            </div>
            

            {loading && (
                <p className="text-center" style={{ color: "#fff" }}>
                Loading users...
                </p>
            )}
            {error && (
                <p className="text-center text-danger">
                {error}
                </p>
            )}

            <div className="row">
                {users.map(user => (
                <div key={user.id} className="col-md-4 mb-4">
                    <div
                    className="card h-100"
                    style={{
                        backgroundColor: "#CFB991",
                        border: `4px solid #C8890E`,
                        borderRadius: "0.5rem",
                        transition: "transform 0.3s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                    >
                    <div className="card-body">
                        <div className="d-flex align-items-center">
                        <img
                            src={
                            user.profile_pic
                                ? `http://127.0.0.1:5000/uploads/${user.profile_pic}`
                                : avatarPlaceholder
                            }
                            alt={user.name}
                            className="rounded-circle me-3"
                            style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            border: `2px solid #101010`
                            }}
                        />
                        <div>
                            <h5 className="mb-0" style={{ color: "#000000" }}>
                            {user.name}
                            </h5>
                            <p className="mb-0" style={{ color: "#000000", fontSize: "0.9rem" }}>
                            {user.email}
                            </p>
                        </div>
                        </div>
                        <div className="mt-3">
                        <button
                            className="btn w-100"
                            style={{
                            backgroundColor: "#C8890E",
                            color: "#000",
                            border: "none",
                            borderRadius: "0.5rem",
                            fontWeight: "bold"
                            }}
                        >
                            <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                            Add Friend
                        </button>
                        </div>
                    </div>
                    </div>
                </div>
                ))}
            </div>
        </div>
    </>
    
  );
};

export default UsersList;
