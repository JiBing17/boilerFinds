import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import placeHolder from '../pictures/placeholder.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
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
      <Header />
      <div style={{ backgroundColor: "#101010", marginTop: "3rem", minHeight: "100vh" }}>
        <a
          className="p-4 d-block text-white"
          style={{ textDecoration: "none", cursor: "pointer" }}
          onClick={() => {
            navigate('/home');
            setTimeout(() => {
              const targetElement = document.getElementById('productDisplay');
              if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
              }
            }, 500);
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Back to Results
        </a>

        <div className="d-flex flex-column flex-md-row px-4 w-100">
          {/* Fixed-size image container */}
          <div className="col-md-6" style={{ height: "400px", overflow: "hidden" }}>
            <img
              src={
                item.image && item.image !== ""
                  ? `http://127.0.0.1:5000/uploads/${item.image}`
                  : placeHolder
              }
              alt={item.item || "Shop item"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Card content */}
          <div className="col-md-6 d-flex flex-column align-items-start justify-content-around text-black border p-4 bg-white gap-4">
            <div className="d-flex flex-column w-100 pb-3" style={{ borderBottom: "1px solid black" }}>
              <div className="d-flex align-items-center justify-content-between w-100">
                <h1 className="fw-bold">{item.item}</h1>
                <h1 className="fw-bold" style={{ color: "#85BB65" }}>${item.price}</h1>
              </div>
              <div className="d-flex flex-column align-items-start justify-content-center w-100">
                <h6>Details:</h6>
                <p className="text-muted">{item.description}</p>
              </div>
              <div className="d-flex align-items-center gap-2">
                <button className="btn btn-primary">Add to cart</button>
                <button className="btn btn-secondary">Message Seller</button>
              </div>
            </div>

            <div className="d-flex flex-column justify-content-center align-items-start">
              <h1 className="fw-bold">Seller's Information</h1>
              <p className="text-muted m-0">
                <span className="fw-bold">Name: </span>
                {item.name}
              </p>
              <p className="text-muted m-0">
                <span className="fw-bold">Email: </span>
                {item.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopItem;
