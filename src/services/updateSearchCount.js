import supabase from '../utils/supabase'

export const updateSearchCount = async (searchTerm, movie = null) => {
  const term = typeof searchTerm === 'string' ? searchTerm.trim() : ''
  if (!term) return

  const posterUrl = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
    : ''
  const movieId = movie?.id != null ? String(movie.id) : ''

  await supabase.rpc('increment_search_count', {
    p_search_term: term,
    p_poster_url: posterUrl,
    p_movie_id: movieId,
  })
}

// function in supabase
/*
CREATE OR REPLACE FUNCTION increment_search_count(
  p_search_term text,
  p_poster_url text DEFAULT '',
  p_movie_id text DEFAULT ''
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO metrics (search_term, count, poster_url, movie_id)
  VALUES (
    p_search_term,
    1,
    COALESCE(NULLIF(TRIM(p_poster_url), ''), ''),
    COALESCE(NULLIF(TRIM(p_movie_id), ''), '')
  )
  ON CONFLICT (search_term) DO UPDATE SET
    count = COALESCE(metrics.count, 0) + 1,
    poster_url = COALESCE(NULLIF(TRIM(EXCLUDED.poster_url), ''), metrics.poster_url),
    movie_id = COALESCE(NULLIF(TRIM(EXCLUDED.movie_id), ''), metrics.movie_id);
END;
$$;

GRANT EXECUTE ON FUNCTION increment_search_count(text, text, text) TO anon;
*/
