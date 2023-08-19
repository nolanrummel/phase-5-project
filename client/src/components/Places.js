import React, { useContext } from 'react'
import { UserContext } from '../context/user'
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min'

function Places() {
    const { user } = useContext(UserContext)
    return (
        <div>
            {user ? 
                <div>
                    <h2>Places Page</h2>
                </div>
                :
                <Redirect to='/home' />
            }
        </div>  
    )
}

export default Places