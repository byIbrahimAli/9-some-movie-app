const SEARCH_COLOR = '#00f5ff'

const SearchIcon = ({ className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke={SEARCH_COLOR}
    strokeWidth="2.25"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
    {...props}
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.35-4.35" />
    <line x1="4" y1="0" x2="4" y2="24" stroke={SEARCH_COLOR} strokeWidth="0.2" opacity="0.5" />
    <line x1="11" y1="0" x2="11" y2="24" stroke={SEARCH_COLOR} strokeWidth="0.2" opacity="0.6" />
    <line x1="18" y1="0" x2="18" y2="24" stroke={SEARCH_COLOR} strokeWidth="0.2" opacity="0.5" />
  </svg>
)

export default SearchIcon
