import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home'
import Help from './components/Help';
import Profile from './components/Profile';
import UsersList from './components/UserList';
import ShopItem from './components/ShopItem';
import FoodInfo from './components/FoodInfo';
import Restaurant from './components/Restaurant';
import Movies from './components/Movies';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/help" element={<Help/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/userlist" element={<UsersList/>} />
        <Route path="/shop-item/:id" element={<ShopItem/>} />
        <Route path="/foodInfo" element={<FoodInfo/>} />
        <Route path="/restaurant/:id" element={<Restaurant/>}/>
        <Route path="/movies" element={<Movies/>}/>
      </Routes>
    </Router>
  );
}

export default App;
