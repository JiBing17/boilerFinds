import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import placeHolder from '../pictures/placeholder.jpg'

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


const ChatWindow = () => {
  const { friendId } = useParams();
  const location = useLocation();
  const friend = location.state?.friend;
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate()


  // Fetch messages between the current user and the selected friend
  const fetchMessages = () => {
    fetch(`http://127.0.0.1:5000/messages?sender_id=${currentUser.id}&recipient_id=${friendId}`)
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
        scrollToBottom();
      })
      .catch((err) => console.error("Error fetching messages:", err));
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [friendId, currentUser.id]);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;
    try {
      const response = await fetch("http://127.0.0.1:5000/send_message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id: currentUser.id,
          recipient_id: friendId,
          content: newMessage,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setNewMessage("");
        fetchMessages();
      } else {
        console.error("Send message error:", data.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format timestamp without seconds
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
        <div className="container-fluid" style={{ height: "100vh", display: "flex", flexDirection: "column", padding: 0}}>
            <div
                className="text-white d-flex align-items-center justify-content-start py-3 px-4 gap-2"
                style={{ fontSize: "1.5rem", fontWeight: "bold", backgroundColor: "#CFB991" }}
            >   
                <FontAwesomeIcon icon={faArrowLeft} onClick={()=> navigate("/userlist")}/>
                <img    
                    src={
                    friend && friend.profile_pic
                        ? `http://127.0.0.1:5000/uploads/${friend.profile_pic}`
                        : placeHolder
                    }
                    alt={friend ? friend.name : "User"}
                    style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginLeft: "1rem",
                    }}
                />
                {friend ? friend.name : `User ${friendId}`}
            </div>

        
            {/* Messages */}
            <div className="flex-grow-1 p-3" style={{ overflowY: "auto", backgroundColor: "#e5ddd5" }}>
                {messages.map((msg) => (
                <div 
                    key={msg.id} 
                    className="d-flex mb-3" 
                    style={{ justifyContent: msg.sender_id === currentUser.id ? "flex-end" : "flex-start" }}
                >
                    <div 
                    className="p-2" 
                    style={{
                        maxWidth: "70%",
                        backgroundColor: msg.sender_id === currentUser.id ? "#DCF8C6" : "#ffffff",
                        borderRadius: "15px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                    }}
                    >
                    <p className="mb-1" style={{ margin: 0 }}>{msg.content}</p>
                    <small style={{ fontSize: "0.75rem", color: "#555", display: "block", textAlign: "right" }}>
                        {formatTimestamp(msg.timestamp)}
                    </small>
                    </div>
                </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>
            
            {/* Input Area */}
            <div className="p-3 bg-light" style={{ borderTop: "1px solid #ddd" }}>
                <div className="input-group">
                <textarea
                    className="form-control"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    style={{ resize: "none", height: "50px" }}
                />
                <button className="btn" style={{backgroundColor: "#CFB991"}} onClick={sendMessage}>
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
                </div>
            </div>
        </div>
    </>
  );
};

export default ChatWindow;