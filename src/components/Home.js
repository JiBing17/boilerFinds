import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import SubmitItem from './SubmitItem';

function Home() {

  return (
    <>
      <Header/>
      <SubmitItem/>

    </>
    
  );
}

export default Home;
