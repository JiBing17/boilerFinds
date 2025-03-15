import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getCoordinates } from './utils/geocode';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import placeholderImage from "../pictures/placeholder.jpg";

// Custom Marker Icon to mark location on Map
const customIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const RestaurantMap = ({ address }) => {

  // state used to store coordinates and error message
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCoords = async () => {
      try {
        // fetch and set coordinates based on address
        const result = await getCoordinates(address);
        if (result) {
          setCoords(result);

        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      }
    };
    fetchCoords();
  }, [address]);

  // error handling
  if (error || !coords) {
    return (
      <div className="text-center position-relative">
        <img
          src={placeholderImage}
          alt="Map not available"
          style={{ height: "400px", width: "100%", objectFit: "cover"}}
        />
        <p style={{ color: "#000", fontSize: "1.2rem", transform: "translate(-50%, -50%)"}} className='position-absolute top-50 start-50 z-3 fw-bold'>
          Map unavailable. Please check the address.
        </p>
      </div>
    );
  }
  return (
    <MapContainer
      center={[coords.lat, coords.lng]}  // Sets the initial center position of the map using coordinates
      zoom={15}  // Sets the initial zoom level (higher number means closer view)
      scrollWheelZoom={false}  // Disables zooming with the scroll wheel to prevent accidental zoom changes
      style={{ height: "400px", width: "100%" }} 
    >
      {/* Responsible for rendering the map tiles using OpenStreetMap */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* Marker component places a marker at the specified coordinates */}
      <Marker position={[coords.lat, coords.lng]} icon={customIcon}>
        <Popup>Restaurant Location</Popup>
      </Marker>
    </MapContainer>
  );
};
export default RestaurantMap;