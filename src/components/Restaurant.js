import React from 'react'
import { useLocation, useParams } from "react-router-dom";
import { cuisineEmojiMapping, cuisineImageMapping } from "../mappings";
import discoverFood1 from '../pictures/food/discover_food.jpg'
import discoverFood2 from '../pictures/food/discover_food_2.jpg'
import Header from './Header'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

const Restaurant = () => {

    const { id } = useParams(); // gets the restaurant id from the URL
    const location = useLocation(); // use to get state passed in from navigate
    const { restaurant } = location.state || {}; // obtain target restaurant info
    console.log(restaurant)
    const navigate = useNavigate()
  return (
    <>
        <Header/>
        <div style={{backgroundColor: "#101010"}}>

          <div className='position-relative w-100' style={{ boxShadow: "0 0 15px rgba(255, 255, 255, 0.7)", marginTop: "3rem"}}>
            <FontAwesomeIcon 
              icon={faArrowLeft} 
              className="position-absolute z-3" 
              color='white' 
              style={{ fontSize: "2rem", top: "2rem", left: "1rem" }} 
              onClick={()=>navigate("/foodInfo")}
            />
            <img src={cuisineImageMapping[restaurant.tags.cuisine]} style={{ width: "100%", height: "30rem", objectFit: "cover"}}/>

            <div class="position-absolute top-50 start-50 translate-middle text-white text-center bg-dark bg-opacity-75 p-4 rounded">
                <h1>A Culinary Journey Awaits</h1>
                <p>Discover a world of exquisite flavors, inviting ambiance, and unforgettable dining experiences.</p>
                <button className='btn btn-primary'>View Info</button>
            </div>
          </div>

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
        </div>
        

        

    </>
  )

}

export default Restaurant