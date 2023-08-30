import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/user'
import Login from "./Login"
import Signup from "./Signup"
import EditUser from './EditUser'
import "../styling/home.css"
import { ReactComponent as BikeIcon } from '../icons/bike-icon.svg'
import { ReactComponent as PlusIcon } from '../icons/plus-icon.svg'

function Home() {
    const { user, setUser } = useContext(UserContext)
    const [loginSignup, setLoginSignup] = useState(true)
    const [completedRides, setCompletedRides] = useState([])
    const [editUser, setEditUser] = useState(false)

    useEffect(() => {
        if (user !== null) {
            setCompletedRides(user.rides.filter(ride => ride.date < `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2,'0')}-${String(new Date().getDate()).padStart(2,'0')} ${String(new Date().getHours()).padStart(2,'0')}:${String(new Date().getMinutes()).padStart(2,'0')}:${String(new Date().getSeconds()).padStart(2,'0')}`))
        }
        else {
            // console.log('no user yet')
        }
    }, [user])

    const handleLoginSignup = (e) => {
        setLoginSignup(!loginSignup)
    }

    const handleLogOut = (e) => {   
        fetch("/logout", {
            method: "DELETE",
        })
        setUser(null)
    }
    
    const handleEdit = (e) => {
        setEditUser(true)
    }

    const statCreator = () => {
        let totalMiles = 0
        completedRides.forEach(rideData => {
            totalMiles += rideData.route.distance
        })
        const averageMiles = totalMiles / completedRides.length
        const totalInteger = Math.floor(totalMiles)
        const totalDecimal = Math.round((totalMiles % 1) * 100)
        const averageInteger = Math.floor(averageMiles)
        const averageDecimal = Math.round((averageMiles % 1) * 100)
        return (
            <div className='stats'>
                <div className='stat-box'>
                    <h3 className='stat-number'>{completedRides.length}</h3>
                    <h4 className='stat-title'>Total Rides</h4>
                </div>
                <div className='stat-box'>
                    <h3 className='stat-number'>{totalInteger}<span>.{totalDecimal}</span></h3>
                    <h4 className='stat-title'>Total Miles</h4>
                </div>
                <div className='stat-box'>
                    <h3 className='stat-number'>{averageInteger}<span>.{averageDecimal}</span></h3>
                    <h4 className='stat-title'>Avg/Miles</h4>
                </div>
            </div>
        )
    }

    return (
        <div className='home-container'>
            {user ? 
                <div className='user-page'>
                    <div className='top-half'>
                        <div className='image-container'>
                            {user.profile_pic === null ?
                                <div className='add-user-bg' onClick={handleEdit}>
                                    <PlusIcon className='picture-plus-symbol'/>
                                    {/* <p className='inner-text'>Change Your<br></br>Profile Pic</p> */}
                                </div>
                                :
                                <div className='user-image'>
                                    <img src={user.profile_pic} alt={user.name}></img>
                                </div>
                            }
                        </div>
                        <div className='user-info'>
                            <div className='user-details'>
                                <div>
                                    <h4 className='user-id-name'>User ID: {user.id} | User Name: {user.user_name}</h4>
                                    <h2 className='welcome'>Welcome Back, {user.name} </h2>
                                </div>
                                <div>
                                    {user.rides.length >= 1 ?
                                        statCreator()
                                        :
                                        ''
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='button-container'>
                        {editUser ?
                            <div className='edit-user'>
                                <EditUser setEditUser={setEditUser}/>
                            </div>
                            :
                            <div className='edit-user'>
                                <button className='edit-user-button' onClick={handleEdit}>Edit User</button>
                            </div>
                        }
                        <button className='sign-out' onClick={handleLogOut}>Sign Out</button>
                    </div>
                </div>
                : 
                <div className='signed-out-container'>
                    {loginSignup ?
                        <div className='group-container'>
                            <div className='header'>
                                <h2 className='title'>Log In</h2>
                                <BikeIcon className='bike-icon'/>
                            </div>
                            <Login setUser={setUser} />
                            <p className='switch' onClick={handleLoginSignup}>Don't Have an Account? <span>Signup</span></p>
                        </div>
                        :
                        <div className='group-container'>
                            <div className='header'>
                                <h2 className='title'>Sign Up</h2>
                                <BikeIcon className='bike-icon'/>
                            </div>
                            <Signup setUser={setUser} />
                            <p className='switch' onClick={handleLoginSignup}>Already Have an Account? <span>Login</span></p>
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default Home