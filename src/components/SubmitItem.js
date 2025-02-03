import React, { useState , useEffect } from 'react'

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
    <div className='d-flex align-items-center justify-content-center p-5' style={{backgroundColor: "#101010"}}>

      {/* Left - Text */}
      <div className='d-flex flex-column align-items-center justify-content-center w-50'>
        <h1 className='text-white'>Want to sell an item?</h1>
        <p className='text-center text-white'>BolerFINDS is your go-to marketplace for buying and selling items within the community. Simply fill out the form, list your item, and wait for interested buyers to reach out. It’s fast, easy, and completely hassle-free!</p>
      </div>


      {/* Right - FORM */}
      <div className="d-flex flex-column align-items-center justify-content-center w-50">
        <form 
          onSubmit={handleSubmit} 
          className="p-4 rounded-4 shadow-lg"
          style={{
            backgroundColor: "#ffffff", 
            border: "6px solid #CFB991",
            width: "100%",
            maxWidth: "500px"
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
    {/* Display all submitted items */}
    <h3>Submitted Items</h3>
      <ul>
        {items.map((itm) => (
          <li key={itm.id}>
            <strong>{itm.item}</strong> - ${itm.price} <br />
            <small>Submitted by: {itm.name} ({itm.email})</small>
            <p>{itm.description}</p>
          </li>
        ))}
      </ul>
    </>
  )
}

export default SubmitItem