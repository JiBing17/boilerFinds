import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('');

    const response = await fetch('http://127.0.0.1:5000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    setMessage(data.message || data.error);
    if ( data.message ) {
      switchToLogin()
    }
  };

  const switchToLogin = () => {
    navigate('/')
  }

  return (
    <div className="d-flex vh-100 w-100">
      
      <div 
        className="d-flex flex-column justify-content-center align-items-center text-center" 
        style={{
          width: "50vw",
          background: "linear-gradient(135deg, #101010 20%, #3b2e1c 65%, #CFB991 100%)",
          padding: "20px"
        }}
      >
        <h1 
          className="fw-bold" 
          style={{
            color: "white",
            textShadow: "2px 2px 4px rgba(0,0,0,0.7)"
          }}
        >
          Create an Account
        </h1>
      </div>

      <div className="d-flex flex-column justify-content-evenly" style={{width: "50vw", padding: "4rem"}}>
        <div className='bg-black d-flex align-items-center justify-content-center gap-2 rounded-4 p-1'>
          <h1 style={{ margin: 0, color: "#CFB991"}} onClick={()=>{navigate("/home")}}>Boiler<span className='text-white fw-bold fst-italic'>FINDS</span></h1>
          <FontAwesomeIcon icon={faMagnifyingGlass} style={{fontSize: "2rem", color: "#CFB991"}} onClick={()=>{navigate("/home")}} />
        </div>
        <h2 className="text-center" style={{ color: "#000000" }}>Sign Up</h2>
        {message && <div className="alert alert-danger">{message}</div>}
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label className="form-label" style={{ color: "#000000" }}>Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ color: "#000000" }}>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ color: "#000000" }}>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 rounded-4"
            style={{
              backgroundColor: "#CFB991",
              border: "2px solid #000000",
              color: "white",
              fontWeight: "bold",
              padding: "12px",
              transition: "0.3s"
            }}
          >
            Sign Up
          </button>
        </form>
        <p className="text-black">
          Already have an account? <a onClick={switchToLogin} style={{ color: "#CFB991", cursor: "pointer" }}>Login here</a>
        </p>
      </div>
    </div>
  );
  
}

export default Signup;
