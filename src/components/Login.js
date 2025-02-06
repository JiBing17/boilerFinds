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
    <div className="d-flex justify-content-center align-items-center vh-100" style={{backgroundColor: "#CFB991"}}>
      <div className="card shadow-lg p-4 py-5 px-3 rounded-4" style={{width: "400px", color: "#CFB991", border: "3px solid #000000", }}>
      <h2 className="text-center mb-4" style={{ color: "#000000" }} >Login</h2>
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
        <p className="mt-3 text-black">Don't have an account? Sign up <a onClick={switchToSignUp} style={{color: "#CFB991"}}>here</a></p>
      </div>
    </div>
  );
}

export default Login;
