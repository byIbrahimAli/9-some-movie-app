import { useState, useEffect } from 'react'
import { useDebounce } from 'react-use'
import Search from './components/Search'
import Loading from './components/Loading'
import MovieCard from './components/MovieCard'
import PosterImage from './components/PosterImage'
import { updateSearchCount } from './services/updateSearchCount'
import { fetchTopSearches } from './services/fetchTopSearches'

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
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [topSearches, setTopSearches] = useState([])
  const [topSearchesLoading, setTopSearchesLoading] = useState(false)

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

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

      if (query) {
        updateSearchCount(query, data.results?.[0]).catch((err) =>
          console.error('Search count update failed', err)
        )
      }
    } catch (error) {
      console.error('Error fetching movies:', error)
      setErrorMessage(
        'An error occurred while fetching movies. Please try again later.'
      )
    } finally {
      setLoading(false)
    }
  }

  const loadTopSearches = async (getIsCancelled = () => false) => {
    setTopSearchesLoading(true)
    try {
      const data = await fetchTopSearches(5)
      if (!getIsCancelled()) setTopSearches(data)
    } catch (err) {
      if (!getIsCancelled()) console.error('Top searches fetch failed', err)
    } finally {
      if (!getIsCancelled()) setTopSearchesLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm)
  }, [debouncedSearchTerm])

  // Cancelled guard: avoid setState after unmount (e.g. user navigates away before fetch resolves). Without it: React warnings and possible memory leaks or state updates on an unmounted component.
  useEffect(() => {
    let cancelled = false
    loadTopSearches(() => cancelled)
    return () => {
      cancelled = true
    }
  }, [])

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

        {topSearchesLoading ? (
          <Loading />
        ) : (
          <section className="trending">
            <h2>Trending Movies</h2>
            {console.log(topSearches)}
            <ul>
              {topSearches.map((movie, index) => (
                <li key={movie.search_term} className="trending-item">
                  <div className="trending-spine" aria-hidden>
                    {Array.from({ length: 8 }, (_, i) => (
                      <span
                        key={i}
                        className="trending-spine-number"
                      >
                        {index + 1}
                      </span>
                    ))}
                  </div>
                  <div className="trending-poster-slot">
                    <PosterImage
                      src={movie.poster_url}
                      alt={movie.search_term}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>
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
