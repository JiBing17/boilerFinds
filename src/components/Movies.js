import React, {useEffect, useRef, useState} from 'react'
import Header from './Header';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons"; 
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import placeHolder from '../pictures/placeholder.jpg'
import { useNavigate } from 'react-router-dom';

const Movies = () => {

    const [popularMovies, setPopularMovies] = useState([])
    const [trendingMovies, setTrendingMovies] = useState([])
    const [topRatedMovies, setTopRatedMovies] = useState([])
    const [nowPlayingMovies, setNowPlayingMovies] = useState([])
    const [upcommingMovies, setUpCommingMovies] = useState([])
    const [movies, setMovies] = useState([])
    const [genres, setGenres] = useState({})
    const [durations, setDurations] = useState({});
    const [heroIndex, setHeroIndex] = useState(0)
    const [selectedMovieFilter, setSelectedMovieFilter] = useState("popular")
    const [likedMovies, setLikedMovies] = useState({})
    const [currentPage, setCurrentPage] = useState(1)
    const MAX_HERO_INDEX = 5
    const scrollContainerRef = useRef(null)

    const API_KEY = process.env.REACT_APP_API_KEY;
    const TMD_URL_POPULAR = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${currentPage}`
    const TMD_URL_TRENDING = `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}&language=en-US&page=${currentPage}`;
    const TMD_URL_TOP_RATED = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${currentPage}`;
    const TMD_URL_NOW_PLAYING = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${currentPage}`;
    const TMD_URL_TOP_UPCOMMING = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${currentPage}`;
    const storedUser = JSON.parse(localStorage.getItem('user'))
    const navigate = useNavigate()

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

    const handleScroll = (amount) => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy(
                {
                    left: amount,
                    behavior: "smooth"
                }
            )
        }
    }
    const toggleLikeMovie = (movie) => {
        setLikedMovies((prev)=> ({
            ...prev,
            [movie.id] : !prev[movie.id]
        
        }))
        const payload = {
            user_id: storedUser.id, 
            movie_id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            vote_average: movie.vote_average
        };

        const saveMovie = async()=> {
            try {
                const response = await fetch("http://127.0.0.1:5000/save_movie", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                })
                const data = await response.json()
                console.log(data.result)
            } catch(error) {
                console.log(error)
            }
        }
        saveMovie()
    }


    useEffect(()=>{
        const getSavedMovies = async ()=> {
            const response = await fetch(`http://127.0.0.1:5000/saved_movies?user_id=${storedUser.id}`) 
            const data = await response.json()
            console.log(data)
            const savedMovieIds = data.map(savedMovie => savedMovie.movie_id);
            let n = savedMovieIds.length
            for (let i = 0; i < n; i++) {
                likedMovies[savedMovieIds[i]] = true
            }
        }
        getSavedMovies()
    }, [storedUser.id])


    useEffect(()=>{
        const handleFilterMovies = ()=> {
            if (selectedMovieFilter === "trending_now") {
                setMovies(trendingMovies)
            } else if (selectedMovieFilter === "popular") {      
                setMovies(popularMovies)
            } else if (selectedMovieFilter === "top_rated") {
                setMovies(topRatedMovies)
            } else if (selectedMovieFilter === "saved") {
                //const savedMovies = movies.filter((movie) => likedMovies[movie.id])
                //setMovies(savedMovies)
                
                const getSavedMovies = async ()=> {
                    const response = await fetch(`http://127.0.0.1:5000/saved_movies?user_id=${storedUser.id}`) 
                    const data = await response.json()
                    console.log(data)
                    const savedMovieIds = data.map(savedMovie => savedMovie.movie_id);
                    const savedMovies = movies.filter(movie => 
                    savedMovieIds.includes(movie.id)
                    );
                    setMovies(savedMovies)
                }
                getSavedMovies()

                

            }
        }
        handleFilterMovies()
    }, [selectedMovieFilter])


    useEffect(()=>{   
        const fetchPopularMovies = async ()=> {
            try {
                const response = await fetch(TMD_URL_POPULAR)
                const data = await response.json()
                console.log("Fetched Movies:", data.results);
                setPopularMovies((prevMovies) =>[...prevMovies ,...data.results])
                setMovies((prevMovies) =>[...prevMovies ,...data.results])
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
                setTrendingMovies((prevMovies) =>[...prevMovies ,...data.results])
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
                setTopRatedMovies((prevMovies) =>[...prevMovies ,...data.results])
                data.results.forEach((movie) => fetchMovieDuration(movie.id));

            } catch(error) {
                console.log(error)
            }
        }
        const fetchUpCommingMovies = async ()=> {
            try {
                const response = await fetch(TMD_URL_TOP_UPCOMMING)
                const data = await response.json()
                console.log("Fetched Movies:", data.results);
                setUpCommingMovies((prevMovies) =>[...prevMovies ,...data.results])
                data.results.forEach((movie) => fetchMovieDuration(movie.id));

            } catch(error) {
                console.log(error)
            }
        }
        const fetchNowPlayingMovies = async ()=> {
            try {
                const response = await fetch(TMD_URL_NOW_PLAYING)
                const data = await response.json()
                console.log("Fetched Movies:", data.results);
                setNowPlayingMovies((prevMovies) =>[...prevMovies ,...data.results])
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
        fetchUpCommingMovies()
        fetchNowPlayingMovies()
        fetchGenres()

        },[currentPage])

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
                    {/* Overlay div */}
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0,0,0,0.3)", 
                        }}
                    ></div>
                    <div className="position-absolute text-white p-3 rounded" style={{top: "50%", left: "25%", transform: "translate(-50%, -50%)", maxWidth: "500px"}}>
                        
                        <p>Duration: {durations[trendingMovies[heroIndex].id]} mins</p>
                        <div className='d-flex justify-content-start'>
                            <p className='me-3 fw-bold'>⭐{trendingMovies[heroIndex].vote_average}</p>
                            <div>
                                {trendingMovies[heroIndex].genre_ids.map((genre_num) => {
                                    let n = trendingMovies[heroIndex].genre_ids.length 
                                    if (genre_num === trendingMovies[heroIndex].genre_ids[n-1]) {
                                        return (
                                            <span> {genres[genre_num]}</span>
                                        )
                                    }
                                    return (
                                        <span> {genres[genre_num]} |</span>
                                    )
                                })}
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
            

            <div className='p-4 position-relative'>
                <h2 className='text-white my-4' style={{borderBottom: "2px solid #fff", paddingBottom: "1rem"}}>🎟️Upcomming...</h2>
                <div ref={scrollContainerRef} class="d-flex gap-4 align-items-center text-center mt-4" style={{overflow: "hidden", overflowX: "auto", scrollbarWidth: "none"}}>
                    
                    {upcommingMovies.map((movie)=>(
                        <div class="col-md-2 text-white" onClick={()=> navigate(`/movie/${movie.id}`, {state: {movie, genres, durations, key: API_KEY}})}>
                            <div>
                                <div>
                                    <img src={movie.poster_path != null ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`: placeHolder} alt={movie.title} style={{objectFit: "contain"}} class="img-fluid"/>
                                </div>
                                <p className='text-start fw-bold m-0'>{movie.title}</p>
                                <div className='d-flex justify-content-between'>
                                    <p className='m-0'>{movie.release_date.split("-")[0]}</p>
                                    <p className='m-0'>{movie.vote_average}/10</p>
                                </div>
                                
                            </div>
                        </div>
                    ))}
                    
                </div>
                <FontAwesomeIcon icon={faArrowLeft} onClick={()=> {handleScroll(-800)}} className='position-absolute top-50 start-0 z-3 text-white ms-4 p-3 rounded-circle' style={{fontSize: "2rem", cursor: "pointer", backgroundColor: "rgba(0,0,0,.6)"}}/>
                <FontAwesomeIcon icon={faArrowRight} onClick={()=> {handleScroll(800)}} className='position-absolute top-50 end-0 z-3 text-white me-4 p-3 rounded-circle' style={{fontSize: "2rem", cursor: "pointer",  backgroundColor: "rgba(0,0,0,.6)"}}/>    
            </div>
            
            <div className='d-flex justify-content-evenly my-4'>
                <h5 style={{color: selectedMovieFilter === "popular"? "white": "", transform: selectedMovieFilter == "popular"? "scale(1.5)": "", transition: "all .3s ease-in-out"}} onClick={()=> setSelectedMovieFilter("popular")}>🔥Popular</h5>
                <h5 style={{color: selectedMovieFilter === "trending_now"? "white": "", transform: selectedMovieFilter == "trending_now"? "scale(1.5)": "", transition: "all .3s ease-in-out"}} onClick={()=> setSelectedMovieFilter("trending_now")}>📈Trending Now</h5>
                <h5 style={{color: selectedMovieFilter === "top_rated"? "white": "", transform: selectedMovieFilter == "top_rated"? "scale(1.5)": "", transition: "all .3s ease-in-out"}} onClick={()=> setSelectedMovieFilter("top_rated")}>⭐Top Rated</h5>
                <h5 style={{color: selectedMovieFilter === "saved"? "white": "", transform: selectedMovieFilter == "saved"? "scale(1.5)": "", transition: "all .3s ease-in-out"}} onClick={()=> setSelectedMovieFilter("saved")}>❤️Saved</h5>
            </div>

            <div class="container text-center mt-3">
                <div class="row">
                    {movies.length <= 0 ? 
                    (
                    <div className='text-white my-4'>
                        <h1 className='fw-bold'>No saved Movies</h1>
                        <p className='fst-italic'>Start saving your favorite movies!</p>
                    </div>
                    ) 
                    :
                    (movies.map((movie)=>(
                        <div class="col-md-2 text-white" onClick={()=> navigate(`/movie/${movie.id}`, {state: {movie, genres, durations, key: API_KEY}})}>
                            <div>
                                <div>
                                    <img src={movie.poster_path != null ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`: placeHolder} alt={movie.title} style={{objectFit: "contain"}} class="img-fluid"/>
                                </div>
                                <p className='text-start fw-bold m-0'>{movie.title}</p>
                                <div className='d-flex justify-content-between'>
                                    <p>{movie.release_date.split("-")[0]}</p>
                                    <div className='d-flex'>
                                        <p className='m-0 me-2'><FontAwesomeIcon icon={likedMovies[movie.id]? solidHeart: regularHeart } className='' onClick={()=> {toggleLikeMovie(movie)}}/></p>
                                        <p className='m-0'>⭐{movie.vote_average}</p>
                                    </div>
                                </div>                                
                            </div>
                        </div>
                    )))}
                </div>
                <button className='btn btn-primary px-4 py-1 my-1 fw-bold' 
                    onClick={()=> {
                        setCurrentPage((prev)=>prev+1)
                    }}>
                    🎬 View More
                </button>
            </div>
        </div>
    </>
    )
}

export default Movies