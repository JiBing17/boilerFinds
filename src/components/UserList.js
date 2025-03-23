import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faCheck, faXmark, faHandshake } from '@fortawesome/free-solid-svg-icons';
import avatarPlaceholder from '../pictures/avatarPFP.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header';
import findFriendsPic from '../pictures/findFriends.jpg'

const UsersList = () => {

  const [users, setUsers] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState('Discover');
  const [successMessage, setSuccessMessage] = useState("");

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

  // Load friend requests when the "Requests" tab is selected
  useEffect(() => {
    if (selected === "Requests") {
      setLoadingRequests(true);
      if (!storedUser.id) {
        setFriendRequests([]);
        setLoadingRequests(false);
        return;
      }
      fetch(`http://127.0.0.1:5000/friend_requests?user_id=${storedUser.id}`)
        .then(response => response.json())
        .then(data => {
          setFriendRequests(data);
          setLoadingRequests(false);
        })
        .catch(error => {
          console.error("Error loading friend requests:", error);
          setLoadingRequests(false);
        });
    }
  }, [selected, storedUser.id]);

  useEffect(() => {
    if (selected === "Friends") {
      setLoadingFriends(true);
      if (!storedUser.id) {
        setFriends([]);
        setLoadingFriends(false);
        return;
      }
      fetch(`http://127.0.0.1:5000/friends?user_id=${storedUser.id}`)
        .then(response => response.json())
        .then(data => {
          setFriends(data);
          setLoadingFriends(false);
        })
        .catch(error => {
          console.error("Error loading friends:", error);
          setLoadingFriends(false);
        });
    }
  }, [selected, storedUser.id]);
  

  const sendFriendRequest = async (recipientId) => {

    const response = await fetch("http://127.0.0.1:5000/send_friend_request",{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          requester_id: storedUser.id,
          recipient_id: recipientId
        })
      }) 
    
    const data = await response.json()
    if (response.ok) {
        // Show success message
        setSuccessMessage(data.message);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === recipientId ? { ...user, pending: true } : user
          )
        );
        // Clear the success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
    } else {
        console.error(data.error);
    }
    
    console.log("res: ", data)
  }

  const acceptRequest = async (requestId) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/accept_friend_request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ request_id: requestId })
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Success:", data.message);
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };
  
  const rejectRequest = async (requestId) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/reject_friend_request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ request_id: requestId })
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Success:", data.message);
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <>
        <Header/>
        <div
            className="mt-5"
            style={{
                backgroundColor: "#101010",
            }}
        >   
            <div className='d-flex flex-column flex-md-row align-items-center justify-content-center p-4 gap-3 w-100'>

                <div className='d-flex flex-column align-items-center w-100'>
                    <h2 className="text-center" style={{ color: "#ffffff" }}>
                        <FontAwesomeIcon icon={faHandshake} className='me-2' />

                        <span style={{color: "#CFB991", fontWeight: "bold"}}>Find</span> and <span style={{color: "#CFB991", fontWeight: "bold"}}>Add</span> Friends
                    </h2>
                    <p className="text-center text-white mx-auto fst-italic w-75">
                        Connect with people you know and expand your network. Easily find and add friends to stay updated with their latest activities.  
                        Search for users, send friend requests, and build meaningful connections effortlessly.
                    </p>
                </div>

                <div className='d-flex align-items-center justify-content-center w-100'>
                    <img src={findFriendsPic} style={{
                        width: "100%",
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
                <button className='w-100 px-4 py-2 text-white fw-bold' style={{fontSize: "1.2rem",  backgroundColor: `${selected === "Discover" ? "#9E6E0B": "#C8890E"}` }} onClick={()=> {setSelected("Discover")}}>Discover</button>
                <button className='w-100 px-4 py-2 text-white fw-bold' style={{fontSize: "1.2rem",  backgroundColor: `${selected === "Friends" ? "#9E6E0B": "#C8890E"}`}} onClick={()=> {setSelected("Friends")}}>Friends</button>
                <button className='w-100 px-4 py-2 text-white fw-bold' style={{fontSize: "1.2rem",  backgroundColor: `${selected === "Requests" ? "#9E6E0B": "#C8890E"}`}} onClick={()=> {setSelected("Requests")}}>Requests</button>
            </div>
            {selected == "Discover" && ( 
                <div className="row p-4" style={{ backgroundColor: "#CFB991" }}>
                    {/* Success message */}
                    {successMessage && (
                    <div className="col-12 text-center my-4">
                        <div className="alert alert-success" role="alert">
                        {successMessage}
                        </div>
                    </div>
                    )}
                    <div className="d-flex align-items-center justify-content-center p-4 w-100">
                    <form className="form-inline my-2 my-lg-0 d-flex gap-2" onSubmit={(e) => e.preventDefault()}>
                        <input 
                        className="form-control mr-sm-2 w-100" 
                        type="search" 
                        placeholder="Search Users" 
                        aria-label="Search"
                        onChange={(e) => setSearchQuery(e.target.value)}

                        />
                    </form>
                    </div>

                    {filteredUsers.length < 1 ? (
                        <div className="col-12 text-center my-4">
                            <div 
                            className="card mx-auto" 
                            style={{
                                maxWidth: "400px",
                                border: "none",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                borderRadius: "10px"
                            }}
                            >
                            <div className="card-body">
                                <h5 className="card-title" style={{ color: "#333", fontWeight: "bold" }}>No Users Found</h5>
                                <p className="card-text" style={{ color: "#777", fontSize: "0.9rem" }}>
                                We couldn’t find any users matching your criteria.
                                Please refine your search or check back later.
                                </p>
                            </div>
                        </div>
                      </div>
                    ) : (
                    filteredUsers.map(user => (
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
                                onClick={() => sendFriendRequest(user.id)}
                                >
                                {user.pending ? "Pending" : <><FontAwesomeIcon icon={faUserPlus} className="me-2" />Add Friend</>}
                                </button>
                            </div>
                            </div>
                        </div>
                        </div>
                    ))
                    )}
                </div>
                )}

            {selected === "Friends" && (
                <div className='d-flex flex-column bg-white'>
                    <div className='p-4 w-100'>
                    {loadingFriends ? (
                        <p className="text-center">Loading friends...</p>
                    ) : friends.length === 0 ? (
                        <div className="col-12 text-center my-4">
                            <div 
                            className="card mx-auto" 
                            style={{
                                maxWidth: "400px",
                                border: "none",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                borderRadius: "10px"
                            }}
                            >
                            <div className="card-body">
                                <h5 className="card-title" style={{ color: "#333", fontWeight: "bold" }}>No Friends Yet</h5>
                                <p className="card-text" style={{ color: "#777", fontSize: "0.9rem" }}>
                                    Try adding other users in the "Discover" section!
                                </p>
                            </div>
                        </div>
                      </div>
                    ) : (
                        friends.map(friend => (
                        <div
                            key={friend.friendship_id}
                            className='d-flex align-items-center gap-3 py-4 border-bottom'
                        >
                            <img
                            src={
                                friend.profile_pic
                                ? `http://127.0.0.1:5000/uploads/${friend.profile_pic}`
                                : avatarPlaceholder
                            }
                            style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                                objectFit: "cover"
                            }}
                            alt={friend.name}
                            />
                            <div className='d-flex flex-column justify-content-center w-100'>
                            <h4
                                className="mb-1 fw-bold"
                                style={{ textAlign: "left", fontSize: "1.1rem" }}
                            >
                                {friend.name}
                            </h4>
                            <p
                                className="mb-0 text-muted"
                                style={{ textAlign: "left", fontSize: ".9rem" }}
                            >
                                {friend.email}
                            </p>
                            </div>
                            <button
                            className='px-2 py-1 rounded text-white fw-bold'
                            style={{
                                backgroundColor: "#CFB991",
                                border: "None",
                                boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
                                transition: "all 0.3s ease-in-out"
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.transform = "scale(1.1)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = "scale(1)")
                            }
                            >
                            Message
                            </button>
                        </div>
                        ))
                    )}
                    </div>
                </div>
            )}
            {selected === "Requests" && (
                <div className='d-flex flex-column justify-content-center' style={{ backgroundColor: "white" }}>
                    <div className='d-flex align-items-start w-100 border-bottom'>
                    <h5 className='border-white p-3' style={{ color: "#CFB991" }}>
                        Friend Requests
                    </h5>
                    </div>
                    {loadingRequests ? (
                    <p className="text-center">Loading friend requests...</p>
                    ) : friendRequests.length === 0 ? (
                        <div className="col-12 text-center my-4">
                            <div 
                                className="card mx-auto" 
                                style={{
                                    maxWidth: "400px",
                                    border: "none",
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                    borderRadius: "10px"
                                }}
                            >
                                <div className="card-body">
                                    <h5 className="card-title" style={{ color: "#333", fontWeight: "bold" }}>No Requests</h5>
                                    <p className="card-text" style={{ color: "#777", fontSize: "0.9rem" }}>
                                    You have no friend requests at the moment.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                    friendRequests.map(req => (
                        <div key={req.request_id} className='d-flex align-items-center gap-3 p-4'>
                        <img
                            src={
                            req.requester.profile_pic
                                ? `http://127.0.0.1:5000/uploads/${req.requester.profile_pic}`
                                : avatarPlaceholder
                            }
                            alt={req.requester.name}
                            style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            objectFit: "cover"
                            }}
                        />
                        <div className='d-flex flex-column justify-content-center w-100'>
                            <h4 className="mb-1 fw-bold" style={{ textAlign: "left", fontSize: "1.1rem" }}>
                            {req.requester.name}
                            </h4>
                            <p className="mb-0 text-muted" style={{ textAlign: "left", fontSize: ".9rem" }}>
                            {req.requester.email}
                            </p>
                        </div>
                        <button
                            className='rounded-circle fw-bold'
                            style={{
                            backgroundColor: "white",
                            border: "none",
                            boxShadow: "0px 4px 8px rgba(100, 100, 100, 0.2)",
                            transition: "all .3s ease-in-out",
                            width: "50px",
                            height: "50px"
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            onClick={() => acceptRequest(req.request_id)}
                        >
                            <FontAwesomeIcon icon={faCheck} style={{ color: "green" }} size='lg' />
                        </button>
                        <button
                            className='rounded-circle fw-bold'
                            style={{
                            backgroundColor: "white",
                            border: "none",
                            boxShadow: "0px 4px 8px rgba(100, 100, 100, 0.2)",
                            transition: "all .3s ease-in-out",
                            width: "50px",
                            height: "50px"
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            onClick={() => rejectRequest(req.request_id)}
                        >
                            <FontAwesomeIcon icon={faXmark} style={{ color: "red" }} size='lg' />
                        </button>
                        </div>
                    ))
                )}
            </div>
            )}
        </div>
    </>
    
  );
};

export default UsersList;
