import { useState, useEffect } from 'react'
import Search from './components/Search'
import Loading from './components/Loading'
import MovieCard from './components/MovieCard'

const API_BASE_URL = 'https://api.themoviedb.org/3/'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [movieList, setMovieList] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchMovies = async (query = '') => {
    setLoading(true)
    setErrorMessage('')

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
      const response = await fetch(endpoint, API_OPTIONS)

      if (!response.ok) {
        throw new Error('Failed to fetch movies')
      }

      const data = await response.json()

      if (data.response === 'False') {
        setErrorMessage(data.error || 'Failed to fetch movies')
        setMovieList([])
        return
      }

      setMovieList(data.results || [])
    } catch (error) {
      console.error('Error fetching movies:', error)
      setErrorMessage(
        'An error occurred while fetching movies. Please try again later.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies(searchTerm)
  }, [searchTerm])

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="/hero.png" alt="hero banner" />
          <h1>
            dry your eyes & soul with{' '}
            <span className="text-gradient">endless entertainment</span>
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>
          {loading ? (
            <Loading />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App
