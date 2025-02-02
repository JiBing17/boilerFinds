import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  };
  const switchToLogin = () => {
    navigate('/login')
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#CFB991" }}>
      <div className="card shadow-lg p-4 py-5 px-3 rounded-4" style={{ width: "400px", color: "#CFB991", border: "3px solid #000000" }}>
        <h2 className="text-center mb-4" style={{ color: "#000000" }}>Sign Up</h2>
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
        <p className="mt-3 text-black">
          Already have an account? <a onClick={switchToLogin} style={{ color: "#CFB991", cursor: "pointer" }}>Login here</a>
        </p>
      </div>
    </div>
  );
  
}

export default Signup;
