import { NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="nav-wrapper">
      <div className="navbar">
        <NavLink to="/" className="navbar-icon">
          <span className="icon-text">~/Ray_Bao</span>
        </NavLink>
        <div className="nav-list">
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
            <span className="nav-text">/ home</span>
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-text">/ projects</span>
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-text">/ contact</span>
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
