import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home'
import Help from './components/Help';
import Profile from './components/Profile';
import UsersList from './components/UserList';


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
      </Routes>
    </Router>
  );
}

export default App;
