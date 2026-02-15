import React from 'react'
import StarIcon from './icons/StarIcon'

const MovieCard = ({
  movie: { title, vote_average, poster_path, original_language, release_date },
}) => {
  return (
    <div className="movie-card">
      {poster_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
          alt="title"
        />
      ) : (
        <div className="movie-card-poster-placeholder" aria-hidden>
          <span className="movie-card-poster-placeholder-text">
            CORRUPT DATA
          </span>
        </div>
      )}

      <div className="mt-4">
        <h3>{title}</h3>

        <div className="content">
          <div className="rating">
            <StarIcon className="icon-rating-star" />
            <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
          </div>

          <span>•</span>
          <p className="lang">{original_language}</p>

          <span>•</span>
          <p className="year">
            {release_date ? release_date.split('-')[0] : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MovieCard
