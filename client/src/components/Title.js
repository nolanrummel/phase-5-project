import React, { useContext } from 'react'
import { UserContext } from '../context/user'
import "../styling/title.css"

function Title() {
    const { user, setUser } = useContext(UserContext)
    const handleLogOut = (e) => {
        setUser(null)
    }
    return (
        <div>
            <h1>RideLink</h1>
            {user ? 
                <div className='user-logged-in'>
                    {/* <h4>Welcome Back, {user.name}</h4>
                    <button onClick={handleLogOut}>Sign Out</button> */}
                </div>
                : ''
            }
        </div>
        
    )
}

export default Title