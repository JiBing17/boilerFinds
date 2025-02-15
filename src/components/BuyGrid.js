import React from 'react'
import placeHolder from '../pictures/placeholder.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons';


const BuyGrid = ({items}) => {
  return (
    <>
        {/* Grid for displaying items being sold from ALL users */}
        <div className="p-5" style={{backgroundColor: "#CFB991"}}>
            <h3 className="text-center mb-4 fw-bold" style={{ color: "#101010" }}>
                Browse Here for Potential Deals!
            </h3>

            <div className='d-flex align-items-center justify-content-center w-100'>
                <div className='d-flex flex-column w-100'>
                    <div>
                        <h4>                        
                            🛍️ Casual & Inviting:
                        </h4>
                        <p>
                            "Discover amazing discounts and hidden gems waiting just for you!"
                        </p>
                    </div>
                    <div>
                        <h4>                        
                            💰 Deal-Oriented:
                        </h4>
                        <p>
                            "Find unbeatable prices on quality items before they're gone!"
                        </p>
                    </div>

                </div>

                <div className='d-flex flex-column w-100'>
                    <div>
                        <h4>                        
                        🔎 Curious & Engaging:
                        </h4>
                        <p>
                        "Scroll through exclusive offers and grab the best bargains today!"
                        </p>
                    </div>
                    <div>
                        <h4>                        
                        🏆 Exclusive Feel:                        
                        
                        </h4>
                        <p>
                        "Limited-time deals you won’t want to miss—start browsing now!"
                        </p>
                    </div>
                </div>


                
            </div>
            <div className="row">
            {items.map((itm) => (
                <div className="col-md-3 mb-4" key={itm.id}>
                
                <div
                    className="card"
                    style={{
                        backgroundColor: "#101010",
                        border: "4px solid #ffffff",
                        borderRadius: ".5rem",
                        height: "400px",
                        transition: "all .3s ease-in-out"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}                
                    
                    >
                    <div>
                        <FontAwesomeIcon icon={faHeart} style={{position: "absolute", top: "10px", right: "10px"}}/>
                    </div>

                    <img
                    src={
                        itm.image && itm.image !== ""
                        ? `http://127.0.0.1:5000/uploads/${itm.image}`
                        : placeHolder
                    }
                    alt={itm.item}
                    style={{ height: "300px", objectFit: "cover" }}
                    />

                    <div className="card-body">
                        <h5 className="card-title" style={{ color: "#FFFFFF" }}>
                            <h5 style={{ color: "#CFB991", display: "inline"}} >{itm.item}</h5>
                        </h5>
                        <h6 className="card-subtitle mb-2" style={{ color: "#FFFFFF" }}>
                            <h6 style={{ color: "#CFB991", display: "inline"}} >${itm.price}</h6>
                        </h6>
                    
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>
    </>
  )
}

export default BuyGrid