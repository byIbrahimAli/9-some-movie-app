import React from 'react'
import SearchIcon from './icons/SearchIcon'

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <div>
        <SearchIcon className="icon-search" />
        <input
          type="text"
          placeholder="Search before food gets cold"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  )
}

export default Search
