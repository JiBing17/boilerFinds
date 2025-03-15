import React, {useEffect, useState} from 'react'
import Header from './Header';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const Movies = () => {

    const API_KEY = process.env.REACT_APP_API_KEY;
    const TMD_URL_POPULAR = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
    const TMD_URL_TRENDING = `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`;
    const TMD_URL_TOP_RATED = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;


    const [popularMovies, setPopularMovies] = useState([])
    const [trendingMovies, setTrendingMovies] = useState([])
    const [topRatedMovies, setTopRatedMovies] = useState([])
    const [genres, setGenres] = useState({})
    const [durations, setDurations] = useState({});
    const [heroIndex, setHeroIndex] = useState(0)
    const MAX_HERO_INDEX = 5

    const handleHeroRight = ()=> {
        setHeroIndex((prev) => {
            prev = prev + 1
            if (prev > MAX_HERO_INDEX) {
                prev = 0
            }
            return prev
        } )
    }
    const handleHeroLeft = ()=> {
        setHeroIndex((prev) =>{
            prev = prev - 1
            if (prev < 0) {
                prev = 10
            }
            return prev
        } )
    }


    useEffect(()=>{   
        const fetchPopularMovies = async ()=> {
            try {
                const response = await fetch(TMD_URL_POPULAR)
                const data = await response.json()
                console.log("Fetched Movies:", data.results);
                setPopularMovies(data.results)
                data.results.forEach((movie) => fetchMovieDuration(movie.id));

            } catch(error) {
                console.log(error)
            }
        }
        const fetchTrendingMovies = async ()=> {
            try {
                const response = await fetch(TMD_URL_TRENDING)
                const data = await response.json()
                console.log("Fetched Movies:", data.results);
                console.log("Fetched Movies:", data.results[0].poster_path
                );
                setTrendingMovies(data.results)
                data.results.forEach((movie) => fetchMovieDuration(movie.id));

            } catch(error) {
                console.log(error)
            }
        }
        const fetchTopRatedMovies = async ()=> {
            try {
                const response = await fetch(TMD_URL_TOP_RATED)
                const data = await response.json()
                console.log("Fetched Movies:", data.results);
                setTopRatedMovies(data.results)
                data.results.forEach((movie) => fetchMovieDuration(movie.id));

            } catch(error) {
                console.log(error)
            }
        }
        const fetchGenres = async()=> {
            try {
                const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`);
                const data = await response.json()
    
                // Convert the genre array into an object: { 28: "Action", 878: "Sci-Fi", 12: "Adventure" }
                const genreMap = {};
                data.genres.forEach((genre) => {
                genreMap[genre.id] = genre.name;
                });
                console.log("genre_map: ", genreMap)
                setGenres(genreMap)

            } catch(error) {
                console.log("error: ", error)
            }
        }

        const fetchMovieDuration = async (movieId) => {
            try {
              const response = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`
              );
              const data = await response.json();
      
              // Store the runtime in an object where the key is movieId
              setDurations((prevDurations) => ({
                ...prevDurations,
                [movieId]: data.runtime,
              }));
            } catch (error) {
              console.error(`Error fetching runtime for movie ID ${movieId}:`, error);
            }
        };
        fetchPopularMovies()
        fetchTopRatedMovies()
        fetchTrendingMovies()
        fetchGenres()

        },[])

    return (
        <>
        <Header/>
        <div style={{backgroundColor: "#101010"}}>

        <div className="container-fluid p-0" style={{marginTop: "3rem"}}>
            {trendingMovies.length > 0 && trendingMovies[heroIndex].poster_path && (
                <div className="position-relative">
                    <img
                        src={`https://image.tmdb.org/t/p/original${trendingMovies[heroIndex].backdrop_path}`}
                        className="img-fluid w-100"
                        style={{ height: "80vh", objectFit: "cover" }}
                        alt={trendingMovies[heroIndex].title}
                    />
                    <div className="position-absolute text-white bg-dark bg-opacity-50 p-3 rounded" style={{top: "50%", left: "30%", transform: "translate(-50%, -50%)", maxWidth: "500px"}}>
                        
                        <p>Duration: {durations[trendingMovies[heroIndex].id]} mins</p>
                        <div className='d-flex justify-content-start'>
                            <p className='me-3 fw-bold'>⭐{trendingMovies[heroIndex].vote_average}</p>
                            <div>
                                {trendingMovies[heroIndex].genre_ids.map((genre_num) =>(
                                    <span> {genres[genre_num]} |</span>
                                ))}
                            </div>
                            
                        </div>
                        <h1 className='fw-bold'>{trendingMovies[heroIndex].title}</h1>
                        <p>{trendingMovies[heroIndex].overview}</p>

                        <button className='btn btn-primary'>Watch Now</button>
                        <button className='btn btn-dark ms-3'>Add To List</button>
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faArrowLeft} onClick={handleHeroLeft} className='position-absolute top-50 start-0 z-3 text-white ms-3 p-3 rounded-circle' style={{fontSize: "2rem", cursor: "pointer", backgroundColor: "rgba(0,0,0,.6)"}}/>
                        <FontAwesomeIcon icon={faArrowRight} onClick={handleHeroRight} className='position-absolute top-50 end-0 z-3 text-white me-3 p-3 rounded-circle' style={{fontSize: "2rem", cursor: "pointer",  backgroundColor: "rgba(0,0,0,.6)"}}/>
                    </div>
                    
                </div>
            )}
            </div>


            <h1 className='text-white' >Movies</h1>
            <div class="container text-center mt-3">
                <div class="row">
                    {popularMovies.map((movie)=>(
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