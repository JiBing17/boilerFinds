import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { faArrowLeft, faArrowRight} from '@fortawesome/free-solid-svg-icons';
import placeHolder from '../pictures/placeholder.jpg'
import Header from './Header';
const Movie = () => {
  const location = useLocation();
  const { movie, genres, durations, key} = location.state || {};
  const navigate = useNavigate()
  const [similarMovies, setSimilarMovies] = useState([])
  const [castMembers, setCastMembers] = useState([])
  const [movieDetails, setMovieDetails] = useState("Similar Movies")
  const scrollContainerRef = useRef(null)

  console.log(movie)
  console.log(genres)
  console.log(durations)
  useEffect(()=>{
    const getSimilarMovies = async()=> {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/similar?api_key=${key}&language=en-US&page=1`)
        const data = await response.json()
        console.log(data.results)
        setSimilarMovies(data.results)
    }
    
    const getCastMembers = async()=> {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${key}&language=en-US`)
        const data = await response.json()
        console.log(data)
        setCastMembers(data.cast)
        // setSimilarMovies(data.results)
    }
    getSimilarMovies()
    getCastMembers()


  },[movie])

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
  if (!movie) return <div>No movie data available</div>;



  return (
    <>
      <Header/>
      <div className="position-relative">
        <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            className="img-fluid w-100"
            style={{ height: "80vh", objectFit: "cover" }}
            alt={movie.title}
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

        <div className="position-absolute text-white p-3 rounded" style={{top: "50%", left: "20%", transform: "translate(-50%, -50%)", maxWidth: "500px"}}>
            <FontAwesomeIcon icon={faArrowLeft} className='mb-4' size="lg" onClick={()=> navigate("/movies")}/>
            <p>Duration: {durations[movie.id]? durations[movie.id]: "NA"} mins</p>
            <div className='d-flex justify-content-start'>
                <p className='me-3 fw-bold'>⭐{movie.vote_average}</p>
                <div>
                    {movie.genre_ids.map((genre_num) => {
                        let n = movie.genre_ids.length 
                        if (genre_num === movie.genre_ids[n-1]) {
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
            <h1 className='fw-bold'>{movie.title}</h1>

            <button className='btn btn-primary'>Watch Now</button>
            <button className='btn btn-dark ms-3'>Add To List</button>

            <p className='mt-3'>{movie.overview}</p>

        </div>
    </div>
    <div style={{backgroundColor: "#101010"}}>
        
        <div className='p-4 position-relative'>
            <div className='text-white d-flex justify-content-start gap-4 border-bottom pb-1'>
                <h4 style={{transform: movieDetails == "Similar Movies" ? "scale(1.1)": "", transition: "all .3s ease-in-out", fontWeight: movieDetails == "Similar Movies" ? "700": "300"}} onClick={()=>setMovieDetails("Similar Movies")}>Similar Movies</h4>
                <h4 style={{transform: movieDetails == "Cast" ? "scale(1.1)": "", transition: "all .3s ease-in-out", fontWeight: movieDetails == "Cast" ? "700": "300"}} onClick={()=>setMovieDetails("Cast")}>Cast</h4>
            </div>
            <div ref={scrollContainerRef} class="d-flex gap-4 align-items-center text-center mt-4" style={{overflow: "hidden", overflowX: "auto", scrollbarWidth: "none"}}>
                
                {movieDetails === "Similar Movies" ? (
                    similarMovies.map((movie)=>(
                        <div class="col-md-2 text-white" onClick={()=> navigate(`/movie/${movie.id}`, {state: {movie, genres, durations, key: key}})}>
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
                    ))
                ) : (
                    castMembers.map((member)=>(
                        <div class="col-md-2 text-white">
                            <div>
                                <div className='position-relative'>
                                    <img src={member.profile_path != null ? `https://image.tmdb.org/t/p/w500${member.profile_path}`: placeHolder} alt={member.name} style={{objectFit: "contain"}} class="img-fluid"/>
                                    <div className='position-absolute bottom-0 start-0 w-100' style={{backgroundColor: "rgba(0,0,0,.4)"}}>
                                        <div className='d-flex flex-column align-items-start'>
                                            <p className='text-start fw-bold m-0'>{member.name}</p>
                                            <p className='m-0'>{member.character}</p>
                                        </div>
                                    </div>
                                    <p className='position-absolute top-0 end-0 m-0 bg-black p-2' style={{borderBottomLeftRadius: "1rem"}}>🔥{member.popularity}</p>

                                </div>
                            </div>
                        </div>
                    ))
                )}
                
                
            </div>
            <FontAwesomeIcon icon={faArrowLeft} onClick={()=> {handleScroll(-800)}} className='position-absolute top-50 start-0 z-3 text-white ms-4 p-3 rounded-circle' style={{fontSize: "2rem", cursor: "pointer", backgroundColor: "rgba(0,0,0,.6)"}}/>
            <FontAwesomeIcon icon={faArrowRight} onClick={()=> {handleScroll(800)}} className='position-absolute top-50 end-0 z-3 text-white me-4 p-3 rounded-circle' style={{fontSize: "2rem", cursor: "pointer",  backgroundColor: "rgba(0,0,0,.6)"}}/>    
        </div>
    </div>
    

    </>
  );
};

export default Movie;
