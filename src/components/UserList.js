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
  const [selected, setSelected] = useState('Discover');
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
            className="mt-5"
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

            <div className='d-flex align-items-center'>
                <button className='w-100 px-4 py-2 text-white fw-bold' style={{backgroundColor: "#C8890E", fontSize: "1.2rem",  border: `${selected === "Discover" ? "2px solid white": "2px solid black"}`}} onClick={()=> {setSelected("Discover")}}>Discover</button>
                <button className='w-100 px-4 py-2 text-white fw-bold' style={{backgroundColor: "#C8890E", fontSize: "1.2rem",  border: `${selected === "My Friends" ? "2px solid white": "2px solid black"}`}} onClick={()=> {setSelected("My Friends")}}>My Friends</button>
                <button className='w-100 px-4 py-2 text-white fw-bold' style={{backgroundColor: "#C8890E", fontSize: "1.2rem",  border: `${selected === "Requests" ? "2px solid white": "2px solid black"}`}} onClick={()=> {setSelected("Requests")}}>Requests</button>
            </div>
            <div className="row p-4" style={{backgroundColor: "#CFB991"}}>

                <div className='d-flex align-items-center justify-content-center p-4 w-100'>
                    <form class="form-inline my-2 my-lg-0 d-flex gap-2">
                        <input class="form-control mr-sm-2 w-100" type="search" placeholder="Search" aria-label="Search"/>
                        <button class="btn my-2 my-sm-0 px-4 text-white fw-bold" style={{backgroundColor: "#C8890E", boxShadow:"rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px"}} type="submit">Search</button>
                    </form>
                </div>

                {users.map(user => (
                <div key={user.id} className="col-md-2 mb-4 d-flex justify-content-center">
                    <div
                        className="card h-100 w-100"
                        style={{
                            backgroundColor: "white",
                            boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
                            borderRadius: "0.5rem",
                            transition: "transform 0.3s",
                            minHeight: "320px",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                    >
                    <div className="card-body d-flex flex-column align-items-center justify-content-center gap-2">
                        <div className="d-flex align-items-center justify-content-center ">
                            <img
                                src={
                                user.profile_pic
                                    ? `http://127.0.0.1:5000/uploads/${user.profile_pic}`
                                    : avatarPlaceholder
                                }
                                alt={user.name}
                                className="rounded-circle me-3"
                                style={{
                                width: "90px",
                                height: "90px",
                                objectFit: "cover",
                                border: `4px solid #CFB991`
                                }}
                            />
                        </div>
                        <h5 className="mb-0 text-center text-truncate w-100" style={{ color: "#000000" }}>
                        {user.name}
                        </h5>
                        <p className="mb-0 text-center text-truncate w-100" style={{ color: "#000000", fontSize: "0.9rem" }}>
                        {user.email}
                        </p>
                        <div className="mt-auto">
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
