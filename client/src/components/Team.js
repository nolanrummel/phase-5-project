import React, { useContext } from 'react'
import { UserContext } from '../context/user';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';

function Team() {
    const { user } = useContext(UserContext)
    return (
        <div>
            {user ? 
                <div>
                    <h2>Team Page</h2>
                </div>
                :
                <Redirect to='/home' />
            }
        </div>  
    )
}

export default Team;