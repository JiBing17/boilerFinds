import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    const response = await fetch('http://127.0.0.1:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
        console.log(data.user)
        localStorage.setItem('user', JSON.stringify(data.user)); // Save user info
        navigate('/home'); // Redirect to ItemForm
    } else {
        setMessage(data.error);
    }

  };

  const switchToSignUp = () => {
    navigate('/signup'); 

  }


  return (


    <div className="d-flex vh-100 w-100">

      <div 
        className="d-flex flex-column justify-content-center align-items-center" 
        style={{
          width: "50vw",
          background: "linear-gradient(135deg, #101010 20%, #3b2e1c 65%, #CFB991 100%)",
          padding: "20px"
        }}
      >
        <div
          className="d-flex flex-column justify-content-center align-items-start gap-2" 
        >
          <h1 
          className="fw-bold" 
          style={{
            fontSize: "4rem",
            color: "white",
            textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
          }}
          >
            Welcome Back!
          </h1>

          <ul className='list-unstyled text-white d-flex flex-column align-items-start justify-content-center' style={{fontSize: "1.1rem"}}>
              <li><FontAwesomeIcon icon={faCheckCircle} className='text-success me-2'></FontAwesomeIcon>Personalized Experience – Your chats, contacts, and settings just the way you like them</li>
              <li><FontAwesomeIcon icon={faCheckCircle} className='text-success me-2'></FontAwesomeIcon>Real-Time Messaging – Instantly connect with friends, family, and communities</li>
              <li><FontAwesomeIcon icon={faCheckCircle} className='text-success me-2'></FontAwesomeIcon>Fast & Secure Access – Log in with one tap and get back to what matters</li>
          </ul>
        </div>
        

      </div>


      <div className="d-flex flex-column justify-content-center bg-white gap-3" style={{width: "50vw", color: "#CFB991", padding: "4rem"}}>
        <div className='bg-black d-flex align-items-center justify-content-center gap-2 rounded-4 p-1 w-50 mx-auto'>
          <h1 style={{ margin: 0 }} onClick={()=>{navigate("/home")}}>Boiler<span className='text-white fw-bold fst-italic'>FINDS</span></h1>
          <FontAwesomeIcon icon={faMagnifyingGlass} style={{fontSize: "2rem"}} onClick={()=>{navigate("/home")}} />
        </div>
        <h2 className="text-center" style={{ color: "#000000" }} >Login</h2>
          {message && <div className="alert alert-danger" >{message}</div>}
          <form onSubmit={handleLogin} className='w-75 mx-auto'>
            <div className="mb-3">
              <label className="form-label" style={{color: "#000000"}}>Email</label>
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
              <label className="form-label" style={{color: "#000000"}}>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 rounded-4" 
                style={{
                  backgroundColor: "#101010",
                  border: "2px solid #101010",
                  color: "white",
                  fontWeight: "bold",
                  padding: "12px",
                  transition: "0.3s"
                }}>
              Login
            </button>
            <p className="text-black mt-2">Don't have an account? <a onClick={switchToSignUp} style={{color: "#CFB991", fontWeight: "bold", fontStyle: "italic", cursor: "pointer"}}> Sign up here</a></p>

          </form>
      </div>

      
    </div>
  );
}

export default Login;
