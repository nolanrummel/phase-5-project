import React, { useContext, useState, useEffect, useRef } from 'react'
import { UserContext } from '../context/user'
import { ReactComponent as BikeIcon } from '../icons/bike-icon.svg'
import Rating from './Rating'
import "../styling/ride-creator.css"

function RideCreator({setRideCreatorActive, currentTime}) {
    const { user } = useContext(UserContext)

    const [name, setName] = useState('')
    const [rideDate, setRideDate] = useState('')
    const [rideTime, setRideTime] = useState('')
    const [routeName, setRouteName] = useState('')
    const [startPoint, setStartPoint] = useState('')
    const [endPoint, setEndPoint] = useState('')
    const [extraPoints, setExtraPoints] = useState([])
    const [extraPointsCount, setExtraPointsCount] = useState(0)
    const [customizeRoute, setCustomizeRoute] = useState(true)
    const [routes, setRoutes] = useState([])
    const [milesInteger, setMilesInteger] = useState(0)
    const [milesDecimal, setMilesDecimal] = useState(0)
    const [detAverageRating, setDetAverageRating] = useState(0)

    const [firstSliceNum, setFirstSliceNum] = useState(0)
    const [secondSliceNum, setSecondSliceNum] = useState(9)
    const [detailRoute, setDetailRoute] = useState('')
    const [gridHeight, setGridHeight] = useState('')

    const divRef = useRef(null)

    const formattedDate = `${rideDate} ${rideTime}:00.000000`
    // console.log(formattedDate)

    const handleResize = () => {
        window.requestAnimationFrame(() => {
            const div = divRef.current
            if (div) {
                const rect = div.getBoundingClientRect()
                setGridHeight(rect.height)
            }
        })
    }

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        };
    }, [customizeRoute])

    const handleDetail = (routeId, averageRating) => {
        if (detailRoute === ''){
            setDetailRoute(routeId)
            setDetAverageRating(averageRating)
            // handleDetailStats(routeId)
        } if (detailRoute === routeId) {
            setDetailRoute('')
        } else {
            setDetailRoute(routeId)
            setDetAverageRating(averageRating)
            // handleDetailStats(routeId)
        }
    }

    useEffect(() => {
        fetch('/routes')
          .then(response => response.json())
          .then(data => {
            setRoutes(data)
          })
          .catch(error => {
            console.error('Error Fetching Routes:', error)
          })
    }, [])

    useEffect(() => {
        const updateStatistics = async () => {
            if (detailRoute !== '') {
                const integer = Math.floor(routes[detailRoute].distance)
                const decimal = Math.round((routes[detailRoute].distance % 1) * 100)
                setMilesInteger(integer)
                setMilesDecimal(decimal)
            }
        }
        updateStatistics()
    }, [detailRoute])
    
    const renderRoutes = routes.slice(firstSliceNum, secondSliceNum).map((route) => {
        const rides = route.rides
        const userCount = {}
        const completedRides = rides.filter(item => item.date < currentTime)
        let totalRating = 0
    
        completedRides.forEach(rideData => {
            const userId = rideData.user.id
            totalRating += rideData.rating
            if (userId in userCount) {
                userCount[userId]++
            } else {
                userCount[userId] = 1
            }
        })

        const averageRating = (totalRating/completedRides.length).toFixed(2)

        return (
            <div key={route.id} className='route-card' onClick={() => handleDetail((route.id - 1), averageRating)}>
                <h3 className='small-route-title'>{route.name}</h3>
                <img className='small-map-image' src='/images/map-example.png' alt='map'/>
                <h5 className='small-rating'>
                    <Rating rating={averageRating} altColor={true}/>
                </h5>
                <h5 className='small-miles'>{route.distance} Miles</h5>

                {/* <div className='small-directions-lockup'>
                    <div className='small-directions-container'>
                        <h5 className='small-direction'>{noNumberOrg}</h5>
                    </div>
                    <div className='small-directions-divider-container'>
                        <div className='small-directions-divider'></div>
                    </div>
                    <div className='small-directions-container'>
                        <h5 className='small-direction'>{noNumberDest}</h5>
                    </div>
                </div> */}
            </div>
        )
    })

    const handleSlice = (side) => {
        if (side == 'right') {
            if (secondSliceNum <= routes.length) {
                setSecondSliceNum(secondSliceNum + 9)
                setFirstSliceNum(firstSliceNum + 9)
                setDetailRoute('')
            }
        } if (side == 'left') {
            if (firstSliceNum >= 9) {
                setFirstSliceNum(firstSliceNum - 9)
                setSecondSliceNum(secondSliceNum - 9)
                setDetailRoute('')
            }
        }
    }
    
    const handleRideCreatorActive = (e) => {
        setRideCreatorActive(false)
    }

    const addRoutes = (e) => {
        setExtraPointsCount(extraPointsCount + 1)
    }

    const removeRoutes = (indexToRemove) => {
        setExtraPointsCount(extraPointsCount - 1)
        setExtraPoints((prevPoints) => {
          const updatedPoints = [...prevPoints]
          updatedPoints.splice(indexToRemove, 1)
          return updatedPoints;
        })
    }
    
    const handleNewPoints = (index, value) => {
        setExtraPoints((prevPoints) => {
            const updatedPoints = [...prevPoints]
            updatedPoints[index] = value
            return updatedPoints
        })
    }

    const additionalEndPoints = Array.from({ length: extraPointsCount }, (_, index) => (
        <form className='create-form' key={index}>
          <h4 className='create-header'>Stop {index + 2}</h4>
          <div className='create-lockup'>
            <div className='add-stops-button' onClick={() => removeRoutes(index)}>
              <h3 className='plus-symbol'>-</h3>
            </div>
            <input
              className='create-input-field'
              id='waypoint-'index
              type='text'
              value={extraPoints[index] || ''}
              onChange={(e) => handleNewPoints(index, e.target.value)}
            />
          </div>
        </form>
    ))

    const handleRouteCreate = (e) => {
        e.preventDefault()
        const formObj = {
            'name': routeName,
            'origin': startPoint,
            'destination': endPoint,
            'waypoints': formatDirections,
            // 'distance': rideDistance
        }

        fetch('/routes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formObj)
        })
            .then(r => {
                if (r.ok) {
                    console.log(r.ok)
                    r.json()
                        .then(data => {
                            console.log(data)
                            window.confirm('Route Created')
                        })
                }
                else {
                    console.log('no good')
                    r.text()
                        .then(data => {
                            console.log(data)
                            window.confirm('Route Not Created, Try Again')
                        })
                }
            })
    }

    let formatDirections = []
    
    useEffect(() => {
        extraPoints.map((waypoint) => {
            const waypoints = {
                location: waypoint,
                stopover: true,
            }
            formatDirections.push(waypoints)
        })
    },[extraPoints, handleRouteCreate])

    return (
        <div className='ride-creator-container'>
            <div className='create-container'>
                <h2 className='create-title'>Create a New Ride</h2>
                <BikeIcon className='create-bike-icon'/>
            </div>
            <div>
                <form className='create-form'>
                    <h4 className='create-header'>Ride Name</h4>
                    <div className='create-lockup'>
                        <input
                            className='create-input-field'
                            // placeholder='Ride Name...'
                            type='text'
                            id='name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </form>
                <div className='date-time-lockup'>
                    <form className='create-form'>
                        <h4 className='create-header'>Ride Date</h4>
                        <div className='create-lockup'>
                            <input
                                className='create-input-field-date'
                                // placeholder='Ride Date...'
                                type='date'
                                min='2023-08-28'//generate this with current time or new Date() instead of placeholder
                                id='name'
                                value={rideDate}
                                onChange={(e) => setRideDate(e.target.value)}
                            />
                        </div>
                    </form>
                    <form className='create-form'>
                        <h4 className='create-header'>Ride Time</h4>
                        <div className='create-lockup'>
                            <input
                                className='create-input-field-date'
                                // placeholder='Ride Date...'
                                type='time'
                                id='name'
                                value={rideTime}
                                onChange={(e) => setRideTime(e.target.value)}
                            />
                        </div>
                    </form>
                </div>
                {customizeRoute ?
                    <div>
                        <form className='create-form'>
                            <h4 className='create-header'>Route Name</h4>
                            <div className='create-lockup'>
                                <input
                                    className='create-input-field'
                                    // placeholder='Ride Start...'
                                    type='text'
                                    id='name'
                                    value={routeName}
                                    onChange={(e) => setRouteName(e.target.value)}
                                />
                            </div>
                        </form>
                        <form className='create-form'>
                            <h4 className='create-header'>Starting Address</h4>
                            <div className='create-lockup'>
                                <input
                                    className='create-input-field'
                                    // placeholder='Ride Start...'
                                    type='text'
                                    id='origin'
                                    value={startPoint}
                                    onChange={(e) => setStartPoint(e.target.value)}
                                />
                            </div>
                        </form>
                        {additionalEndPoints}
                        <form className='create-form'>
                            <h4 className='create-header'>Ending Address</h4>
                            <div className='create-lockup'>
                                <div className='add-stops-button' onClick={addRoutes}>
                                    <h3 className='plus-symbol'>+</h3>
                                </div>
                                <input
                                    className='create-input-field'
                                    // placeholder='Ride End...'
                                    type='text'
                                    id='destination'
                                    value={endPoint}
                                    onChange={(e) => setEndPoint(e.target.value)}
                                />
                            </div>
                        </form>
                        <div>
                            <p className='existing-ride' onClick={() => setCustomizeRoute(false)}>Choose From an <span>Existing Route {'>'}</span></p>
                        </div>
                    </div>
                    :
                    <div className='rides-routes-spacing'>
                        <div className='rides-routes-container'>
                            {detailRoute ?
                                <div className='create-detail-container' style={{height: gridHeight}} onClick={() => handleDetail('')}>
                                    <h2 style={{color: '#2a344f'}}>{routes[detailRoute].name}</h2>
                                    <h4>Created By: [USERNAME]</h4>
                                    <img className='small-map-image' src='/images/map-example.png' alt='map'/>
                                    <Rating rating={detAverageRating} altColor={true}/>
                                    <div className='edit-miles-lockup'>
                                        <h3 className='edit-miles-integer'>{milesInteger}<span>.{milesDecimal} Miles</span></h3>
                                    </div>
                                    
                                    <div className='edit-miles-rating-lockup'>
                                        <div className='edit-route-lockup'>
                                            <div className='edit-route'>
                                                <div className='route-divider'></div>
                                                {/* <h3 className='edit-route-name'>From {noNumberOrg} to {noNumberDest}</h3> */}
                                                {/* <h3 className='edit-route-name'>{ride.route.name}</h3> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className='routes-grid' ref={divRef} style={{height: gridHeight}}>                                    
                                    {renderRoutes}
                                </div>
                            }
                            <div className='arrow-container'>
                                <h1 className={firstSliceNum <= 0 ? 'left-arrow-inactive' : 'left-arrow'} onClick={() => handleSlice('left')}>〈</h1>
                                <h5 className='page-number'>{secondSliceNum / 9}/{Math.ceil(routes.length / 9)}</h5>
                                <h1 className={secondSliceNum >= routes.length ? 'right-arrow-inactive' : 'right-arrow'} onClick={() => handleSlice('right')}>〈</h1>
                            </div>
                        </div>
                        <div>
                            <p className='existing-ride' onClick={() => setCustomizeRoute(true)}>Create a <span>New Route {'>'}</span></p>
                        </div>
                    </div>
                }
            </div>
            <div className='create-button-container'>
                <div className='create-new-container'>
                    <button className='create-new-button' onClick={handleRouteCreate}>Create Ride</button>
                </div>
                <div className='cancel-container'>
                    <button className='cancel-button' onClick={handleRideCreatorActive}>Cancel</button>
                </div>
            </div>
        </div>  
    )
}

export default RideCreator