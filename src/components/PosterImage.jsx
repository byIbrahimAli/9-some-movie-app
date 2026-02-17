const PosterImage = ({ src, alt }) => {
  if (src) {
    return <img src={src} alt={alt} />
  }
  return (
    <div className="movie-card-poster-placeholder" aria-hidden>
      <span className="movie-card-poster-placeholder-text">CORRUPT DATA</span>
    </div>
  )
}

export default PosterImage
