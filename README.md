# Movie Discovery — Cyberpunk UI

A React movie discovery app with a cyberpunk/Matrix-inspired UI. Search movies via **TMDB**, browse popular picks, and see **trending searches** powered by **Supabase** (PostgreSQL + RLS). Built with **Vite**, **Tailwind CSS v4**, and **React 19**.

![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase)

### App demo

![App demo](public/app%20demo.gif)

---

## Features

- **Search** — Debounced search against TMDB; results update as you type.
- **Discover** — Default view shows popular movies (TMDB discover endpoint).
- **Trending searches** — Top 5 search terms by count, stored and read from Supabase.
- **Search metrics** — Each search upserts a row (search term, count, poster, movie id) via a `SECURITY DEFINER` RPC so anonymous clients can write metrics without table INSERT policies.
- **Cyberpunk UI** — Neon accents, Orbitron/Rajdhani fonts, gradient text, book-spine style trending cards with repeated sideways index numbers, and a Matrix-style loading animation.
- **Resilient UX** — Cancelled-guard pattern for top-searches fetch (no setState after unmount); top-searches errors logged only, so a failed fetch doesn’t break the app.

---

## Tech & concepts demonstrated

| Area | Tech / concept |
|------|-----------------|
| **Frontend** | React 19, Vite 7, JSX, hooks (`useState`, `useEffect`, `useMemo`), controlled inputs, conditional rendering, list keys |
| **Data** | `fetch` + TMDB REST API (search + discover), Supabase JS client (`.from()`, `.rpc()`), env-based config |
| **UX** | Debounced search (`react-use`), loading and error states, accessible loading role, fallback poster (e.g. “CORRUPT DATA” placeholder) |
| **Backend / DB** | Supabase (PostgreSQL): table `metrics`, RPC `increment_search_count`, RLS policies (e.g. anon read for metrics, authenticated full access), `SECURITY DEFINER` for server-side writes |
| **Styling** | Tailwind CSS v4 (`@theme`, `@apply`, custom utilities), CSS nesting, custom properties (neon palette), responsive layout, scrollable horizontal list |
| **Code quality** | Small service modules (fetchTopSearches, updateSearchCount), shared Supabase client, reusable components (Search, MovieCard, PosterImage, Loading) |

---

## Prerequisites

- **Node.js** (v18+ recommended)
- **TMDB API key** — [Create a TMDB account](https://www.themoviedb.org/signup), then [API](https://www.themoviedb.org/settings/api) → “Request an API Key” (choose “Developer”) and copy the **API Read Access Token** (Bearer).
- **Supabase project** — [Supabase](https://supabase.com) → New project. You’ll need:
  - **Project URL** (Settings → API)
  - **anon public key** (Settings → API → “Project API keys” → `anon` `public`)
  - A **PostgreSQL table and RPC** (see below)

---

## Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd 9-some-movie-app
npm install
```

### 2. Environment variables

Create a `.env` (or `.env.local`) in the project root with:

```env
# TMDB API — use the "API Read Access Token" (Bearer) from https://www.themoviedb.org/settings/api
VITE_TMDB_API_KEY=your_tmdb_bearer_token

# Supabase — from Project Settings → API: Project URL and anon public key
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_anon_public_key
```

Vite only exposes variables prefixed with `VITE_` to the client; use these exact names.

### 3. Supabase database

In the Supabase **SQL Editor**, run:

**Table**

```sql
CREATE TABLE IF NOT EXISTS metrics (
  search_term text PRIMARY KEY,
  count bigint DEFAULT 1,
  poster_url text DEFAULT '',
  movie_id text DEFAULT ''
);
```

**RPC (upsert on search)**

```sql
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
```

**RLS (optional but recommended)**

- Enable RLS on `metrics`.
- Allow **anon** to read (so the app can show trending):  
  `CREATE POLICY "metrics_anon_read" ON metrics FOR SELECT TO anon USING (true);`
- Allow **authenticated** (or anon, if you prefer) full access as needed for your use case.

Without the anon SELECT policy, trending will stay empty because the app uses the anon key and never signs in.

### 4. Run the app

```bash
npm run dev
```

Open the URL shown (e.g. `http://localhost:5173`). Search for a movie to trigger a metrics upsert; the “Trending Movies” row will reflect top searches once RLS allows anon read.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (HMR) |
| `npm run build` | Production build (output in `dist/`) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check formatting |

---

## Project structure

```
src/
├── App.jsx                 # Root: state, TMDB fetch, top searches, layout
├── main.jsx
├── index.css               # Tailwind + theme, global and component styles
├── components/
│   ├── Search.jsx          # Search input
│   ├── MovieCard.jsx       # Movie card (poster, title, rating, year, language)
│   ├── PosterImage.jsx     # Poster or “CORRUPT DATA” placeholder
│   ├── Loading.jsx         # Matrix-style loading animation
│   └── icons/
│       ├── SearchIcon.jsx
│       └── StarIcon.jsx
├── services/
│   ├── fetchTopSearches.js # Supabase: select top N from metrics
│   └── updateSearchCount.js# Supabase: call increment_search_count RPC
└── utils/
    └── supabase.js         # Supabase client (env-based)
```

---

## License

MIT (or your chosen license).
