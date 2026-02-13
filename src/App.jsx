import { useState } from "react"
import Search from "./components/Search"

const App = () => {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <main>
      <div className="pattern"/>

      <div className="wrapper">
        <header>
          <img src="/hero.png" alt="hero banner" />
          <h1>dry your eyes & soul with <span className="text-gradient">endless entertainment</span></h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
      </div>
    </main>
  )
}

export default App
