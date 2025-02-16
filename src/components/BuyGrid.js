import React, {useState} from 'react'
import placeHolder from '../pictures/placeholder.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileZipper, faHeart} from '@fortawesome/free-regular-svg-icons';
import { faChevronLeft, faChevronRight, faShoppingCart } from "@fortawesome/free-solid-svg-icons";

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
        }
    ]

    const [currentIndex, setCurrentIndex] = useState(0);

    // Function to move to the previous item
    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? picturesAndText.length - 1 : prevIndex - 1
        );
    };

    // Function to move to the next item
    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === picturesAndText.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <>
            {/* Grid for displaying items being sold from ALL users */}
            <div className="p-5" style={{backgroundColor: "#CFB991"}}>
                <h1 className="text-center mb-4 fw-bold" style={{ color: "#101010" }}>
                    Browse Here for Potential Deals!
                </h1>
                
                <div className="position-relative mb-4" style={{ height: "500px" }}>

                    {/* Carousel Image */}
                    <img 
                        src={picturesAndText[currentIndex].picture} 
                        alt="Buy Items"
                        style={{ 
                            width: "100%", 
                            maxHeight: "500px", 
                            objectFit: "cover", 
                            display: "block", 
                            borderRadius: "10px"
                        }} 
                    />

                    {/* Overlay text */}
                    <div className="position-absolute d-flex align-items-center justify-content-center rounded-circle"
                        style={{ top: "50%", left: "26%", transform: "translate(-50%, -50%)"}}
                    >
                        <div className="text-white text-start px-3 p-4">
                            <h1 className='text-white fw-bold' style={{textShadow: "2px 2px 8px rgba(0, 0, 0, 0.8)", fontSize: "3rem"}}>{picturesAndText[currentIndex].titleText}</h1>
                            <p className='text-white fw-bold' style={{textShadow: "2px 2px 8px rgba(0, 0, 0, 0.8)", fontSize: "1.2rem"}}>{picturesAndText[currentIndex].descriptionText}</p>
                        </div>
                    </div>

                    {/* Carousel Arrows */}
                    <FontAwesomeIcon icon={faChevronLeft} style={{fontSize: "2rem",color: "white", position: "absolute", top: "50%", left: "2%"}} onClick={nextSlide}/>
                    <FontAwesomeIcon icon={faChevronRight} style={{fontSize: "2rem",color: "white", position: "absolute", top: "50%", right: "2%"}} onClick={prevSlide}/>
                </div>

                
        
                <h1 className='border-bottom border-black mb-4'>Products on feature</h1>

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
                                <span style={{ color: "#CFB991" }}>{itm.item}</span>
                            </h5>

                            <div className='d-flex align-items-center justify-content-between mt-2'>
                                <h5 className="card-subtitle" style={{ color: "#FFFFFF" }}>
                                    <span style={{ color: "#CFB991" }}>${itm.price}</span>
                                </h5>
                                <button className='text-white fw-bold rounded px-2 py-1' 
                                    style={{backgroundColor: "#CFB991", border: "none"}}
                                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                >
                                    <FontAwesomeIcon size='lg' icon={faShoppingCart}/>
                                </button>
                            </div>
                            

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