import React, { useState, useEffect } from 'react';
import Header from './Header';
import avatar from '../pictures/avatarPFP.png';

const Profile = () => {

  // state for storing user info
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [bio, setBio] = useState('');
  const [dob, setDob] = useState('');
  const [id, setId] = useState('');
  const [occupation, setOccupation] = useState('')

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
          setMessage(data.error);

        // sucess case
        } else {

           // Update fields with fetched data
           setName(data.name);
           setEmail(data.email); 
           setPassword(data.password); 
           setBio(data.bio || '');
           setDob(data.dob || '');
           setCountry(data.country || '');
           setPhone(data.phone || '');
           setOccupation(data.occupation || '');
        }

      }).catch(error => {
        console.error("Error fetching user info:", error);
        setMessage("Error fetching user info.");
      })
    } else {
      setMessage("User not logged in.");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault()

    // load up payload with user info after update for updating db 
    const payload = {
      id,
      name,
      email,
      occupation,
      phone,
      dob,
      country,
      bio
    }

    console.log(payload)

    // call update pfp endpoint with payload for body
    fetch('http://127.0.0.1:5000/update_profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(data => {

        // error handling 
        if (data.error) {
          setMessage(data.error);

        // on success
        } else {
          setMessage(data.message);
          localStorage.setItem('user', JSON.stringify({ name, email, id})); // localStorage with new info
        }
      })
      .catch(error => {
        console.error("Error updating profile:", error);
        setMessage("Error updating profile.");
      });
    
  }

  return (
    <>
      <Header />
      <div 
        className='d-flex align-items-start justify-content-start' 
        style={{ backgroundColor: "#101010", marginTop: "1rem", height: "100vh" }}
      >

        {/* Sidebar */}
        <div 
          className='d-flex flex-column border border-black pt-5' 
          style={{ width: "20%", height: "100%", backgroundColor: "#CFB991", borderRadius: "10px" }}
        >
          {/* Profile Section */}
          <div 
            className='border-bottom border-black d-flex flex-column align-items-center p-3' 
            style={{ backgroundColor: "#CFB991" }}
          >
            <img 
              alt="Profile Avatar" 
              src={avatar} 
              style={{ height: "150px", width: "150px", borderRadius: "50%", objectFit: "cover", border: "3px solid black" }}
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
          style={{ width: "80%", backgroundColor: "#1E1E1E", borderRadius: "10px", color: "white", minHeight: "100%" }}
        >
          <div className='p-4'>
            <h2 className="mb-4" style={{ color: "#CFB991", textAlign: "center" }}>Edit Profile</h2>
            <form onSubmit={handleSubmit}>
              <div className='d-flex flex-column align-items-center'>
                <div className='d-flex align-items-center justify-content-center' style={{width: "100%", gap: "1rem"}}>
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
            {message && <p className="mt-3 text-center" style={{ color: "#CFB991" }}>{message}</p>}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
