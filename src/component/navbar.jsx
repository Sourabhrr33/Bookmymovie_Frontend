import React from 'react'
import "./navbar.css"

export default function navbar() {
  return (
    <div>
      <nav className="navbar">
      <ul className="nav-links">
        <li><a href="/" className="nav-link">Home</a></li>
        <li><a href="/about" className="nav-link">About</a></li>
        <li><a href="/services" className="nav-link">Services</a></li>
        <li><a href="/contact" className="nav-link">Contact</a></li>
      </ul>
    </nav>
 
    </div>
  )
}
