import React, { useContext, useState } from 'react'
import { UserContext } from '../context/user';
import Login from "./Login";
import Signup from "./Signup";

function Home() {
    const { user, setUser } = useContext(UserContext)
    const [loginSignup, setLoginSignup] = useState(true)

    const handleLoginSignup = (e) => {
        setLoginSignup(!loginSignup)
    }

    const handleLogOut = (e) => {
        setUser(null)
    }

    return (
        <div>
            <h2>Home Page</h2>
            {user ? 
                <div>
                    <h3>Welcome Back, {user.name} </h3>
                    <h4>User ID: {user.id}</h4>
                    <h4>User Name: {user.user_name}</h4>
                    <button onClick={handleLogOut}>Sign Out</button>
                </div>
                : 
                <div>
                    {loginSignup ?
                        <div>
                            <h4>Please Login</h4>
                            <Login setUser={setUser} />
                            <p onClick={handleLoginSignup}>Or Click Me to Sign Up!</p>
                        </div>
                        :
                        <div>
                            <h4>Please Sign Up</h4>
                            <Signup setUser={setUser} />
                            <p onClick={handleLoginSignup}>Or Click Me to Login!</p>
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default Home;