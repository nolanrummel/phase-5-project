import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../context/user'
import Rating from './Rating'
import "../styling/rides.css"

function Rides({currentTime}) {
    const { user } = useContext(UserContext)
    const [allRides, setAllRides] = useState([])
    const [upcomingRides, setUpcomingRides] = useState([])
    const [pastRides, setPastRides] = useState([])
    const [userUpRides, setUserUpRides] = useState([])
    const [publicPtRides, setPublicPtRides] = useState([])

    const [detailRide, setDetailRide] = useState('')
    const [rating, setRating] = useState('')

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
            console.error('Error Fetching Routes:', error)
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

    const handleDetail = (rideId) => {
        setDetailRide(rideId)
        setRating('')
    }

    const handleRatingChange = (e) => {
        e.preventDefault()
        const formObj = {
            'rating': rating
        }
        fetch(`http://127.0.0.1:5555/rides/${detailRide.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formObj)
        })
            .then(r => {
                if(r.ok) {
                    r.json()
                        .then(data => {
                            console.log(data)
                        })
                }
                else {
                    r.json()
                        .then(data => {
                            console.log(data)
                        })
                }
            })
    }

    // const handleRenderMore = (e) => {
    //     setSliceNum(sliceNum + 24)
    // }

    // const handleRenderLess = (e) => {
    //     if ((sliceNum - 24) >= 24) {
    //         setSliceNum(sliceNum - 24)
    //     } else {
    //         setSliceNum(24)
    //     }
    // }

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
                <h5>Rating: <Rating rating={ride.rating} /></h5>
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
                <h5>Your Rating: <Rating rating={ride.rating} editing={true}/></h5>
                {detailRide === ride.id ?
                    <div>
                        <div>
                            <form onSubmit={handleRatingChange}>
                                <label>
                                    <input 
                                        className='input-field'
                                        type='number'
                                        id='rating'
                                        value={rating}
                                        onChange={(e) => setRating(e.target.value)}
                                    />
                                </label>
                                <button type='submit'>Confirm Changes</button>
                            </form>
                        </div>
                    </div>
                    :
                    <button onClick={() => handleDetail(ride.id)}>More Info</button>
                }
            </div>
        )
    })

    const handleUpcoming = (e) => {
        setPastView(false)
        setRenderTimeline('upcoming')
        setSliceTotal(upcomingRides.length)
        setDetailRide('')
    }

    const handlePast = (e) => {
        setPastView(true)
        setRenderTimeline('past')
        setSliceTotal(pastRides.length)
        setDetailRide('')
    }

    const handleUser = (e) => {
        setUserView(false)
        setRenderOwnership('user')
        setSliceTotal(userUpRides.length)
        setDetailRide('')
    }

    const handlePublic = (e) => {
        setUserView(true)
        setRenderOwnership('public')
        setSliceTotal(publicPtRides.length)
        setDetailRide('')
    }

    return (
        <div className='container'>
            {user ? 
                ''
                :
                <div className='login-button-container'>
                    <Link to='/home'>
                        <button className='login-button'>Login to View Your Rides</button>
                    </Link>
                </div>
            }
            <div className='views-header'>
                {user ? 
                    <div>
                        {userView ?
                            <div className='user-changer'>
                                <h4 className='user-button' onClick={handleUser}>My Rides</h4>
                                <h4 className='public-button-active'>Public Rides</h4>
                            </div>
                            :
                            <div className='user-changer'>
                                <h4 className='user-button-active'>My Rides</h4>
                                <h4 className='public-button' onClick={handlePublic}>Public Rides</h4>
                            </div>
                        }
                    </div>
                    :
                    ''
                }
                {pastView ?
                    <div className='view-changer'>
                        <h4 className='upcoming-button' onClick={handleUpcoming}>Upcoming Rides</h4>
                        <h4 className='past-button-active'>Past Rides</h4>
                    </div>
                    :
                    <div className='view-changer'>
                        <h4 className='upcoming-button-active'>Upcoming Rides</h4>
                        <a className='past-button' onClick={handlePast}>Past Rides</a>
                    </div>
                }
            </div>
            <div>
                {renderTimeline === 'upcoming' && renderOwnership === 'public' ? 
                    <div>
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
            {/* <div>
                {sliceNum > 24 ?
                    <button onClick={handleRenderLess}>Less Rides ^</button>
                    :
                    ''
                }
                {sliceNum < sliceTotal ?
                    <div>
                        <h5>{sliceNum} | Slice Total: {sliceTotal}</h5>
                        <button onClick={handleRenderMore}>More Rides V</button>
                    </div>
                    :
                    <h5>Slice Total: {sliceTotal}</h5>
                }
            </div> */}
        </div>  
    )
}

export default Rides