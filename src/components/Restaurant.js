import React from 'react'
import { useLocation, useParams } from "react-router-dom";

import Header from './Header'
const Restaurant = () => {

    const { id } = useParams(); // gets the restaurant id from the URL
    const location = useLocation(); // use to get state passed in from navigate
    const { restaurant } = location.state || {}; // obtain target restaurant info
    console.log(restaurant)
  return (
    <>
        <Header/>

    </>
  )

}

export default Restaurant