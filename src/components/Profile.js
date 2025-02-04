import React from 'react';
import Header from './Header';
import avatar from '../pictures/avatarPFP.png';

const Profile = () => {
  return (
    <>
      <Header />
      <div 
        className='d-flex align-items-start justify-content-start' 
        style={{ backgroundColor: "#101010", marginTop: "1rem", height: "100vh" }}
      >

        {/* Sidebar */}
        <div 
          className='d-flex flex-column border border-white pt-5' 
          style={{ width: "20%", height: "100%", backgroundColor: "#CFB991", borderRadius: "10px" }}
        >
          {/* Profile Section */}
          <div 
            className='border-bottom border-white d-flex flex-column align-items-start p-3' 
            style={{ backgroundColor: "#CFB991" }}
          >
            <img 
              alt="Profile Avatar" 
              src={avatar} 
              style={{ height: "150px", width: "150px", borderRadius: "50%", objectFit: "cover", border: "3px solid white" }}
            />
            <h2 className='mt-3 text-white'>NAME</h2>
          </div>

          {/* Sidebar Links */}
          <div className='mt-3 p-3'>
            <p className="text-white fw-bold">Account</p>
            <p className="text-white fw-bold">Security & Privacy</p>
            <p className="text-white fw-bold">Mobile</p>
            <p className="text-white fw-bold">Find Friends</p>
            <p className="text-white fw-bold">History</p>
          </div>
        </div>

        {/* Content Section */}
        <div 
          className='p-4 pt-5' 
          style={{ width: "80%", backgroundColor: "#1E1E1E", borderRadius: "10px", color: "white", minHeight: "100%" }}
        >
          <h2>Profile Content</h2>
          <p>Welcome to your profile. Here you can manage your settings, privacy, and history.</p>
        </div>
      </div>
    </>
  );
}

export default Profile;
