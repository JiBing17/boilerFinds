import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import placeHolder from '../pictures/placeholder.jpg'
import { useNavigate } from 'react-router-dom';

const ChatWindow = () => {
  const { friendId } = useParams();
  const location = useLocation();
  const friend = location.state?.friend;
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

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
    <div className="container-fluid p-0" style={{ 
      height: "100vh", 
      display: "flex", 
      flexDirection: "column",
      backgroundColor: "#f8f9fa",
      fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif"
    }}>
      {/* Header */}
      <div className="d-flex align-items-center p-3" style={{
        backgroundColor: "#CFB991",
        color: "white",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
      }}>
        <button 
          onClick={() => navigate("/userlist")}
          className="btn btn-link p-0 me-3"
          style={{ color: "white", fontSize: "1.2rem" }}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <img
          src={
            friend && friend.profile_pic
              ? `http://127.0.0.1:5000/uploads/${friend.profile_pic}`
              : placeHolder
          }
          alt={friend ? friend.name : "User"}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid rgba(255,255,255,0.3)"
          }}
        />
        <div className="ms-3">
          <h6 className="mb-0" style={{ fontWeight: 600 }}>{friend ? friend.name : `User ${friendId}`}</h6>
          <small style={{ opacity: 0.8, fontSize: "0.75rem" }}>Online</small>
        </div>
      </div>
      
      {/* Messages */}
      <div 
        className="flex-grow-1 p-3" 
        style={{ 
          overflowY: "auto", 
          backgroundImage: "linear-gradient(rgba(229, 221, 213, 0.8), rgba(229, 221, 213, 0.8))",
          backgroundAttachment: "fixed",
          backgroundSize: "cover"
        }}
      >
        <div className="d-flex flex-column" style={{ gap: "12px" }}>
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className="d-flex" 
              style={{ 
                justifyContent: msg.sender_id === currentUser.id ? "flex-end" : "flex-start",
                alignItems: "flex-end"
              }}
            >
              <div 
                className="position-relative p-3" 
                style={{
                  maxWidth: "75%",
                  backgroundColor: msg.sender_id === currentUser.id ? "#dcf8c6" : "white",
                  borderRadius: msg.sender_id === currentUser.id ? "18px 0 18px 18px" : "0 18px 18px 18px",
                  boxShadow: "0 1px 0.5px rgba(0,0,0,0.1)",
                  wordWrap: "break-word",
                  position: "relative"
                }}
              >
                <p className="mb-1" style={{ margin: 0, lineHeight: 1.4 }}>{msg.content}</p>
                <small 
                  style={{ 
                    fontSize: "0.6875rem", 
                    color: "rgba(0,0,0,0.45)", 
                    display: "block", 
                    textAlign: "right",
                    marginTop: "4px",
                    lineHeight: 1
                  }}
                >
                  {formatTimestamp(msg.timestamp)}
                </small>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>
      </div>
      
      {/* Input Area */}
      <div className="p-3" style={{ 
        backgroundColor: "#f0f0f0",
        borderTop: "1px solid #e5e5e5"
      }}>
        <div className="input-group">
          <textarea
            className="form-control border-0"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ 
              resize: "none", 
              height: "44px", 
              borderRadius: "20px",
              padding: "10px 16px",
              fontSize: "0.9375rem",
              boxShadow: "none"
            }}
            rows="1"
          />
          <button 
            className="btn rounded-circle ms-2" 
            onClick={sendMessage}
            style={{
              width: "44px",
              height: "44px",
              backgroundColor: "#CFB991",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;