import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";


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
        className="d-flex flex-column justify-content-center align-items-center text-center" 
        style={{
          width: "50vw",
          background: "linear-gradient(135deg, #101010, #CFB991)",
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
          Welcome Back!
        </h1>
      </div>


      <div className="d-flex flex-column justify-content-evenly bg-white" style={{width: "50vw", color: "#CFB991", padding: "4rem"}}>
        <h2 className="text-center" style={{ color: "#000000" }} >Login</h2>
          {message && <div className="alert alert-danger" >{message}</div>}
          <form onSubmit={handleLogin}>
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
                  backgroundColor: "#CFB991",
                  border: "2px solid #000000",
                  color: "white",
                  fontWeight: "bold",
                  padding: "12px",
                  transition: "0.3s"
                }}>
              Login
            </button>
          </form>
          <p className="text-black">Don't have an account? <a onClick={switchToSignUp} style={{color: "#CFB991"}}> Sign up here</a></p>
      </div>

      
    </div>
  );
}

export default Login;
