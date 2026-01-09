import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Career from './pages/Career'
import Contact from './pages/Contact'
import Terminal from './terminal/Terminal'
import './App.css'

function App() {
  return (
    <Router>
      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/career" element={<Career />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Terminal />
    </Router>
  )
}

export default App
