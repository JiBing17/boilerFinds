import React, {useEffect, useState} from 'react'
import { useSVGOverlay } from 'react-leaflet/SVGOverlay';
import Header from './Header';
const Movies = () => {

    const API_KEY = process.env.REACT_APP_API_KEY;
    const TMD_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
    const [movies, setMovies] = useState([])

    useEffect(()=>{   
        const fetchMovies = async ()=> {
            try {
                const response = await fetch(TMD_URL)
                const data = await response.json()
                console.log("Fetched Movies:", data.results);
                setMovies(data.results)
            } catch(error) {
                console.log(error)
            }
        }
        fetchMovies()
        },[])
    return (
        <>
        <Header/>
        <div style={{backgroundColor: "#101010"}}>
            <h1 className='text-white' style={{marginTop: "3rem"}}>Movies</h1>
            <div class="container text-center mt-3">
                <div class="row">
                    {movies.map((movie)=>(
                        <div class="col-md-2 text-white">
                            <div>
                                <div>
                                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} style={{objectFit: "contain"}} class="img-fluid"/>
                                </div>
                                <p className='text-start fw-bold'>{movie.title}</p>
                                <div className='d-flex justify-content-between'>
                                    <p>{movie.release_date.split("-")[0]}</p>
                                    <p>{movie.vote_average}/10</p>
                                </div>
                                
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>

    )
}

export default Movies