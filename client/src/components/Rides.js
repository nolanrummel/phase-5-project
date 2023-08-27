import React, { useContext, useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../context/user'
import Rating from './Rating'
import "../styling/rides.css"
import RenderRides from './RenderRides'

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

    const divRef = useRef(null)
    const [mapHeight, setMapHeight] = useState('')

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

    const handleResize = () => {
        window.requestAnimationFrame(() => {
            const div = divRef.current;
            if (div) {
                const rect = div.getBoundingClientRect();
                setMapHeight(rect.width * 0.75);
            }
        });
    };
    handleResize()

    const handleJoin = (e) => {
        console.log('post request to join ride')
    }

    const handleDetail = (rideId) => {
        setDetailRide(rideId)
    }

    // const handleDetail = (rideId) => {
    //     setDetailRide(rideId)
    //     setRating('')
    // }

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
            <div className='ride-card' key={ride.id}>
                <h2 className='ride-card-title' style={{width: (mapHeight * 1.33) + 'px'}}>{ride.name}</h2>
                <div ref={divRef} className='map-preview' style={{height: mapHeight + 'px'}}></div>
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

    const pastPublic = true
    console.log(detailRide)

    const renderPastPublic = pastRides.slice(0, sliceNum).map((ride) => {
        const month = ride.date.slice(5, 7)
        const day = ride.date.slice(8, 10)
        const hour = ride.date.slice(11, 13)
        const minutes = ride.date.slice(14, 16)
        const milesInteger = Math.floor(ride.route.distance)
        const milesDecimal = Math.round((ride.route.distance % 1) * 100)
        
        //console.log(month + '/' + day + ' ' + hour + ':' + minutes + `${hour >= 12 ? 'PM' : 'AM'}`)
        return (
            <div>
                {detailRide === ride.id ?
                    <div></div>
                    :
                    <div className='ride-card' onClick={() => handleDetail(ride.id)} key={ride.id}>
                        <h2 className='ride-card-title' style={{width: (mapHeight * 1.33) + 'px'}}>{ride.name}</h2>
                        <div className='map-date-container'>
                            <div ref={divRef} className='map-preview' style={{height: mapHeight + 'px'}}></div>
                            <div className='date'>
                                <h3 className='date-number'>{month}</h3>
                                <div className='divider'></div>
                                <h3 className='date-number'>{day}</h3>
                            </div>
                        </div>
                        <div className='miles-rating-lockup'>
                            <div className='miles-lockup'>
                                <h3 className='miles-integer'>{milesInteger}</h3>
                                <h5>.{milesDecimal} Miles</h5>
                            </div>
                            <h5><Rating rating={ride.rating} pastPublic={pastPublic}/></h5>
                        </div>
                        {/* <h3>{ride.date}</h3> */}
                        {/* <h5>Route: {ride.route.name} | {ride.route.distance} Miles</h5> */}
                        {/* <h3>{ride.user.user_name}</h3> */}
                        {/* description? */}
                        <div className='color-bar' style={{backgroundColor: '#2a344f'}}></div>
                    </div>
                }
            </div>
        )
    })

    const renderUpcomingUser = userUpRides.slice(0, sliceNum).map((ride) => {
        return (
            <div className='ride-card' key={ride.id}>
                <h2 className='ride-card-title' style={{width: (mapHeight * 1.33) + 'px'}}>{ride.name}</h2>
                <div ref={divRef} className='map-preview' style={{height: mapHeight + 'px'}}></div>
                <h3>{ride.date}</h3>
                <h5>Route: {ride.route.name} | {ride.route.distance} Miles</h5>
                <h5>{ride.user.name}</h5>
            </div>
        )
    })

    const renderPastUser = publicPtRides.slice(0, sliceNum).map((ride) => {
        return (
            <div className='ride-card' key={ride.id}>
                <h2 className='ride-card-title' style={{width: (mapHeight * 1.33) + 'px'}}>{ride.name}</h2>
                <div ref={divRef} className='map-preview' style={{height: mapHeight + 'px'}}></div>
                <h3>{ride.date}</h3>
                <h5>Route: {ride.route.name} | {ride.route.distance} Miles</h5>
                <h5>Your Rating: <Rating rating={ride.rating} rideId={ride.id}/></h5>
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
            <div className='card-container'>
                {renderTimeline === 'upcoming' && renderOwnership === 'public' ? 
                    <div className='card-grid'>
                        {renderUpcomingPublic}
                    </div>
                    : renderTimeline === 'past' && renderOwnership === 'public' ?
                    <div>
                        {/* {renderPastPublic} */}
                        <RenderRides rides={pastRides} sliceNum={sliceNum}/>
                    </div>
                    :  renderTimeline === 'upcoming' && renderOwnership === 'user' ?
                    <div className='card-grid'> 
                        {renderUpcomingUser}
                    </div>
                    : renderTimeline === 'past' && renderOwnership === 'user' ?
                    <div className='card-grid'>
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