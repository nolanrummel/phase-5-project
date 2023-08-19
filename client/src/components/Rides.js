import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../context/user'

function Rides({currentTime}) {
    const { user } = useContext(UserContext)
    const [allRides, setAllRides] = useState([])
    const [upcomingRides, setUpcomingRides] = useState([])
    const [pastRides, setPastRides] = useState([])
    const [userUpRides, setUserUpRides] = useState([])
    const [publicPtRides, setPublicPtRides] = useState([])

    const [renderTimeline, setRenderTimeline] = useState('upcoming')
    const [renderOwnership, setRenderOwnership] = useState('public')
    const [pastView, setPastView] = useState(false)
    const [userView, setUserView] = useState(true)

    const [sliceNum, setSliceNum] = useState(24)
    const [sliceTotal, setSliceTotal] = useState(24)

    useEffect(() => {
        setRenderOwnership('public')
    },[user])

    useEffect(() => {
        fetch('http://127.0.0.1:5555/rides')
          .then(response => response.json())
          .then(data => {
            setAllRides(data.sort((a, b) => b.date.localeCompare(a.date)))
          })
          .catch(error => {
            console.error('Error fetching routes:', error)
          })
    }, [])

    useEffect(() => {
        setPastRides(allRides.filter(ride => ride.date < currentTime))
        const newRides = allRides.filter(ride => ride.date > currentTime)
        const sortedRides = newRides.sort((a, b) => a.date.localeCompare(b.date))
        setSliceTotal(sortedRides.length)
        setUpcomingRides(sortedRides)
    }, [allRides])

    useEffect(() => {
        if (user !== null) {
            setUserUpRides(upcomingRides.filter((ride => ride.user.id === user.id)))
            setPublicPtRides(pastRides.filter((ride => ride.user.id === user.id)))
        }
    }, [renderOwnership])

    const handleJoin = (e) => {
        console.log('post request to join ride')
    }

    console.log(sliceTotal)

    const handleRenderMore = (e) => {
        setSliceNum(sliceNum + 24)
    }

    const handleRenderLess = (e) => {
        if ((sliceNum - 24) >= 24) {
            setSliceNum(sliceNum - 24)
        } else {
            setSliceNum(24)
        }
    }

    const renderUpcomingPublic = upcomingRides.slice(0, sliceNum).map((ride) => {
        return (
            <div key={ride.id}>
                <h3>{ride.name}</h3>
                <h3>{ride.date}</h3>
                <h5>Route: {ride.route.name} | {ride.route.distance} Miles</h5>
                {user ? 
                    <button onClick={handleJoin}>Join this Ride</button>
                    :
                    <Link to='/home'>
                        <button>Sign in to Join this Ride</button>
                    </Link>
                }
            </div>
        )
    })

    const renderPastPublic = pastRides.slice(0, sliceNum).map((ride) => {
        return (
            <div key={ride.id}>
                <h3>{ride.name}</h3>
                <h3>{ride.date}</h3>
                <h5>Route: {ride.route.name} | {ride.route.distance} Miles</h5>
                <h5>Rating: {ride.rating}</h5>
                <h3>{ride.user.user_name}</h3>
            </div>
        )
    })

    const renderUpcomingUser = userUpRides.slice(0, sliceNum).map((ride) => {
        return (
            <div key={ride.id}>
                <h3>{ride.name}</h3>
                <h3>{ride.date}</h3>
                <h5>Route: {ride.route.name} | {ride.route.distance} Miles</h5>
                <h5>{ride.user.name}</h5>
            </div>
        )
    })

    const renderPastUser = publicPtRides.slice(0, sliceNum).map((ride) => {
        return (
            <div key={ride.id}>
                <h3>{ride.name}</h3>
                <h3>{ride.date}</h3>
                <h5>Route: {ride.route.name} | {ride.route.distance} Miles</h5>
                <h5>Your Rating: {ride.rating}</h5>
                <h3>{ride.user.name}</h3>
            </div>
        )
    })

    const handleUpcoming = (e) => {
        setPastView(false)
        setRenderTimeline('upcoming')
        setSliceTotal(upcomingRides.length)
    }

    const handlePast = (e) => {
        setPastView(true)
        setRenderTimeline('past')
        setSliceTotal(pastRides.length)
    }

    const handleUser = (e) => {
        setUserView(false)
        setRenderOwnership('user')
        setSliceTotal(userUpRides.length)
    }

    const handlePublic = (e) => {
        setUserView(true)
        setRenderOwnership('public')
        setSliceTotal(publicPtRides.length)
    }

    return (
        <div>
            <h2>Rides Page</h2>
            <div>
                {user ? 
                    <div>
                        {userView ?
                            <button onClick={handleUser}>Show My Rides</button>
                            :
                            <button onClick={handlePublic}>Show All Rides</button>
                        }
                    </div>
                    :
                    <div>
                        <Link to='/home'>
                            <button>Login to View Your Rides</button>
                        </Link>
                    </div>
                }
                {pastView ?
                    <div>
                        <button onClick={handleUpcoming}>Click to View Upcoming Open Rides</button>
                    </div>
                    :
                    <div>
                        <button onClick={handlePast}>Click to View Past Rides</button>
                    </div>
                }
            </div>
            <div>
                {renderTimeline === 'upcoming' && renderOwnership === 'public' ? 
                    <div>
                        <h2>Upcoming Rides</h2>
                        {renderUpcomingPublic}
                    </div>
                    : renderTimeline === 'past' && renderOwnership === 'public' ?
                    <div>
                        <h2>Past Rides</h2>
                        {renderPastPublic}
                    </div>
                    :  renderTimeline === 'upcoming' && renderOwnership === 'user' ?
                    <div>
                        <h2>Your Upcoming Rides</h2>
                        {renderUpcomingUser}
                    </div>
                    : renderTimeline === 'past' && renderOwnership === 'user' ?
                    <div>
                        <h2>Your Past Rides</h2>
                        {renderPastUser}
                    </div>
                    :
                    <div></div>
                }
            </div>
            <div>
                {sliceNum > 24 ?
                    <button onClick={handleRenderLess}>Less Rides ^</button>
                    :
                    ''
                }
                {sliceNum < sliceTotal ?
                    <h5>{sliceNum}</h5>
                    :
                    <h5>{sliceTotal}</h5>
                } 
                <button onClick={handleRenderMore}>More Rides V</button>
            </div>
        </div>  
    )
}

export default Rides