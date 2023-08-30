import React, { useContext, useState, useEffect, useRef } from 'react'
import { UserContext } from '../context/user'
import { ReactComponent as BikeIcon } from '../icons/bike-icon.svg'
import { Link } from 'react-router-dom'
import Rating from './Rating'
import "../styling/ride-creator.css"

function RideCreator({setRideCreatorActive, currentTime}) {
    const { user } = useContext(UserContext)

    const [users, setUsers] = useState([])
    const [createdBy, setCreatedBy] = useState(0)
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
    const [secondSliceNum, setSecondSliceNum] = useState(6)
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

    const directions = (detailRoute) => {
        const routeObj = routes.filter(item => item.id - 1 === detailRoute)

        const originFull = routeObj[0].origin
        const splitOrg = originFull.split(' | ')
        const noNumberOrg = splitOrg[0].replace(/^\d+\s*/, '')

        const destFull = routeObj[0].destination
        const splitDest = destFull.split(' | ')
        const noNumberDest = splitDest[0].replace(/^\d+\s*/, '')

        return (
            <h3 className='detail-route-address'>From {noNumberOrg} to {noNumberDest}</h3>
        )
    }

    const handleDetail = (routeId, averageRating) => {
        if (detailRoute === ''){
            setDetailRoute(routeId)
            setDetAverageRating(averageRating)
            const createUser = users.find(item => item.id === routeId)
            setCreatedBy(createUser)
        } else if (detailRoute === routeId) {
            setDetailRoute('')
            // const createUser = users.find(item => item.id === routeId)
        } else {
            setDetailRoute(routeId)
            setDetAverageRating(averageRating)
            const createUser = users.find(item => item.id === routeId)
            setCreatedBy(createUser)
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
        fetch('/users')
          .then(response => response.json())
          .then(data => {
            setUsers(data)
          })
          .catch(error => {
            console.error('Error Fetching Users:', error)
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
            // <div key={route.id} className='route-card' onClick={() => handleDetail((route.id), averageRating)}>
            <div key={route.id} className='route-card' onClick={() => handleDetail((route.id - 1), averageRating)}>
                <h3 className='small-route-title'>{route.name}</h3>
                <img className='small-map-image' src='/images/map-example.png' alt='map'/>
                <h5 className='small-rating'>
                    <Rating rating={averageRating} altColor={true}/>
                </h5>
                <h5 className='small-miles'>{route.distance} Miles</h5>
            </div>
        )
    })

    const handleSlice = (side) => {
        if (side == 'right') {
            if (secondSliceNum <= routes.length) {
                setSecondSliceNum(secondSliceNum + 6)
                setFirstSliceNum(firstSliceNum + 6)
                setDetailRoute('')
                // setCreatedBy(0)
            }
        } if (side == 'left') {
            if (firstSliceNum >= 6) {
                setFirstSliceNum(firstSliceNum - 6)
                setSecondSliceNum(secondSliceNum - 6)
                setDetailRoute('')
                // setCreatedBy(0)
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

    const min = 5
    const max = 50
    const rideDistance = Math.floor(Math.random() * (max - min + 1)) + min

    const handleSelection = (e) => {
        console.log(detailRoute + 1)//chosen route to build ride from
    }

    const handleRouteCreate = (e) => {
        e.preventDefault()
        //if all the form fields for route are filled out - send post to routes
        //if only ride form fields are filled out (route chosen from existing) - send post to rides

        const formObj = {
            'name': routeName,
            'origin': startPoint,
            'destination': endPoint,
            // 'waypoints': formatDirections,
            'distance': rideDistance,
            'created_by': user.id
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
                                min={currentTime.slice(0, 10)}
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
                            {detailRoute !== '' ?
                                <div className='create-detail-container' style={{height: gridHeight}} onClick={() => handleDetail('')}>
                                    <h2 style={{color: '#2a344f'}}>{routes[detailRoute].name}</h2>
                                    {directions(detailRoute)}
                                    {/* {createdBy !== undefined ?
                                        <h4>Created By: {createdBy.user_name}</h4>
                                        :
                                        <h4>broken link</h4>
                                    } */}
                                    <div className='detail-map-container'>
                                        <img className='detail-map-image' src='/images/map-example.png' alt='map'/>
                                    </div>
                                    <div className='miles-direction-lockup'>
                                        <div className='detail-miles'>
                                            <h3 className='detail-miles-integer'>{milesInteger}.{milesDecimal} Miles</h3>
                                        </div>
                                        <div className='detail-rating-container'>
                                            <Rating rating={detAverageRating} altColor={true}/>
                                        </div>
                                    </div>
                                    <div className='top-button-container'>
                                        {/* <button className='top-buttons'>More Info</button> */}
                                        <Link to='/routes' className='top-left-buttons' onClick={console.log()}>
                                            <button className='more-info'>More Info</button>
                                        </Link>
                                        <button className='top-right-buttons' onClick={() => setDetailRoute('')}>Cancel</button>
                                    </div>
                                    <button className='bottom-button' onClick={handleSelection}>Choose This Ride</button>
                                    
                                </div>
                                :
                                <div className='routes-grid' ref={divRef} style={{height: gridHeight}}>                                    
                                    {renderRoutes}
                                </div>
                            }
                            <div className='arrow-container'>
                                <h1 className={firstSliceNum <= 0 ? 'left-arrow-inactive' : 'left-arrow'} onClick={() => handleSlice('left')}>〈</h1>
                                <h5 className='page-number'>{secondSliceNum / 6}/{Math.ceil(routes.length / 6)}</h5>
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