import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
    return (
        <div>
            <h2>Sorry this is Broken, I'm Just a Student!</h2>
            <Link to='/home'>
                <button>Go Home</button>
            </Link>
        </div>  
    )
}

export default NotFound