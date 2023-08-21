import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/user'
import Login from "./Login"
import Signup from "./Signup"
import EditUser from './EditUser'

function Home({currentTime}) {
    const { user, setUser } = useContext(UserContext)
    const [loginSignup, setLoginSignup] = useState(true)
    const [completedRides, setCompletedRides] = useState([])
    const [editUser, setEditUser] = useState(false)

    useEffect(() => {
        if (user !== null) {
            console.log('triggered')
            console.log(currentTime)
            console.log(user.rides)
            setCompletedRides(user.rides.filter(ride => ride.date < currentTime))
            console.log(completedRides)
        }
        else {
            console.log('no user yet')
        }
    }, [user])

    const handleLoginSignup = (e) => {
        setLoginSignup(!loginSignup)
    }

    const handleLogOut = (e) => {
        setUser(null)
    }
    
    const handleEdit = (e) => {
        console.log('edit name and maybe password')
        setEditUser(true)
    }

    const statCreator = () => {
        let totalMiles = 0
        completedRides.forEach(rideData => {
            totalMiles += rideData.route.distance
        })
        return (
            <div>
                <h5>Total Rides: {completedRides.length}</h5>
                <h5>Total Distance: {totalMiles.toFixed(2)} Miles</h5>
                <h5>Average Ride Distance: {(totalMiles / completedRides.length).toFixed(2)} Miles</h5>
            </div>
        )
    }

    return (
        <div>
            <h2>Home Page</h2>
            {user ? 
                <div>
                    <h3>Welcome Back, {user.name} </h3>
                    <h4>User ID: {user.id}</h4>
                    <h4>User Name: {user.user_name}</h4>
                    {statCreator()}
                    {editUser ?
                        <div>
                            <EditUser />
                        </div>
                        :
                        <div>
                            <button onClick={handleEdit}>Edit User</button>
                        </div>
                    }
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

export default Home