import React, { useContext, useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../context/user'
import "../styling/rides.css"
import RenderRides from './RenderRides'
import RideCreator from './RideCreator'

function Rides({currentTime}) {
    const { user } = useContext(UserContext)
    const [allRides, setAllRides] = useState([])
    const [upcomingRides, setUpcomingRides] = useState([])
    const [pastRides, setPastRides] = useState([])
    const [userUpRides, setUserUpRides] = useState([])
    const [userPtRides, setUserPtRides] = useState([])

    const [detailRide, setDetailRide] = useState('')
    const [rideCreatorActive, setRideCreatorActive] = useState(false)
    // const [rideChanges, setRideChanges] = useState('')

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
    }, []) //add rideChanges here???

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
            setUserPtRides(pastRides.filter((ride => ride.user.id === user.id)))
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

    const handleRideCreator = (e) => {
        setRideCreatorActive(true)
        console.log('create new ride')
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

    const handleUpcoming = (e) => {
        setPastView(false)
        setRenderTimeline('upcoming')
        setSliceNum(24)
        setSliceTotal(upcomingRides.length)
        setDetailRide('')
    }

    const handlePast = (e) => {
        setPastView(true)
        setRenderTimeline('past')
        setSliceNum(24)
        setSliceTotal(pastRides.length)
        setDetailRide('')
    }

    const handleUser = (e) => {
        setUserView(false)
        setRenderOwnership('user')
        setSliceNum(24)
        setSliceTotal(userUpRides.length)
        setDetailRide('')
    }

    const handlePublic = (e) => {
        setUserView(true)
        setRenderOwnership('public')
        setSliceNum(24)
        setSliceTotal(userPtRides.length)
        setDetailRide('')
    }

    return (
        <div className='container'>
            {user ? 
                (rideCreatorActive ?
                    <div className='creator-container'>
                        <RideCreator setRideCreatorActive={setRideCreatorActive}/>
                    </div>
                    :
                    <div className='login-button-container'>
                        <button className='login-button' onClick={handleRideCreator}>Create a New Ride</button>
                    </div>
                )
                :
                <div className='login-button-container'>
                    <Link to='/home'>
                        <button className='login-button'>Login to Create and View Your Rides</button>
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
                    <div>
                        <RenderRides rides={upcomingRides} sliceNum={sliceNum} setSliceNum={setSliceNum} renderTimeline={renderTimeline} renderOwnership={renderOwnership}/>
                    </div>
                    : renderTimeline === 'past' && renderOwnership === 'public' ?
                    <div>
                        <RenderRides rides={pastRides} sliceNum={sliceNum} setSliceNum={setSliceNum} renderTimeline={renderTimeline} renderOwnership={renderOwnership}/>
                    </div>
                    :  renderTimeline === 'upcoming' && renderOwnership === 'user' ?
                    <div> 
                        <RenderRides rides={userUpRides} sliceNum={sliceNum} setSliceNum={setSliceNum} renderTimeline={renderTimeline} renderOwnership={renderOwnership}/>
                    </div>
                    : renderTimeline === 'past' && renderOwnership === 'user' ?
                    <div>
                        <RenderRides rides={userPtRides} sliceNum={sliceNum} setSliceNum={setSliceNum} renderTimeline={renderTimeline} renderOwnership={renderOwnership}/>
                        {/* <RenderRides rides={userPtRides} sliceNum={sliceNum} setSliceNum={setSliceNum} renderTimeline={renderTimeline} renderOwnership={renderOwnership} setRideChanges={setRideChanges}/> */}
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