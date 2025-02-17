import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import placeHolder from '../pictures/placeholder.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faArrowLeft, faA, faArrowUpWideShort } from '@fortawesome/free-solid-svg-icons';
import Header from './Header';
const ShopItem = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const item = location.state?.item;

    if (!item) {
        return <h2 className="text-center text-danger">Item not found!</h2>;
    }

    return (
       <>
       <Header/>


        <div className='' style={{marginTop: "3rem"}}>
            <p className='p-4'><FontAwesomeIcon icon={faArrowLeft} className='me-2'/>Back to Results</p>

            <div className='d-flex px-4 w-100'>
                <img src={item.image && item.image !== "" ? `http://127.0.0.1:5000/uploads/${item.image}` : placeHolder} className='h-auto d-block col-md-6' style={{maxWidth: "100%", maxHeight: "80vh", objectFit: "cover"}}/>
                <div className='d-flex flex-column align-items-start justify-content-evenly text-black border p-4 col-md-6'>

                    <div className='d-flex flex-column w-100'>
                        <div className='d-flex align-items-center justify-content-between w-100'>
                            <h1>{item.item}</h1>
                            <h1 style={{color: "green"}}>${item.price}</h1>
                        </div>
                        <div className='d-flex flex-column align-items-start justify-content-center w-100' style={{borderBottom: "1px solid black"}}>
                            <h6>Description:</h6>
                            <p className='text-muted'>{item.description}</p>
                        </div>
                    </div>
                    


                    <div className='d-flex flex-column justify-content-center align-items-start'>
                        <h1>Seller Info</h1>
                        <p>Name: {item.name}</p>
                        <p>Email: {item.email}</p>   
                        <button className='btn btn-primary'>Buy Now</button>
                    </div>

                </div>

            </div>
            

            
        </div>
       </>
    );
}

export default ShopItem;
