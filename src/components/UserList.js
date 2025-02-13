import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faCheck, faXmark} from '@fortawesome/free-solid-svg-icons';
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
            <div className='d-flex flex-column flex-md-row align-items-center justify-content-center p-4'>

                <div className='d-flex flex-column align-items-center'>
                    <h2 className="text-center" style={{ color: "#ffffff" }}>
                        <span style={{color: "#CFB991", fontWeight: "bold"}}>Find</span> and <span style={{color: "#CFB991", fontWeight: "bold"}}>Add</span> Friends
                    </h2>
                    <p className="text-center text-white mx-auto fst-italic">
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
                <button className='w-100 px-4 py-2 text-white fw-bold' style={{backgroundColor: "#C8890E", fontSize: "1.2rem",  border: `${selected === "Discover" ? "2px solid #CFB991": "2px solid black"}`}} onClick={()=> {setSelected("Discover")}}>Discover</button>
                <button className='w-100 px-4 py-2 text-white fw-bold' style={{backgroundColor: "#C8890E", fontSize: "1.2rem",  border: `${selected === "My Friends" ? "2px solid #CFB991": "2px solid black"}`}} onClick={()=> {setSelected("Friends")}}>Friends</button>
                <button className='w-100 px-4 py-2 text-white fw-bold' style={{backgroundColor: "#C8890E", fontSize: "1.2rem",  border: `${selected === "Requests" ? "2px solid #CFB991": "2px solid black"}`}} onClick={()=> {setSelected("Requests")}}>Requests</button>
            </div>
            {selected== "Discover" && (<div className="row p-4" style={{backgroundColor: "#CFB991"}}>

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

            </div>)}
            {selected == "Friends" && (
                <div className='d-flex flex-column bg-white'>
                    
                    <div className='mx-auto p-4' style={{width: "90%"}}>
                        <div className='d-flex align-items-center gap-3 py-4 border-bottom'>
                            <img src={avatarPlaceholder} style={{width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover"}}/>
                            <div className='d-flex flex-column justify-content-center w-100'>
                                <h4 className="mb-1 fw-bold"style={{textAlign: "left", fontSize: "1.1rem"}}>Name</h4>
                                <p className="mb-0 text-muted"style={{textAlign: "left", fontSize: ".9rem"}}>email</p>
                            </div>
                            <button className='px-2 py-1 rounded text-white fw-bold' 
                            style={{
                                backgroundColor: "#CFB991", 
                                border:"None", 
                                boxShadow:"rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
                                transition: "all 0.3s ease-in-out",
                            }} 
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            >Message</button>
                        </div>
                        <div className='d-flex align-items-center gap-3 py-4 border-bottom'>
                            <img src={avatarPlaceholder} style={{width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover"}}/>
                            <div className='d-flex flex-column justify-content-center w-100'>
                                <h4 className="mb-1 fw-bold"style={{textAlign: "left", fontSize: "1.1rem"}}>Name</h4>
                                <p className="mb-0 text-muted"style={{textAlign: "left", fontSize: ".9rem"}}>email</p>
                            </div>
                            <button className='px-2 py-1 rounded text-white fw-bold' 
                            style={{
                                backgroundColor: "#CFB991", 
                                border:"None", 
                                boxShadow:"rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
                                transition: "all 0.3s ease-in-out",
                            }} 
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            >Message</button>
                        </div>
                        <div className='d-flex align-items-center gap-3 py-4 border-bottom'>
                            <img src={avatarPlaceholder} style={{width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover"}}/>
                            <div className='d-flex flex-column justify-content-center w-100'>
                                <h4 className="mb-1 fw-bold"style={{textAlign: "left", fontSize: "1.1rem"}}>Name</h4>
                                <p className="mb-0 text-muted"style={{textAlign: "left", fontSize: ".9rem"}}>email</p>
                            </div>
                            <button className='px-2 py-1 rounded text-white fw-bold' 
                            style={{
                                backgroundColor: "#CFB991", 
                                border:"None", 
                                boxShadow:"rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
                                transition: "all 0.3s ease-in-out",
                            }} 
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            >Message</button>
                        </div>
                        <div className='d-flex align-items-center gap-3 py-4 border-bottom'>
                            <img src={avatarPlaceholder} style={{width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover"}}/>
                            <div className='d-flex flex-column justify-content-center w-100'>
                                <h4 className="mb-1 fw-bold"style={{textAlign: "left", fontSize: "1.1rem"}}>Name</h4>
                                <p className="mb-0 text-muted"style={{textAlign: "left", fontSize: ".9rem"}}>email</p>
                            </div>
                            <button className='px-2 py-1 rounded text-white fw-bold' 
                            style={{
                                backgroundColor: "#CFB991", 
                                border:"None", 
                                boxShadow:"rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
                                transition: "all 0.3s ease-in-out",
                            }} 
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            >Message</button>
                        </div>
                        
                    </div>
                    
                </div>
            )}
            {selected == "Requests" && (
                <div className='d-flex flex-column justify-content-center align-items-center' style={{backgroundColor: "white"}}>
                    <div className='d-flex align-items-start w-100 border-bottom'>

                        <h5 className='border-white p-3' style={{color: "#CFB991"}}>                    
                            Friend Requests
                        </h5>
                    </div>

                    <div className='d-flex flex-column w-100'>

                        <div className='d-flex align-items-center gap-3 p-4'>
                            
                            <img src={avatarPlaceholder} style={{width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover"}}/>
                            <div className='d-flex flex-column justify-content-center w-100'>
                                <h4 className="mb-1 fw-bold"style={{textAlign: "left", fontSize: "1.1rem"}}>Name</h4>
                                <p className="mb-0 text-muted"style={{textAlign: "left", fontSize: ".9rem"}}>email</p>
                            </div>

                            <button className='rounded-circle fw-bold' style={{backgroundColor: "white", border: "none", boxShadow: "0px 4px 8px rgba(100, 100, 100, 0.2)", transition: "all .3s ease-in-out", width: "50px", height: "50px"}}    
                                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
                                <FontAwesomeIcon icon={faCheck} style={{color:"green"}} size='lg'/>
                            </button>
                            <button className='rounded-circle fw-bold' style={{backgroundColor: "white", border: "none", boxShadow: "0px 4px 8px rgba(100, 100, 100, 0.2)", transition: "all .3s ease-in-out", width: "50px", height: "50px"}} 
                                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
                                <FontAwesomeIcon icon={faXmark} style={{color:"red"}} size='lg'/>
                            </button>

                        </div>
                        <div className='d-flex align-items-center gap-3 p-4'>
                            
                            <img src={avatarPlaceholder} style={{width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover"}}/>
                            <div className='d-flex flex-column justify-content-center w-100'>
                                <h4 className="mb-1 fw-bold"style={{textAlign: "left", fontSize: "1.1rem"}}>Name</h4>
                                <p className="mb-0 text-muted"style={{textAlign: "left", fontSize: ".9rem"}}>email</p>
                            </div>

                            <button className='rounded-circle fw-bold' style={{backgroundColor: "white", border: "none", boxShadow: "0px 4px 8px rgba(100, 100, 100, 0.2)", transition: "all .3s ease-in-out", width: "50px", height: "50px"}}    
                                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
                                <FontAwesomeIcon icon={faCheck} style={{color:"green"}} size='lg'/>
                            </button>
                            <button className='rounded-circle fw-bold' style={{backgroundColor: "white", border: "none", boxShadow: "0px 4px 8px rgba(100, 100, 100, 0.2)", transition: "all .3s ease-in-out", width: "50px", height: "50px"}} 
                                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
                                <FontAwesomeIcon icon={faXmark} style={{color:"red"}} size='lg'/>
                            </button>

                        </div>
                        <div className='d-flex align-items-center gap-3 p-4'>
                            
                            <img src={avatarPlaceholder} style={{width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover"}}/>
                            <div className='d-flex flex-column justify-content-center w-100'>
                                <h4 className="mb-1 fw-bold"style={{textAlign: "left", fontSize: "1.1rem"}}>Name</h4>
                                <p className="mb-0 text-muted"style={{textAlign: "left", fontSize: ".9rem"}}>email</p>
                            </div>

                            <button className='rounded-circle fw-bold' style={{backgroundColor: "white", border: "none", boxShadow: "0px 4px 8px rgba(100, 100, 100, 0.2)", transition: "all .3s ease-in-out", width: "50px", height: "50px"}}    
                                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
                                <FontAwesomeIcon icon={faCheck} style={{color:"green"}} size='lg'/>
                            </button>
                            <button className='rounded-circle fw-bold' style={{backgroundColor: "white", border: "none", boxShadow: "0px 4px 8px rgba(100, 100, 100, 0.2)", transition: "all .3s ease-in-out", width: "50px", height: "50px"}} 
                                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
                                <FontAwesomeIcon icon={faXmark} style={{color:"red"}} size='lg'/>
                            </button>

                        </div>
                        <div className='d-flex align-items-center gap-3 p-4'>
                            
                            <img src={avatarPlaceholder} style={{width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover"}}/>
                            <div className='d-flex flex-column justify-content-center w-100'>
                                <h4 className="mb-1 fw-bold"style={{textAlign: "left", fontSize: "1.1rem"}}>Name</h4>
                                <p className="mb-0 text-muted"style={{textAlign: "left", fontSize: ".9rem"}}>email</p>
                            </div>

                            <button className='rounded-circle fw-bold' style={{backgroundColor: "white", border: "none", boxShadow: "0px 4px 8px rgba(100, 100, 100, 0.2)", transition: "all .3s ease-in-out", width: "50px", height: "50px"}}    
                                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
                                <FontAwesomeIcon icon={faCheck} style={{color:"green"}} size='lg'/>
                            </button>
                            <button className='rounded-circle fw-bold' style={{backgroundColor: "white", border: "none", boxShadow: "0px 4px 8px rgba(100, 100, 100, 0.2)", transition: "all .3s ease-in-out", width: "50px", height: "50px"}} 
                                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
                                <FontAwesomeIcon icon={faXmark} style={{color:"red"}} size='lg'/>
                            </button>

                        </div>

                        
                    </div>

                </div>
            )}
        </div>
    </>
    
  );
};

export default UsersList;
