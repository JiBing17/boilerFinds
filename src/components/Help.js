import React, { useState } from 'react';
import Header from './Header';
import contact from '../pictures/contact.jpg';

const Help = () => {
  const [hovered, setHovered] = useState(false);

  const sectionStyle = {
    minHeight: "calc(100vh - 60px)", 
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #101010, #333333)",
    marginTop: "50px",
    padding: "2rem"
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    overflow: "hidden"
  };

  const leftStyle = {
    backgroundImage: `url(${contact})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    flex: "1",
    minHeight: "300px"
  };

  const rightStyle = {
    flex: "1",
    padding: "2rem"
  };

  const inputStyle = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px",
    width: "100%"
  };

  const buttonStyle = {
    backgroundColor: hovered ? "#bfa37f" : "#CFB991",
    border: "none",
    color: "white",
    padding: "12px 20px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.3s ease",
    transform: hovered ? "scale(1.05)" : "scale(1)"
  };

  return (
    <>
      <Header />
      <section style={sectionStyle}>
        <div className="d-flex flex-column flex-md-row w-100" style={cardStyle}>
          <div style={leftStyle} className="d-none d-md-block"></div>
          <div style={rightStyle}>
            <h2 className="mb-4" style={{ color: "#101010", fontWeight: "bold" }}>
              Contact Us
            </h2>
            <p className="mb-4" style={{ color: "#555" }}>
              We're here to help and answer any questions you may have. Fill out the form below and we'll get back to you as soon as possible.
            </p>
            <form action="https://formspree.io/f/mbldapgv" method="POST">
              <div className="mb-3">
                <label style={{ display: "block", marginBottom: "5px", color: "#101010" }}>
                  Your Email:
                </label>
                <input type="email" name="userEmail" required style={inputStyle} />
              </div>
              <div className="mb-3">
                <label style={{ display: "block", marginBottom: "5px", color: "#101010" }}>
                  Subject:
                </label>
                <input type="text" name="subject" required style={inputStyle} />
              </div>
              <div className="mb-3">
                <label style={{ display: "block", marginBottom: "5px", color: "#101010" }}>
                  Message:
                </label>
                <textarea name="message" required rows="4" style={inputStyle}></textarea>
              </div>
              <div className="d-grid">
                <button
                  type="submit"
                  style={buttonStyle}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Help;
