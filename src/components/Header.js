import React from 'react'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

const Header = () => {

const navigate = useNavigate();

const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user session
    navigate('/'); // Redirect to login
};


    return (
        <div className="position-relative" style={{ width: "100%" }}>
          <div
            className="position-fixed"
            style={{
              padding: "1rem 2rem",
              backgroundColor: "#CFB991",
              top: "0",
              left: "0",
              right: "0",
              height: "60px",
              zIndex: "100",
              borderBottom: "4px solid #101010"
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
                gap: "1rem",
              }}
            >
              <h1 style={{ margin: 0 }} onClick={()=>{navigate("/home")}}>Boiler<span className='text-white fw-bold fst-italic'>FINDS</span></h1>
                <FontAwesomeIcon icon={faMagnifyingGlass} style={{fontSize: "2rem"}} onClick={()=>{navigate("/home")}} />
            </div>
            <div
              className="position-absolute"
              style={{
                top: "50%",
                right: "20px",
                transform: "translateY(-50%)"

              }}
            >   
            <div className='d-flex align-items-center justify-content-center gap-3'>
                <FontAwesomeIcon icon={faUserPlus} style={{fontSize: "1.3rem", cursor: "pointer"}} onClick={ ()=> navigate('/userlist')}/>
                <FontAwesomeIcon icon={faCircleQuestion} style={{ fontSize: "1.3rem", cursor: "pointer" }} onClick={ ()=> navigate('/help')} />
                <FontAwesomeIcon icon={faUser} style={{fontSize: "1.3rem", cursor: "pointer"}}  onClick={ ()=> navigate('/profile')}/>
                <FontAwesomeIcon icon={faRightFromBracket} style={{fontSize: "1.3rem", cursor: "pointer"}} onClick={handleLogout}/>

            </div>
                
            </div>
          </div>
        </div>
      );
}

export default Header