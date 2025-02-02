import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import ItemForm from './components/ItemForm';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/signup">Signup</Link>
        <Link to="/login">Login</Link>
        <Link to="/item-form">ItemForm</Link>
      </nav>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/item-form" element={<ItemForm />} />
      </Routes>
    </Router>
  );
}

export default App;
