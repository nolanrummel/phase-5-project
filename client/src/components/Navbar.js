import React from "react"
import { NavLink } from "react-router-dom"
import "../styling/navbar.css"

function Navbar() {
    return (
    <nav>
        <NavLink className='nav-link' to="/home">Home</NavLink>
        <NavLink className='nav-link' to="/rides">Rides</NavLink>
        <NavLink className='nav-link' to="/routes">Routes</NavLink>
        {/* <NavLink className='nav-link' to="/places">Places</NavLink> */}
    </nav>
    )
}

export default Navbar