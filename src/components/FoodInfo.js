import React, { useState, useEffect } from 'react';

const FoodInfo = () => {

    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            setRestaurants(data);
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

    // dummy display for info
    return (
        <div style={{ padding: '20px' }}>
            <h1>Nearby Restaurants</h1>
            {restaurants.length === 0 ? (
            <p>No restaurants found near your location.</p>
            ) : (
                <ul>
                    {restaurants.map(restaurant => (
                        <li key={restaurant.id}>
                        <h2>{restaurant.tags.name || 'Unnamed'}</h2>
                        <p><strong>Cuisine:</strong> {restaurant.tags.cuisine || 'Unknown'}</p>
                        <p><strong>Coordinates:</strong> {restaurant.lat}, {restaurant.lon}</p>
                        <pre>{JSON.stringify(restaurant.tags, null, 2)}</pre> {/* Dump all tags */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FoodInfo;
