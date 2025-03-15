// Help function used to call OpenStreetMap API passing in arguments such as: StreetName, City, State ZipCode 
export const getCoordinates = async (address) => {

    // fetch lat and long from OpenStreetMap API given address parameter
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    const data = await response.json();
    if (data && data.length > 0) {
      // Returns the first result's latitude and longitude
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
  };
  