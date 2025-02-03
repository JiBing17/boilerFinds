import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

function ItemForm() {
  const [name, setName] = useState('');
  const [item, setItem] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
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

  // load items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user session
    navigate('/'); // Redirect to login
  };


  // function called when form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Reset message

    const formData = { name, item, price, description, email }; // store data in object

    try {
      const response = await fetch('http://127.0.0.1:5000/submit', { // call submit endpoint from flask server 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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

    // reset form fields
    setName('');
    setItem('');
    setPrice('');
    setDescription('');
    setEmail('');
  };

  return (
    <>
      <Header/>

      <div>
      <h2>Item Submission Form</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Item:</label>
          <input type="text" value={item} onChange={(e) => setItem(e.target.value)} required />
        </div>
        <div>
          <label>Price:</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <button type="submit">Submit</button>
      </form>

      {/* Show success or error message */}
      {message && <p>{message}</p>}

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
    </div>
    </>
    
  );
}

export default ItemForm;
