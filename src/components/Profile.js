import React, { useState, useEffect, useRef } from 'react';
import Header from './Header';
import avatar from '../pictures/avatarPFP.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
const Profile = () => {

  // state for storing user info
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [bio, setBio] = useState('');
  const [dob, setDob] = useState('');
  const [id, setId] = useState('');
  const [occupation, setOccupation] = useState('')
  const [notification, setNotification] = useState({ message: '', type: '' });

  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  // reference used when dealing with files inputs
  const fileInputRef = useRef(null);

  //trigger file selection when Change button is clicked
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // handle file input change and update preview
  const handleFileChange = (e) => {


    // check if file input event occurred and a file was actually selected
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  // a reusable notification component
  const Notification = ({message, type}) => {
    if (!message) return null;
  
    return (
      <div 
        className="toast-container position-fixed top-0 end-0 p-3" 
        style={{ zIndex: 1100 }}
      >
        <div 
          className={`toast show ${type === 'success' ? 'bg-success' : 'bg-danger'} text-white`} 
        >
          <div className="toast-body">
            {message}
          </div>
        </div>
      </div>
    );
  };

  useEffect(()=>{

    // get user id, name, and email through local storage upon login
    const storedUser = JSON.parse(localStorage.getItem('user'))
    if (storedUser && storedUser.email) {

      // Pre-fill fields with localStorage values
      setName(storedUser.name);
      setEmail(storedUser.email);
      setId(storedUser.id);
      
      // make call to endpoint passing in current user's email to get more info related to email
      fetch(`http://127.0.0.1:5000/userinfo?email=${encodeURIComponent(storedUser.email)}`)
      .then( response => response.json())
      .then(data => {

        // error handling 
        if (data.error) {
          showNotification(data.error, 'error');

        // sucess case
        } else {

           // Update fields with fetched data
           setName(data.name);
           setEmail(data.email); 
           setBio(data.bio || '');
           setDob(data.dob || '');
           setCountry(data.country || '');
           setPhone(data.phone || '');
           setOccupation(data.occupation || '');
          
           console.log('pic: ', data.profilePic)
           if (data.profile_pic) {
            setProfilePicPreview(`http://127.0.0.1:5000/uploads/${data.profile_pic}`);
          }

          
        }

      }).catch(error => {
        console.error("Error fetching user info:", error);
        showNotification("Error fetching user info.", 'error');
      })
    } else {
      showNotification("User not logged in.", 'error');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault()

    // create a FormData object (needed for file object)
    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("occupation", occupation);
    formData.append("phone", phone);
    formData.append("dob", dob);
    formData.append("country", country);
    formData.append("bio", bio);
    
    // append file if it exists
    if (profilePic) {
      formData.append("profile_pic", profilePic);
    }


    // call update pfp endpoint with payload for body
    fetch('http://127.0.0.1:5000/update_profile', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {

        // error handling 
        if (data.error) {
          showNotification(data.error, 'error');

        // on success
        } else {
          showNotification(data.message, 'success');
          localStorage.setItem('user', JSON.stringify({ name, email, id})); // localStorage with new info
        }
      })
      .catch(error => {
        showNotification("Error updating profile.", 'error');
      });
    
  }

  const showNotification = (message, type) => {

    setNotification({ message, type });

    // Clear notification after 4 seconds
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 4000);
    
  };

  return (
    <>
      <Header />
      {/* Notification pop-up */}
      <Notification 
        message={notification.message} 
        type={notification.type} 
        onClose={() => setNotification({ message: '', type: '' })}
      />
      <div 
        className='d-flex flex-column flex-md-row align-items-start justify-content-start' 
        style={{ backgroundColor: "#101010", marginTop: "1rem", height: "100vh" }}
      >


        {/* Sidebar */}
        <div 
          className='d-flex flex-column border border-black pt-5 col-md-3 col-12' 
          style={{height: "100%", backgroundColor: "#CFB991", borderRadius: "10px" }}
        >
          {/* Profile Section */}
          <div 
            className='border-bottom border-black d-flex flex-column align-items-center p-3' 
            style={{ backgroundColor: "#CFB991" }}
          >
            <div style={{ position: 'relative' }}>
              <img
                alt="Profile Avatar"
                src={profilePicPreview || avatar}
                style={{ height: "150px", width: "150px", borderRadius: "50%", objectFit: "cover", border: "3px solid #101010" }}
              />
              <button
                type="button"
                onClick={handleButtonClick}
                className="btn btn-sm "
                style={{ position: 'absolute', top: 0, right: 0, borderRadius: "50%", width: "40px", height: "40px", backgroundColor: "#101010"}}
              >
                <FontAwesomeIcon icon={faEdit} className='text-white'/>
              </button>
            </div>
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleFileChange}
            />

            <h2 className='mt-3 text-black'>{name || "Your Name"}</h2>
          </div>

          {/* Sidebar Links */}
          <div className='mt-3 p-3'>
            <p className="text-black fw-bold fs-5 text-center">Account</p>
            <p className="text-black fw-bold fs-5 text-center">Security & Privacy</p>
            <p className="text-black fw-bold fs-5 text-center">Mobile</p>
            <p className="text-black fw-bold fs-5 text-center">Find Friends</p>
            <p className="text-black fw-bold fs-5 text-center">History</p>
          </div>
        </div>

        {/* Content Section */}
        <div 
          className='p-4 pt-5' 
          style={{ width: "100%", backgroundColor: "#101010", color: "white", heght: "100%"}}
        >
          <div className='p-4'>
            <h2 className="mb-4" style={{ color: "#CFB991", textAlign: "center" }}>Edit Profile</h2>
            <form onSubmit={handleSubmit}>
              <div className='d-flex flex-column align-items-center'>
                <div className='d-flex flex-column flex-md-row align-items-center justify-content-center' style={{width: "100%", gap: "1rem"}}>

                  <div className='d-flex flex-column align-items-center' style={{width: "100%"}}>
                    {/* Name Field */}
                    <div className="mb-3 w-100">
                    <label htmlFor="name" className="form-label" style={{ color: "#CFB991" }}>Name:</label>
                        <input 
                          type="text" 
                          id="name"
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          required 
                          className="form-control"
                          style={{
                            borderRadius: "50px",
                            padding: "12px",
                            border: "1px solid #CFB991",
                            color: "#CFB991"
                          }}
                        />
                      </div>

                      {/* Email Field */}
                      <div className="mb-3 w-100">
                        <label htmlFor="email" className="form-label" style={{ color: "#CFB991" }}>Email:</label>
                        <input 
                          type="email" 
                          id="email"
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          required 
                          className="form-control"
                          style={{
                            borderRadius: "50px",
                            padding: "12px",
                            border: "1px solid #CFB991",
                            color: "#CFB991"
                          }}
                        />
                      </div>

                      {/* occupation Field */}
                      <div className="mb-3 w-100">
                        <label htmlFor="occupation" className="form-label" style={{ color: "#CFB991" }}>Occupation:</label>
                        <input 
                          type="occupation" 
                          id="occupation"
                          value={occupation} 
                          onChange={(e) => setOccupation(e.target.value)} 
                          className="form-control"
                          style={{
                            borderRadius: "50px",
                            padding: "12px",
                            border: "1px solid #CFB991",
                            color: "#CFB991"
                          }}
                        />
                      </div>
                  </div>

                  <div className='d-flex flex-column align-items-center' style={{width: "100%"}}>
                    {/* Phone Number Field */}
                    <div className="mb-3 w-100">
                    <label htmlFor="phone" className="form-label" style={{ color: "#CFB991" }}>Phone Number:</label>
                        <input 
                          type="tel" 
                          id="phone"
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)} 
                          className="form-control"
                          style={{
                            borderRadius: "50px",
                            padding: "12px",
                            border: "1px solid #CFB991",
                            color: "#CFB991"
                          }}
                        />
                      </div>

                      {/* Date of Birth Field */}
                      <div className="mb-3 w-100">
                        <label htmlFor="dob" className="form-label" style={{ color: "#CFB991" }}>Date of Birth:</label>
                        <input 
                          type="date" 
                          id="dob"
                          value={dob} 
                          onChange={(e) => setDob(e.target.value)} 
                          className="form-control"
                          style={{
                            borderRadius: "50px",
                            padding: "12px",
                            border: "1px solid #CFB991",
                            color: "#CFB991"
                          }}
                        />
                      </div>

                      {/* Country Field */}
                      <div className="mb-3 w-100">
                        <label htmlFor="country" className="form-label" style={{ color: "#CFB991" }}>Country:</label>
                        <input 
                          type="text" 
                          id="country"
                          value={country} 
                          onChange={(e) => setCountry(e.target.value)} 
                          className="form-control"
                          style={{
                            borderRadius: "50px",
                            padding: "12px",
                            border: "1px solid #CFB991",
                            color: "#CFB991"
                          }}
                        />
                      </div>
                  </div>

                </div>
                {/* Bio Field */}
                <div className="mb-3 w-100">
                  <label htmlFor="bio" className="form-label" style={{ color: "#CFB991" }}>Bio:</label>
                  <textarea 
                    id="bio"
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                    className="form-control"
                    rows="3"
                    style={{
                      borderRadius: "20px",
                      padding: "12px",
                      border: "1px solid #CFB991",
                      color: "#CFB991"
                    }}
                  ></textarea>
                </div>  
                <button 
                    type="submit" 
                    className="btn w-100 rounded-4"
                    style={{
                      backgroundColor: "#CFB991",
                      border: "3px solid #CFB991",
                      color: "white",
                      fontWeight: "bold",
                      padding: "12px",
                      transition: "0.3s"
                    }}
                  >
                    Save Changes
                  </button>            
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
