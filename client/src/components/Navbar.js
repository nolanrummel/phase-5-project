import React from "react";
import { NavLink } from "react-router-dom"

function Navbar() {
    return (
    <nav>
        <NavLink to="/home">Home</NavLink>
        <NavLink to="/team">Teams</NavLink>
        <NavLink to="/routes">Routes</NavLink>
        <NavLink to="/places">Places</NavLink>
    </nav>
    )
}

export default Navbar;