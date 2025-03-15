import React from 'react'
import { useLocation, useParams } from "react-router-dom";
import { cuisineEmojiMapping, cuisineImageMapping } from "../mappings";
import discoverFood1 from '../pictures/food/discover_food.jpg'
import discoverFood2 from '../pictures/food/discover_food_2.jpg'
import Header from './Header'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import RestaurantMap from './RestaurantMap';

const Restaurant = () => {

    const { id } = useParams(); // gets the restaurant id from the URL
    const location = useLocation(); // use to get state passed in from navigate
    const { restaurant } = location.state || {}; // obtain target restaurant info
    console.log(restaurant)
    const navigate = useNavigate() // used to handle navigation between pages

    // address var used to pass into geocode.js function for openstreet map API call 
    const address = `${restaurant.tags["addr:street"]}, ${restaurant.tags["addr:city"]}, ${restaurant.tags["addr:state"]} ${restaurant.tags["addr:postcode"]}`;

    // function used to format multiple cuisines (american;asian -> american, asian)
    const formatCuisine = (cuisineString) => {
      if (!cuisineString) return "";
      return cuisineString
        .split(";")
        .map(c => c.trim())
        .join(", ");
    }

  return (
    <>
        <Header/>
        <div style={{backgroundColor: "#101010"}}>

          {/* Hero Image Display Based on Cuisine Type*/}
          <div className='position-relative w-100' style={{ boxShadow: "0 0 15px rgba(255, 255, 255, 0.7)", marginTop: "3rem"}}>
            {/* Back to /foodInfo route button */}
            <FontAwesomeIcon 
              icon={faArrowLeft} 
              className="position-absolute z-3 p-2 rounded-circle " 
              color='white' 
              style={{ fontSize: "2rem", top: "2rem", left: "1rem", backgroundColor: "rgba(0,0,0,.6)"}} 
              onClick={()=>navigate("/foodInfo")}
            />
            {/* Image based on cuisine or first cuisine if multiple */}
            <img src={cuisineImageMapping[restaurant.tags.cuisine.split(";")[0]] || ""}  style={{ width: "100%", height: "30rem", objectFit: "cover"}}/>

            {/* Overlay text and view more button */}
            <div class="position-absolute top-50 start-50 translate-middle text-white text-center bg-dark bg-opacity-75 p-4 rounded">
                <h1>A Culinary Journey Awaits</h1>
                <p>Discover a world of exquisite flavors, inviting ambiance, and unforgettable dining experiences.</p>

                {/* Scroll to details on button click */}
                <button className='btn btn-primary'
                  onClick={() => {
                    const element = document.getElementById("restaurant_details");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}>
                  View Restaurant Details
                </button>
            </div>
          </div>
          
          {/* Call to Action Display + Text (1)*/}
          <div className='d-flex flex-column justify-content-center w-100 text-white gap-4 p-3'>
            <div className='d-flex flex-column-reverse flex-md-row p-4 gap-3'>
              <div className='d-flex col-12 col-md-6'>
                  <img className="d-block w-100 rounded" style={{objectFit: "cover", height: "25rem", boxShadow: "0 0 15px rgba(255, 255, 255, 0.7)"}} src={discoverFood1} alt="Food Picture"/>
              </div>
              <div className='d-flex flex-column align-items-center justify-content-center col-md-6 col-12'>
                  <h1 className='ms-md-4 ms-0 fw-bold fst-italic text-center'>Discover, Dine, Delight</h1>
                      <p className='text-center p-3'>
                        A journey of taste, crafted for those who appreciate great food.
                        Step into a space where every detail is designed for your enjoyment.
                      </p>
              </div>
            </div>

            {/* Call to Action Display + Text (2) */}
            <div className='d-flex flex-column flex-md-row p-4 gap-3'>
              <div className='d-flex flex-column align-items-center justify-content-center col-md-6 col-12'>
                    <h1 className='ms-md-4 ms-0 fw-bold fst-italic text-center'>Your Next Favorite Dining Spot</h1>
                    <p className='text-center p-3'>
                      Whether it's a casual bite or a special occasion, great food is always served here.
                      Indulge in flavors that turn an ordinary meal into something unforgettable.
                      </p>
                </div>
                <div className='d-flex col-12 col-md-6'>
                    <img className="d-block w-100 rounded" style={{objectFit: "cover", height: "25rem", boxShadow: "0 0 15px rgba(255, 255, 255, 0.7)"}} src={discoverFood2} alt="Food Picture"/>
                </div>
            </div>
          </div>

          {/* Section that displays the restaurants details (location, times, cuisine type, etc.) */}
          <div className='d-flex flex-column gap-3 w-100 text-white p-5' id="restaurant_details">
            <h2 className='pb-3 text-center'>- Restaurant Details - </h2>
            <div className=''>
              <div className='d-flex flex-md-row flex-column align-items-space-between w-100'>

                {/* Left Side */}
                <div className='d-flex flex-row align-items-center justify-content-center px-1 py-4 gap-4 col-md-6 col-12' style={{border: "3px solid #CFB991"}}>
                  <div >
                    <p><strong>Name:</strong> {restaurant.tags.name? restaurant.tags.name: "NA"}</p>
                    <p><strong>Street:</strong> {restaurant.tags["addr:street"] ? restaurant.tags["addr:street"]: "NA"}</p>
                    <p><strong>City:</strong> {restaurant.tags["addr:city"]? restaurant.tags["addr:city"]: "NA"}</p>
                    <p><strong>State:</strong> {restaurant.tags["addr:state"]? restaurant.tags["addr:state"]: "NA"}</p>
                    <p><strong>Postcode:</strong> {restaurant.tags["addr:postcode"]? restaurant.tags["addr:postcode"]: "NA"}</p>
                  </div>
                  <div>
                    <p><strong>Cuisine:</strong> {restaurant.tags.cuisine? formatCuisine(restaurant.tags.cuisine): "NA"}{cuisineEmojiMapping[restaurant.tags.cuisine]? cuisineEmojiMapping[restaurant.tags.cuisine]: ""}</p>
                    <p><strong>Opening Hours:</strong> {restaurant.tags.opening_hours? formatCuisine(restaurant.tags.opening_hours): "NA"}</p>
                    <p><strong>Phone:</strong> {restaurant.tags.phone? restaurant.tags.phone: "NA"}</p>
                    <p>
                      <strong>Website: </strong>
                      <a 
                        href={restaurant.tags.website? restaurant.tags.website: ""} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: "#CFB991", textDecoration: "underline" }}
                      >
                        Link To Offical Website
                      </a>
                    </p>
                  </div>
                </div>
                {/* Right Side */}
                <div className='col-md-6 col-12'>
                  <RestaurantMap address={address} />
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  )
}
export default Restaurant