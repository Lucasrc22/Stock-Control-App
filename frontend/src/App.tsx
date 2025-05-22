import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Estoque from './pages/Estoque'

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Início</Link> | <Link to="/estoque">Estoque</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/estoque" element={<Estoque />} />
      </Routes>
    </div>
  )
}

export default App
