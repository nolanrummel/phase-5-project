import React from "react"
import { NavLink } from "react-router-dom"

function Navbar() {
    return (
    <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/rides">Rides</NavLink>
        <NavLink to="/routes">Routes</NavLink>
        <NavLink to="/places">Places</NavLink>
    </nav>
    )
}

export default Navbar