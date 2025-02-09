import React, {useState} from 'react'
import Header from './Header';
import contact from '../pictures/contact.jpg'
const Help = () => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    // Handle form submission
    const handleSubmit = (e) => {
      e.preventDefault();
      const payload = { title, description };
      
      fetch('http://127.0.0.1:5000/send_help_email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            setMessage(data.error);
          } else {
            setMessage(data.message);
            // Optionally, clear the form fields on success:
            setTitle('');
            setDescription('');
          }
        })
        .catch((error) => {
          console.error("Error sending email:", error);
          setMessage("Error sending email.");
        });
    };

  return (
    <>
      <Header/>
      <div className='d-flex align-items-center justify-content-center p-5' style={{backgroundColor: "#101010", marginTop: "3rem", height: "100vh"}}>
      {/* Left - FORM */}
      <div className="d-flex flex-column align-items-center justify-content-center w-50">
        <form 
          onSubmit={handleSubmit}
          className="p-4 rounded-4 shadow-lg"
          style={{
            backgroundColor: "#ffffff", 
            border: "6px solid #CFB991",
            width: "100%",
            maxWidth: "500px",
            minHeight: "500px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
          }}
        >
          <div className="mb-3">
            <label className="form-label" style={{ color: "#CFB991" }}>Title:</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
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

          
          <div className="mb-3">
            <label className="form-label" style={{ color: "#CFB991" }}>Description:</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
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

        {/* Show success or error message */}
        {message && <p className="mt-3 text-black">{message}</p>}
      </div>

      {/* Right - Text */}
      <div className='d-flex flex-column align-items-start justify-content-center w-50'>
        <h1 className='text-white'>Get in Touch with Boiler<span style={{color: "#CFB991", fontWeight: "bold", fontStyle: "italic"}}>FINDS</span></h1>
        <p className='text-white'>
          Have a question, found a bug, or just want to share your thoughts? We’re here to help! 
          Use the form below to submit your inquiry, and we’ll do our best to respond as soon as possible. 
          The more details you provide, the faster we can assist you.
        </p>

        <div className='d-flex align-items-start justify-content-center'>

        <div className='d-flex align-items-start justify-content-start' style={{width: "80%"}}>
            <img src={contact} style={{
                width: "100%",
                height: "auto",
                borderRadius: "10px",
                boxShadow: "0px 4px 8px rgba(255, 255, 255, 0.2)"
            }}/>
        </div>

          <ul style={{color:"white", listStylePosition: "inside", padding: "2rem", width: "100%" }}>
            <li>🐞 Bug reports & technical issues</li>
            <li>💡 Feature suggestions</li>
            <li>📌 Account & usability questions</li>
            <li>🚀 Any other concerns or feedback</li>
          </ul>
        </div>
      </div> 
      </div>
    </>
    
  )
}

export default Help