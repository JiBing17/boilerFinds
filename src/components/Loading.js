import React from 'react'

const Loading = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "100vh", backgroundColor: "#000000" }}>
        <div className="spinner-border" role="status" 
            style={{ 
            width: "4rem", 
            height: "4rem", 
            borderWidth: "0.4rem", 
            borderColor: "#CFB991", 
            borderRightColor: "transparent", 
            animation: "spin 1s linear infinite"
            }}>
        </div>
        
        <h2 style={{ color: "#CFB991", marginTop: "1rem", fontWeight: "bold", letterSpacing: "1px", textTransform: "uppercase" }}>
        BoilerFinds is Loading...
        </h2>
    
        <style>
        {`
            @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
            }
        `}
        </style>
  </div>
  )
}

export default Loading