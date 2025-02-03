import React from 'react'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
const Header = () => {

const navigate = useNavigate();

const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user session
    navigate('/'); // Redirect to login
    };


    return (
        <div className="position-relative" style={{ width: "100%" }}>
          <div
            className="position-sticky"
            style={{
              backgroundColor: "#CFB991",
              top: "0",
              left: "0",
              right: "0",
              height: "60px"
            }}
          >
            <div
              className="position-absolute"
              style={{
                top: "50%",
                left: "20px",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem"
              }}
            >
              <h1 style={{ margin: 0 }}>BolerFINDS</h1>
                <FontAwesomeIcon icon={faMagnifyingGlass} style={{fontSize: "2rem"}} />
            </div>
            <div
              className="position-absolute"
              style={{
                top: "50%",
                right: "20px",
                transform: "translateY(-50%)"

              }}
            >
              <FontAwesomeIcon icon={faRightFromBracket} style={{fontSize: "2rem"}} onClick={handleLogout}/>
            </div>
          </div>
        </div>
      );
}

export default Header