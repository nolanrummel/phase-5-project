import React, { useState, useEffect, useRef, useContext } from 'react'
import { UserContext } from '../context/user'
import Rating from './Rating'

function RenderRides({rides, sliceNum, setSliceNum, renderTimeline, renderOwnership, setRideChanges}) {
    const { user } = useContext(UserContext)
    
    const [detailRide, setDetailRide] = useState('')
    const [mapHeight, setMapHeight] = useState('')
  
    const divRef = useRef(null)

    const handleDetail = (rideId) => {
        if (detailRide === ''){
            setDetailRide(rideId)
            setSliceNum(sliceNum + 1)
        } if (detailRide === rideId) {
            setDetailRide('')
            setSliceNum(sliceNum - 1)
        } else {
            setDetailRide(rideId)
        }
    }

    const handleResize = () => {
        window.requestAnimationFrame(() => {
            const div = divRef.current;
            if (div) {
                const rect = div.getBoundingClientRect();
                setMapHeight(rect.width * 0.75);
            }
        });
    };
    
    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const renderRides = rides.slice(0, sliceNum).map((ride) => {
        const month = ride.date.slice(5, 7)
        const day = ride.date.slice(8, 10)
        const hour = ride.date.slice(11, 13)
        const minutes = ride.date.slice(14, 16)
        const milesInteger = Math.floor(ride.route.distance)
        const milesDecimal = Math.round((ride.route.distance % 1) * 100)
        
        //console.log(month + '/' + day + ' ' + hour + ':' + minutes + `${hour >= 12 ? 'PM' : 'AM'}`)
        
        return (
            <div className={detailRide === ride.id ? 'detail-container' : ''} key={ride.id} onClick={() => handleDetail(ride.id)}>
                {/* <div className={detailRide === ride.id ? 'edit-ride-card' : 'ride-card'} key={ride.id} onClick={() => handleDetail(ride.id)}> */}
                <div className={detailRide === ride.id ? 'edit-ride-card' : 'ride-card'} key={ride.id}>
                    {detailRide === ride.id ?
                        <h1 className='edit-ride-card-title'>{ride.name}</h1>
                        :
                        <h2 className='ride-card-title'>{ride.name}</h2>
                    }
                    {detailRide === ride.id ? (
                        user !== null ? (
                            <h5 className='user-title' style={ride.user.id === user.id ? {color: '#708a7c'} : {color: '#9eada5'}}>
                                <span>A Ride From {ride.user.name}</span> / User: {ride.user.user_name}
                            </h5>
                            ) : (
                            <h5 className='user-title' style={{color: '#9eada5'}}>
                                <span>A Ride From {ride.user.name}</span> / User: {ride.user.user_name}
                            </h5>
                        )
                        ) : (
                        user !== null ? (
                            <h5 className='user-title' style={ride.user.id === user.id ? {color: '#708a7c'} : {color: '#9eada5'}}>
                                User: {ride.user.user_name}
                            </h5>
                            ) : (
                            <h5 className='user-title' style={{color: '#9eada5'}}>
                                User: {ride.user.user_name}
                            </h5>
                        )
                    )}
                    <div className='map-date-container'>
                        {detailRide === ride.id ?
                            <img className='map-image' src='/images/map-example.png' alt='map'/>
                            :
                            <img className='map-image' src='/images/map-example.png' alt='map'/>
                        }
                        {detailRide === ride.id ?
                            <div className='edit-lockup'>
                                <div className='edit-date-lockup'>
                                    <div className='edit-date'>
                                        <h3 className='date-number'>{month}</h3> 
                                        <div className='divider'></div>
                                        <h3 className='date-number'>{day}</h3>
                                    </div>
                                    <h3 className='time'>{hour > 12 ? hour - 12 : hour}:{minutes} <span>{hour >= 12 ? 'PM' : 'AM'}</span></h3>
                                </div>
                                <div className='edit-miles-lockup'>
                                    <h3 className='edit-miles-integer'>{milesInteger}<span>.{milesDecimal} Miles</span></h3>
                                </div>
                                <div className='edit-miles-rating-lockup'>
                                    <div className='edit-route-lockup'>
                                        <div className='edit-route'>
                                            <h3 className='edit-route-name' style={{color: '#9eada5'}}>Route</h3>
                                            <div className='route-divider'></div>
                                            <h3 className='edit-route-name'>From [START POINT ADDRESS] to [END POINT ADDRESS]</h3>
                                            {/* <h3 className='edit-route-name'>{ride.route.name}</h3> */}
                                        </div>
                                    </div>
                                </div>
                                {renderTimeline === 'past' ? (
                                    user !== null ? (
                                        ride.user.id === user.id ? (
                                            <Rating rating={ride.rating} rideId={ride} detailRide={detailRide}/>
                                        ) : (
                                            <Rating rating={ride.rating} rideId={ride} />
                                        )
                                    ) : (
                                        <h5>
                                            <Rating rating={ride.rating} rideId={ride} />
                                        </h5>
                                    )
                                ) : (
                                    user !== null ? (
                                        ride.user.id === user.id ? (
                                            <div>You're in!</div>
                                        ) : (
                                            <button>Sign Up For this Ride</button>
                                        )
                                    ) : (
                                        <button>Login to Sign Up</button>
                                    )
                                )}
                            </div>
                            :
                            <div className='date'>
                                <h3 className='date-number'>{month}</h3> 
                                <div className='divider'></div>
                                <h3 className='date-number'>{day}</h3>
                            </div>
                        }
                    </div>
                    {detailRide === ride.id ?
                        ''
                        :
                        <div className='miles-rating-lockup'>
                            <div className='miles-lockup'>
                                <h3 className='small-miles-integer'>{milesInteger}<span>.{milesDecimal} Miles</span></h3>
                            </div>
                            {renderTimeline === 'upcoming' ?
                                ''
                                :
                                <h5><Rating rating={ride.rating} rideId={ride}/></h5>
                            }
                        </div> 
                    }
                    <div className='color-bar-lockup'>
                        {renderOwnership === 'user' ?
                            <div className='color-bar-user' style={{backgroundColor: '#708a7c'}}></div>
                            :
                            <div className='color-bar-user' style={{backgroundColor: '#9eada5'}}></div>
                        }
                        {renderTimeline === 'past' ?
                            <div className='color-bar-timeline' style={{backgroundColor: '#2a344f'}}></div>
                            :
                            <div className='color-bar-timeline' style={{backgroundColor: '#56666f'}}></div>
                        }
                    </div>
                </div>
            </div>
        )
    })
    return <div className='card-grid'>{renderRides}</div>
}

export default RenderRides

{/* <h3>{ride.date}</h3> */}
{/* <h5>Route: {ride.route.name} | {ride.route.distance} Miles</h5> */}
{/* <h3>{ride.user.user_name}</h3> */}
{/* description? */}