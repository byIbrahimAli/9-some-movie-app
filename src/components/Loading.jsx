import { useMemo } from 'react'

const RAIN_CHARS = '01ｱｲｳｴｵｶｷｸｹｺﾊﾐﾋﾌﾎ'
const COLUMN_COUNT = 16
const CHARS_PER_COLUMN = 42

function getRandomChar() {
  return RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)]
}

function buildColumnChars() {
  return Array.from({ length: CHARS_PER_COLUMN }, getRandomChar).join('\n')
}

const Loading = () => {
  const columns = useMemo(
    () =>
      Array.from({ length: COLUMN_COUNT }, (_, i) => ({
        id: i,
        chars: buildColumnChars(),
        delay: Math.random() * 2,
        duration: 2.5 + Math.random() * 1.5,
      })),
    []
  )

  return (
    <div
      className="loading-screen"
      role="status"
      aria-label="Loading"
    >
      <div className="loading-rain">
        {columns.map((col) => (
          <div
            key={col.id}
            className="loading-rain-column"
            style={{
              '--rain-delay': `-${col.delay}s`,
              '--rain-duration': `${col.duration}s`,
            }}
          >
            <div className="loading-rain-inner">
              <span className="loading-rain-text">{col.chars}</span>
              <span className="loading-rain-text">{col.chars}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="loading-overlay">
        <h2 className="loading-title">LOADING</h2>
        <p className="loading-subtitle">SYSTEM INITIALISING</p>
      </div>

      <div className="loading-scanline" aria-hidden />
      <div className="loading-wave">
        <div className="loading-wave-bar" />
      </div>
    </div>
  )
}

export default Loading
