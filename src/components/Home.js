import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import SubmitItem from './SubmitItem';
function Home() {
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


  return (
    <>
      <Header/>
      <SubmitItem/>

    </>
    
  );
}

export default Home;
