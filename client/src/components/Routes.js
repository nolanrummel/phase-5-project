import React, { useContext } from 'react'
import { UserContext } from '../context/user';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';

function Routes() {
    const { user } = useContext(UserContext)
    return (
        <div>
            {user ? 
                <div>
                    <h2>Routes Page</h2>
                </div>
                :
                <Redirect to='/home' />
            }
        </div>  
    )
}

export default Routes;