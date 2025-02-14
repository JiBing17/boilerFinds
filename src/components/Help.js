import React, {useState} from 'react'
import Header from './Header';
import contact from '../pictures/contact.jpg'
const Help = () => {

  return (
    <>
      <Header/>
      <div className='d-flex flex-column flex-md-row align-items-center justify-content-center p-5 gap-3' style={{backgroundColor: "#101010", marginTop: "3rem"}}>
      {/* Left - FORM */}
      <div className="d-flex flex-column align-items-center justify-content-center w-100">
        <form 
          action="https://formspree.io/f/mbldapgv" 
          method="POST"
          className="p-4 rounded-4"
          style={{
            backgroundColor: "#ffffff", 
            border: "6px solid #CFB991",
            width: "100%",
            maxWidth: "500px",
            minHeight: "500px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)"

          }}
        >
          {/* Email Field */}
          <div className="mb-3">
            <label className="form-label" style={{ color: "#CFB991" }}>Your Email:</label>
            <input 
              type="email" 
              name="userEmail"
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

          {/* Title Field */}
          <div className="mb-3">
            <label className="form-label" style={{ color: "#CFB991" }}>Title:</label>
            <input 
              type="text" 
              name="title"
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

          {/* Description Field */}
          <div className="mb-3">
            <label className="form-label" style={{ color: "#CFB991" }}>Description:</label>
            <textarea 
              name="description"
              required 
              className="form-control"
              rows="3"
              style={{
                borderRadius: "20px",
                padding: "12px",
                border: "1px solid #CFB991",
                color: "#CFB991"
              }}
            />
          </div>

          {/* Submit Button */}
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
            Submit
          </button>
        </form>
      </div>

      {/* Right - Text */}
      <div className='d-flex flex-column align-items-start justify-content-center w-100'>
        <h1 className='text-white text-md-start text-center'>Get in Touch with Boiler<span style={{color: "#CFB991", fontWeight: "bold", fontStyle: "italic"}}>FINDS</span></h1>
        <p className='text-white text-md-start text-center'>
          Have a question, found a bug, or just want to share your thoughts? We’re here to help! 
          Use the form below to submit your inquiry, and we’ll do our best to respond as soon as possible. 
          The more details you provide, the faster we can assist you.
        </p>

        <div className='d-flex flex-column flex-md-row align-items-center justify-content-center gap-2'>

        

          <ul style={{color:"white", width: "100%" }}>
            <li>🐞 Bug reports & technical issues</li>
            <li>💡 Feature suggestions</li>
            <li>📌 Account & usability questions</li>
            <li>🚀 Any other concerns or feedback</li>
          </ul>

          <div className='d-flex align-items-start justify-content-start' style={{width: "100%"}}>
            <img src={contact} style={{
                width: "100%",
                height: "auto",
                borderRadius: "10px",
                boxShadow: "0px 4px 8px rgba(255, 255, 255, 0.2)"
            }}/>
          </div>

        </div>
      </div> 
      </div>
    </>
    
  )
}

export default Help