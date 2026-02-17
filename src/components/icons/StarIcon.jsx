const STAR_COLOR = '#00f5ff'

const StarIcon = ({ className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    aria-hidden
    {...props}
  >
    <path
      fill={STAR_COLOR}
      d="M12 2l2.5 7.5H22l-6 4.5 2.5 7.5L12 16l-6.5 5.5L8 14l-6-4.5h7.5L12 2z"
    />
    <line x1="5.5" y1="0" x2="5.5" y2="24" stroke={STAR_COLOR} strokeWidth="0.2" opacity="0.6" />
    <line x1="12.2" y1="0" x2="12.2" y2="24" stroke={STAR_COLOR} strokeWidth="0.2" opacity="0.5" />
    <line x1="18.8" y1="0" x2="18.8" y2="24" stroke={STAR_COLOR} strokeWidth="0.2" opacity="0.6" />
  </svg>
)

export default StarIcon
