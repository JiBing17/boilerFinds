import React from 'react';
import { useLocation } from 'react-router-dom';

const Movie = () => {
  const location = useLocation();
  const { movie, genres, durations } = location.state || {};
  console.log(movie)
  console.log(genres)
  console.log(durations)
  if (!movie) return <div>No movie data available</div>;

  return (
    <>
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
            
            <p>Duration: {durations[movie.id]} mins</p>
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
            <p>{movie.overview}</p>

            <button className='btn btn-primary'>Watch Now</button>
            <button className='btn btn-dark ms-3'>Add To List</button>
        </div>
    </div>
    </>
  );
};

export default Movie;
