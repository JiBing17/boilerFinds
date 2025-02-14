import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faRightFromBracket, faUser, faCircleQuestion, faUserGroup, faBars } from "@fortawesome/free-solid-svg-icons";

const Header = () => {

const navigate = useNavigate();
const [menuOpen, setMenuOpen] = useState(false)

const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user session
    navigate('/'); // Redirect to login
};

    return (
        <div className="position-relative p-1" style={{ width: "100%" }}>
          <div
            className="position-fixed"
            style={{
              backgroundColor: "#CFB991",
              top: "0",
              left: "0",
              right: "0",
              height: "60px",
              zIndex: "100",
              boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)"

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


            <div className='d-none d-md-flex align-items-center justify-content-evenly gap-3 w-100'>
                <FontAwesomeIcon icon={faUserGroup} style={{fontSize: "1.6rem", cursor: "pointer"}} onClick={ ()=> navigate('/userlist')}/>
                <FontAwesomeIcon icon={faCircleQuestion} style={{ fontSize: "1.6rem", cursor: "pointer" }} onClick={ ()=> navigate('/help')} />
                <FontAwesomeIcon icon={faUser} style={{fontSize: "1.6rem", cursor: "pointer"}}  onClick={ ()=> navigate('/profile')}/>
                <FontAwesomeIcon icon={faRightFromBracket} style={{fontSize: "1.6rem", cursor: "pointer"}} onClick={handleLogout}/>
            </div>    

            {/* Hamburger menu for small devices */}
            <div
              className="position-absolute d-flex d-md-none"
              style={{
                top: "50%",
                right: "0",
                transform: "translateY(-50%)"
              }}
            >
              <FontAwesomeIcon 
                icon={faBars} 
                style={{ fontSize: "1.8rem", cursor: "pointer" }} 
                onClick={() => setMenuOpen(!menuOpen)}
              />
            </div>
            
            

          </div>

          {/* Dropdown menu for small devices */}
          {menuOpen && (
              <div 
                className="d-md-none"
                style={{
                  position: "fixed",
                  top: "0",
                  left: "0",
                  bottom: "0",
                  backgroundColor: "#CFB991",
                  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                  minWidth: "150px",
                  padding: "0.5rem 0"
                }}
              >
                <button 
                  className="dropdown-item" s
                  style={{
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#000",
                    textAlign: "left",
                    width: "100%",
                    padding: "0.5rem 1rem"
                  }}
                  onClick={() => { navigate('/userlist'); setMenuOpen(false); }}
                >
                  <FontAwesomeIcon icon={faUserGroup} style={{ marginRight: "8px" }} /> Users
                </button>
                <button 
                  className="dropdown-item" 
                  style={{
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#000",
                    textAlign: "left",
                    width: "100%",
                    padding: "0.5rem 1rem"
                  }}
                  onClick={() => { navigate('/help'); setMenuOpen(false); }}
                >
                  <FontAwesomeIcon icon={faCircleQuestion} style={{ marginRight: "8px" }} /> Help
                </button>
                <button 
                  className="dropdown-item" 
                  style={{
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#000",
                    textAlign: "left",
                    width: "100%",
                    padding: "0.5rem 1rem"
                  }}
                  onClick={() => { navigate('/profile'); setMenuOpen(false); }}
                >
                  <FontAwesomeIcon icon={faUser} style={{ marginRight: "8px" }} /> Profile
                </button>
                <button 
                  className="dropdown-item" 
                  style={{
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#000",
                    textAlign: "left",
                    width: "100%",
                    padding: "0.5rem 1rem"
                  }}
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                >
                  <FontAwesomeIcon icon={faRightFromBracket} style={{ marginRight: "8px" }} /> Logout
                </button>
              </div>
            )}

          </div>
        </div>
      );
}

export default Header