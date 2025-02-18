import React, { useState, useEffect } from 'react';
import Header from './Header';
import placeHolder from '../pictures/placeholder.jpg'
import food from '../pictures/food/food.jpg'
import food2 from '../pictures/food/food_2.jpg'
import food3 from '../pictures/food/food_3.jpg'

import drink from '../pictures/food/drink.jpg'
import drink_2 from '../pictures/food/drink_2.jpg'


const FoodInfo = () => {


    const cuisineEmojiMapping = {
        "italian": "🍕",
        "pizza": "🍕",
        "chinese": "🥡",
        "japanese": "🍣",
        "korean": "🍲",
        "indian": "🍛",
        "mexican": "🌮",
        "american": "🍔",
        "french": "🥐",
        "thai": "🍜",
        "greek": "🥙",
        "spanish": "🥘",
        "vietnamese": "🍜",
        "burger": "🍔",
        "sushi": "🍣",
        "barbecue": "🍖",
        "seafood": "🦞",
        "steakhouse": "🥩",
        "dessert": "🍰",
        "vegetarian": "🥗",
        "vegan": "🌱",
        "turkish": "🍢",
        "middle eastern": "🥙",
        "arabic": "🥙",
        "mediterranean": "🥙",
        "ice_cream": "🍨",
        "asian": "🥢",    
        "breakfast": "🍳",
        "cajun": "🌶️",
        "cookie": "🍪",
        "fish": "🐟",
        "noodle": "🍜",
        "pasta": "🍝",
        "pub": "🍺",
        "ramen": "🍜",
        "sandwich": "🥪",
        "sandwhich": "🥪", // covers common misspelling
        "steak_house": "🥩"
      };
      
      // Helper function to get an emoji for a given cuisine.
      // Falls back to a generic "🍽️" if the cuisine isn't in the mapping.
      const getCuisineEmoji = (cuisine) => {
        if (!cuisine) return "🍽️";
        const key = cuisine.trim().toLowerCase();
        return cuisineEmojiMapping[key] || "🍽️";
      };
      

    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cuisines, setCuisines] = useState([]); // Store cuisine types
    const [selectedCuisine, setSelectedCuisine] = useState(null);

    // on componrnt mount, make API call to obtain food places
    useEffect(() => {

    // ask for user's current location
    if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(

    (position) => {

        // extract coordinates
        const { latitude, longitude } = position.coords;
        
        // make api call to food info endpoint with coordinates passed in
        fetch(`http://127.0.0.1:5000/api/food-info?lat=${latitude}&lng=${longitude}`)
        

        // on success, set data as restaurant 
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data)
            setRestaurants(data.restaurants);
            setCuisines(data.cuisines);
            setLoading(false);
        })
        // on fail, show server error
        .catch(err => {
            console.error("Error fetching data:", err);
            setError("Error fetching restaurant info.");
            setLoading(false);
        });
    },
    // no geolocation permission
    (err) => {
        console.error("Geolocation error:", err);
        setError("Unable to retrieve your location.");
        setLoading(false);
    });
    } 
    // no geolocation at all
    else {
        setError("Geolocation is not supported by your browser.");
        setLoading(false);
    }
    }, []);

    if (loading) return <div>Loading restaurants...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    // function used to format multiple cuisines (american;asian -> american, asian)
    function formatCuisine(cuisineString) {
        if (!cuisineString) return "";
        return cuisineString
          .split(";")
          .map(c => c.trim())
          .join(", ");
      }
    
    // filter restaurants based on selected cuisine
    const filteredRestaurants = selectedCuisine
    ? restaurants.filter(r => (r.tags.cuisine || "").includes(selectedCuisine))
    : restaurants;
      

    // dummy display for info

    /* 
    Content :
        Name
        Phone
        Cuisine
        Street
        Open Hours
        State
        City
        Postal Code 
        Website
    */
    return (
        
        <>
        
        <Header/>
        <div style={{ padding: '20px', marginTop: "3rem", backgroundColor: "#101010"}}>

            <div className='d-flex flex-column justify-content-center w-100 text-white gap-4 p-3'>

                <div className='d-flex flex-column flex-md-row p-4 gap-3'>
                    
                    <div className='d-flex flex-column align-items-start justify-content-center col-md-4 col-12'>
                        <h1 className='fw-bold fst-italic text-center text-md-start'>Delicious Food is Waiting for you</h1>
                        <div className='text-center text-md-start'>
                            <ul class="list-unstyled">
                                <li class="mb-2">
                                <span class="me-2">🍽️</span> From sizzling street eats to gourmet dining
                                </li>
                                <li class="mb-2">
                                <span class="me-2">🌎</span> Explore a world of flavors, crafted with passion
                                </li>
                                <li class="mb-2">
                                <span class="me-2">😋</span> Satisfy every craving—comforting or adventurous
                                </li>
                                <li>
                                <span class="me-2">📍</span> Find the perfect spot for your next bite!
                                </li>
                            </ul>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault(); 
                                    const section = document.getElementById("nearby_restaurant");
                                    if (section) {
                                        section.scrollIntoView({ behavior: "smooth" });
                                    }
                                }}
                                className='btn btn-primary d-flex w-100 align-items-center justify-content-center'
                            >
                                View More
                            </a>
                        </div>
                    </div>

                    <div className='d-flex col-md-8 col-12'>
                        <img className="d-block w-100 rounded" style={{objectFit: "cover", height: "25rem", boxShadow: "0 0 15px rgba(255, 255, 255, 0.7)"}} src={food} alt="Food Picture"/>
                    </div>
                    
                </div>
                
                <div className='d-flex flex-column-reverse flex-md-row p-4 gap-3'>

                    <div className='d-flex col-12 col-md-8'>
                        <img className="d-block w-100 rounded" style={{objectFit: "cover", height: "25rem", boxShadow: "0 0 15px rgba(255, 255, 255, 0.7)"}} src={drink_2} alt="Food Picture"/>
                    </div>
                    <div className='d-flex flex-column align-items-start justify-content-center col-md-4 col-12'>
                        <h1 className='ms-md-4 ms-0 fw-bold fst-italic text-center text-md-start'>Sip & Savor the Perfect Drink</h1>
                        <div className='ms-md-4 ms-0 text-center text-md-start'>
                            <ul class="list-unstyled">
                                <li class="mb-2"><span class="me-2">🍹</span> Refreshing cocktails crafted to perfection</li>
                                <li class="mb-2"><span class="me-2">🍺</span> Local brews that delight every palate</li>
                                <li class="mb-2"><span class="me-2">☕</span> Energizing coffees & teas to perk you up</li>
                                <li><span class="me-2">🥂</span> Celebrate with a glass of bubbly delight</li>
                            </ul>
                        </div>
                    </div>

                    
                    
                </div>
                <div className='d-flex flex-column flex-md-row p-4 gap-3'>
                    
                    <div className='d-flex flex-column align-items-start justify-content-center col-md-4 col-12'>
                        <h1 className='fw-bold fst-italic text-center text-md-start'>Indulge in Sweet Temptations</h1>
                        <div className=' text-center text-md-start' >
                            <ul class="list-unstyled">
                                <li class="mb-2"><span class="me-2">🍰</span> Decadent cakes and pastries that melt in your mouth</li>
                                <li class="mb-2"><span class="me-2">🍦</span> Creamy, dreamy ice creams for every craving</li>
                                <li class="mb-2"><span class="me-2">🍮</span> Rich, velvety custards to sweeten your day</li>
                                <li><span class="me-2">🍩</span> Irresistible treats that are too good to share</li>
                            </ul>
                        </div>
                    </div>

                    <div className='d-flex col-md-8 col-12'>
                        <img className="d-block w-100 rounded" style={{objectFit: "cover", height: "25rem", boxShadow: "0 0 15px rgba(255, 255, 255, 0.7)"}} src={food3} alt="Food Picture"/>
                    </div>
                    
                </div>

            </div>    
        </div>

        <div className="w-100" style={{backgroundColor: "#CFB991"}}>

            <h1 className='fw-bold p-3'>Nearby Restaurants</h1>
            <div 
                id="nearby_restaurant"
                style={{
                    width: "100%",
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                    paddingBottom: "10px",
                }}
                className='p-3'
            >
            <   div className="d-flex flex-nowrap gap-2">
                <button
                    className={`btn ${selectedCuisine === null ? "btn-light" : "btn-dark"}`}
                    onClick={() => setSelectedCuisine(null)}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                >
                    <span style={{ fontSize: "24px" }}>🍽️</span>
                    <span style={{ fontSize: "14px", marginTop: "4px" }}>All</span>
                </button>
                {cuisines.map((cuisine) => (
                <button
                    key={cuisine}
                    className={`btn ${selectedCuisine === cuisine ? "btn-light" : "btn-dark"}`}
                    onClick={() => setSelectedCuisine(cuisine)}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                >
                    <span style={{ fontSize: "24px" }}>{getCuisineEmoji(cuisine)}</span>
                    <span style={{ fontSize: "14px", marginTop: "4px" }}>{cuisine}</span>
                </button>
                ))}
            </div>
        </div>

        {filteredRestaurants.length === 0 ? (
        <p>No restaurants found near your location.</p>
        ) : (
            <div className="container p-4">
            <div className="row justify-content-center">
                {filteredRestaurants.map(restaurant => (
                <div key={restaurant.id} className="col-md-4 mb-4"> {/* Responsive card column */}
                    <div className="card" style={{ width: "100%" }}> {/* Set width inside column */}
                    <img src={placeHolder} className="card-img-top" alt="Restaurant" style={{height: "200px", objectFit: "cover"}} />

                    <div className="card-body">
                        <h5 className="card-title">{restaurant.tags.name || "Unnamed Restaurant"}</h5>
                        <p className="card-text">
                        <strong>Cuisine:</strong> {formatCuisine(restaurant.tags.cuisine) || "Unknown"} <br />
                        <strong>Distance:</strong> {restaurant.distance_km} km <br />
                        <strong>Address:</strong> {restaurant.tags?.["addr:street"] || "Not Available"}
                        </p>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </div>
            )}
        </div>
    </>
        
    );
};

export default FoodInfo;

/*
<h2>{restaurant.tags.name || 'Unnamed'}</h2>
                            <p><strong>Phone:</strong> {restaurant.tags.phone || 'Unknown'}</p>
                            <p><strong>Cuisine:</strong> {restaurant.tags.cuisine || 'Unknown'}</p>
                            <p><strong>Street:</strong> {restaurant.tags["addr:street"] || 'Unknown'}</p>
                            <p><strong>State:</strong> {restaurant.tags["addr:state"] || 'Unknown'}</p>
                            <p><strong>City:</strong> {restaurant.tags["addr:city"] || 'Unknown'}</p>
                            <p><strong>PostCode:</strong> {restaurant.tags["addr:postcode"] || 'Unknown'}</p>
                            <p><strong>Hours:</strong> {restaurant.tags.opening_hours || 'Unknown'}</p>
                            <p><strong>Website:</strong><a href={restaurant.tags.website || ""}>{restaurant.tags.website || 'Unknown'}</a></p>

*/
