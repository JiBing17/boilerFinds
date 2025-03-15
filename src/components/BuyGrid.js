import React, {useState} from 'react'
import placeHolder from '../pictures/placeholder.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileZipper, faHeart} from '@fortawesome/free-regular-svg-icons';
import { faChevronLeft, faChevronRight, faShoppingCart, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';


import buyItems from '../pictures/buy_items.jpg'
import buyItems2 from '../pictures/buy_items_2.jpg'
import buyItems3 from '../pictures/buy_items_3.jpg'
import buyItems4 from '../pictures/buy_items_4.jpg'
import market1 from '../pictures/market_1.jpg'
import market2 from '../pictures/market_2.jpg'

const BuyGrid = ({items}) => {
    console.log(items)

    const navigate = useNavigate();

    const picturesAndText = [
        {
            "titleText": "Casual & Inviting 🛍️",
            "descriptionText": "Discover amazing discounts and hidden gems waiting just for you!",
            "picture": buyItems
        },
        {
            "titleText": "Deal-Oriented 💰",
            "descriptionText":  "Find unbeatable prices on quality items before they're gone!",
            "picture": buyItems2
        },
        {
            "titleText": "Curious & Engaging 🔎",
            "descriptionText": "Scroll through exclusive offers and grab the best bargains today!",
            "picture": buyItems3
        },
        {
            "titleText": "Exclusive Feel 🏆",
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
            <div className="container-fluid" style={{backgroundColor: "#CFB991", textAlign: "center"}}>
                
                <div style={{ color: "#fff", backgroundColor: "#101010", display: "inline-block", borderRadius: "2rem", marginTop: "2rem", marginBottom: "2rem"}}>
                    <h1 className="text-center fw-bold p-3" style={{fontSize: "clamp(1rem, 2vw, 3rem)"}} >
                        <FontAwesomeIcon icon={faGlobe} className='me-2'/>
                        Browse Here for Potential Deals!
                    </h1>
                </div>
                
                
                <div className="position-relative mb-4" style={{ height: "auto" }}>

                    {/* Carousel Image */}
                    <img 
                        src={picturesAndText[currentIndex].picture} 
                        alt="Buy Items"
                        className='w-100'
                        style={{ 
                            maxWidth: "100%", 
                            maxHeight: "500px", 
                            objectFit: "cover", 
                            display: "block", 
                        }} 
                    />

                    {/* Overlay text */}
                    <div className="position-absolute d-flex align-items-center justify-content-center rounded-circle"
                        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}
                    >
                        <div className="text-white text-center px-3 p-4 rounded" style={{backgroundColor: "rgba(0,0,0,.7)"}}>
                            <h1 className='text-white fw-bold' style={{textShadow: "2px 2px 8px rgba(0, 0, 0, 0.8)", fontSize: "clamp(.8rem,2vw,3rem)"}}>{picturesAndText[currentIndex].titleText}</h1>
                            <p className='text-white fw-bold' style={{textShadow: "2px 2px 8px rgba(0, 0, 0, 0.8)", fontSize: "clamp(.6rem,1vw,2rem)"}}>{picturesAndText[currentIndex].descriptionText}</p>
                            <button className='btn btn-dark fw-bold' style={{boxShadow: "2px 2px 8px rgba(255, 255, 255, 0.4)", fontSize: "clamp(.6rem,1vw,2rem)"}} onClick={() => document.getElementById('productDisplay').scrollIntoView({ behavior: 'smooth' })}>Shop Now</button>
                        </div>
                    </div>

                    {/* Carousel Arrows */}
                    <FontAwesomeIcon icon={faChevronLeft} style={{fontSize: "2rem",color: "white", position: "absolute", top: "50%", left: "2%"}} onClick={nextSlide}/>
                    <FontAwesomeIcon icon={faChevronRight} style={{fontSize: "2rem",color: "white", position: "absolute", top: "50%", right: "2%"}} onClick={prevSlide}/>
                </div>
                

                <div className='d-flex flex-column flex-md-row align-items-center justify-content-center gap-3 p-4'>

                    <div className='d-flex flex-column flex-md-row align-items-center justify-content-center col-md-6 gap-2' style={{backgroundColor: "#101010"}}>
                        <div className='text-white p-4'>
                            <h3>Your One-Stop Online Marketplace</h3>
                            <p>Discover top deals, fast shipping, and a hassle-free shopping experience</p>
                        </div>
                        <img src={market1} className="col-md-6" style={{display: "block", maxWidth: "100%"}}/>
                    </div>

                    <div className='d-flex flex-column flex-md-row align-items-center justify-content-center col-md-6 gap-2' style={{backgroundColor: "#101010"}}>
                        <div className='text-white p-4'>
                            <h3>Shop with Confidence</h3>
                            <p> Secure payments, verified sellers, and customer-first policies ensure you always get the best</p>
                        </div>
                        <img src={market2}  className="col-md-6" style={{display: "block", maxWidth: "100%"}}/>
                    </div>
                </div>

                
                <div className='p-4'>
                    
                    <h1 id="productDisplay" className='border-bottom border-black mb-4 fw-bold'>Products on feature</h1>

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
                            onClick={() => navigate(`/shop-item/${itm.id}`, { state: { item: itm } })}

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
                
            </div>
        </>
    )
}

export default BuyGrid