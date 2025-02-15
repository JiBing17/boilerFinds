import React, { useState , useEffect } from 'react'
import placeHolder from '../pictures/placeholder.jpg'
import eMarket from '../pictures/eMarket.jpg'
import BuyGrid from './BuyGrid'

const SubmitItem = () => {

    const [name, setName] = useState('');
    const [item, setItem] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [items, setItems] = useState([]);
    const [image, setImage] = useState(null);


    // retrieve the current user info from localStorage when the component mounts
    useEffect(() => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        setName(user.name);
        setEmail(user.email);
      }
      fetchItems();

    }, []);


    // Fetch all items from the database
    const fetchItems = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/items'); // call items endpoint for flask server
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };


  // function called when form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // reset message

    // store data in FormData Object
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('item', item);
    formData.append('price', price);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    } 

    try {
      const response = await fetch('http://127.0.0.1:5000/submit', { // call submit endpoint from flask server 
        // no header since we are using FormData 
        method: 'POST',
        body: formData
      });

      const data = await response.json(); // get response from server

      if (response.ok) { // valid response
        setMessage(data.message);
        fetchItems(); // refresh item list after successful submission

      } else {
        setMessage(data.error);
      }

    } catch (error) {
      console.error('Error:', error);
      setMessage('Failed to submit the form.');
    }

    setItem('');
    setPrice('');
    setDescription('');
    setImage(null);

  };
  // Handle image selection from the file input
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (

    <>
    <div className='d-flex flex-column flex-md-row align-items-md-end justify-content-center p-5 gap-3' style={{backgroundColor: "#101010", marginTop: "3rem"}}>

      {/* Left - Text */}
      <div className='d-flex flex-column align-items-center justify-content-center col-12 col-md-6'>
        <h1 className='text-white text-md-start'>Want to sell an item?</h1>
        <p className='text-center text-white'>Simply fill out the form, list your item, and wait for interested buyers to reach out. It’s fast, easy, and completely hassle-free!</p>
        <div className='d-flex align-items-center justify-content-center'>
          <img src={eMarket} style={{
              width: "100%",
              height: "auto",
              borderRadius: "10px",
              boxShadow: "0px 4px 8px rgba(255, 255, 255, 0.2)"
          }}/>
        </div>
      </div>


      {/* Right - FORM */}
      <div className="d-flex flex-column align-items-center justify-content-center col-12 col-md-6">
        <form 
          onSubmit={handleSubmit} 
          className="p-4 rounded-4"
          style={{
            backgroundColor: "#ffffff", 
            border: "6px solid #CFB991",
            width: "100%",
            maxWidth: "500px",
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)"

          }}
        >
          <div className="mb-3">
            <label className="form-label" style={{ color: "#CFB991" }}>Item:</label>
            <input 
              type="text" 
              value={item} 
              onChange={(e) => setItem(e.target.value)} 
              required 
              className="form-control"
              style={{
                borderRadius: "50px",
                padding: "12px",
                border: "1px solid #CFB991",
                color: "#CFB991"
              }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ color: "#CFB991" }}>Price:</label>
            <input 
              type="number" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              required 
              className="form-control"
              style={{
                borderRadius: "50px",
                padding: "12px",
                border: "1px solid #CFB991",
                color: "#CFB991"
              }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ color: "#CFB991" }}>Description:</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
              className="form-control"
              rows="3"
              style={{
                borderRadius: "20px",
                padding: "12px",
                border: "1px solid #CFB991",
                color: "#CFB991"
              }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ color: "#CFB991" }}>
              Image:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="form-control"
              style={{ borderRadius: "50px" }}
            />
        </div>


          <button 
            type="submit" 
            className="btn w-100 rounded-4"
            style={{
              backgroundColor: "#CFB991",
              border: "3px solid #CFB991",

              color: "white",
              fontWeight: "bold",
              padding: "12px",
              transition: "0.3s"
            }}
          >
            Submit
          </button>
        </form>

        {/* Show success or error message */}
        {message && <p className="mt-3 text-black">{message}</p>}
      </div>
          
    </div>
    <BuyGrid items={items} />

  </>
  )
}

export default SubmitItem