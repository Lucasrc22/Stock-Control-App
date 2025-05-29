import Header from './components/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f0f8ff] text-[#0c4a6e]">
        <Header />
        <main className="p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
