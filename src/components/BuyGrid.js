import React from 'react'
import placeHolder from '../pictures/placeholder.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileZipper, faHeart} from '@fortawesome/free-regular-svg-icons';
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import buyItems from '../pictures/buy_items.jpg'
import buyItems2 from '../pictures/buy_items_2.jpg'
import buyItems3 from '../pictures/buy_items_3.jpg'
import buyItems4 from '../pictures/buy_items_4.jpg'

const BuyGrid = ({items}) => {
    

    const picturesAndText = [
        {
            "titleText": "🛍️ Casual & Inviting:",
            "descriptionText": "Discover amazing discounts and hidden gems waiting just for you!",
            "picture": buyItems
        },
        {
            "titleText": "💰 Deal-Oriented:",
            "descriptionText":  "Find unbeatable prices on quality items before they're gone!",
            "picture": buyItems2
        },
        {
            "titleText": "🔎 Curious & Engaging:",
            "descriptionText": "Scroll through exclusive offers and grab the best bargains today!",
            "picture": buyItems3
        },
        {
            "titleText": "🏆 Exclusive Feel:",
            "descriptionText": "Limited-time deals you won’t want to miss—start browsing now!",
            "picture": buyItems4
        },

    ]

    return (
        <>
            {/* Grid for displaying items being sold from ALL users */}
            <div className="p-5" style={{backgroundColor: "#CFB991"}}>
                <h3 className="text-center mb-4 fw-bold" style={{ color: "#101010" }}>
                    Browse Here for Potential Deals!
                </h3>
                
                <div className="position-relative" style={{ height: "500px" }}>

                    {/* Carousel Image */}
                    <img 
                        src={picturesAndText[0].picture} 
                        alt="Buy Items"
                        style={{ 
                            width: "100%", 
                            maxHeight: "500px", 
                            objectFit: "cover", 
                            display: "block" 
                        }} 
                    />

                    {/* Overlay text */}
                    <div className="position-absolute d-flex align-items-center justify-content-center rounded-circle"
                        style={{ top: "50%", left: "25%", transform: "translate(-50%, -50%)"}}
                    >
                        <div className="text-white text-center px-3 p-4">
                            <h2 className='text-white fw-bold'>{picturesAndText[0].titleText}</h2>
                            <p className='text-white fw-bold'>{picturesAndText[0].descriptionText}</p>
                        </div>
                    </div>

                    {/* Carousel Arrows */}
                    <FontAwesomeIcon icon={faChevronLeft} style={{fontSize: "2rem",color: "white", position: "absolute", top: "50%", left: "2%"}}/>
                    <FontAwesomeIcon icon={faChevronRight} style={{fontSize: "2rem",color: "white", position: "absolute", top: "50%", right: "2%"}}/>
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