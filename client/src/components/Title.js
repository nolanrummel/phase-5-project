import React, { useContext } from 'react'
import { UserContext } from '../context/user';

function Title() {
    const { user } = useContext(UserContext)
    return (
        <div>
            <h1>RideLink</h1>
            {user ? <h4>Welcome Back, {user.name}</h4> : <h4>Please Sign-in</h4>}
        </div>
        
    )
}

export default Title;