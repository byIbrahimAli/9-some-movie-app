import supabase from '../utils/supabase'

/**
 * Fetches the top N rows from metrics by count (highest first).
 * @param {number} limit - Max rows to return (default 5)
 * @returns {Promise<Array<{ search_term: string, count: number | null, poster_url: string, movie_id: string }>>}
 */
export const fetchTopSearches = async (limit = 5) => {
  const { data, error } = await supabase
    .from('metrics')
    .select('search_term, count, poster_url, movie_id')
    .order('count', { ascending: false, nullsFirst: false })
    .limit(limit)

  if (error) throw error
  return data ?? []
}
