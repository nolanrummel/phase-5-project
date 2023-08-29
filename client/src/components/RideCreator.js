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
    const [startPoint, setStartPoint] = useState('')
    const [endPoint, setEndPoint] = useState('')
    const [extraPoints, setExtraPoints] = useState([])
    const [extraPointsCount, setExtraPointsCount] = useState(0)
    const [customizeRoute, setCustomizeRoute] = useState(true)
    const [routes, setRoutes] = useState([])
    const [firstSliceNum, setFirstSliceNum] = useState(0)
    const [secondSliceNum, setSecondSliceNum] = useState(9)
    const [detailRoute, setDetailRoute] = useState('')
    const [gridHeight, setGridHeight] = useState('')

    const divRef = useRef(null)

    const formattedDate = `${rideDate} ${rideTime}:00.000000`
    // console.log(formattedDate)

    // console.log([startPoint, extraPoints, endPoint])
    // console.log(extraPoints)

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

    const handleDetail = (routeId) => {
        if (detailRoute === ''){
            setDetailRoute(routeId)
        } if (detailRoute === routeId) {
            setDetailRoute('')
        } else {
            setDetailRoute(routeId)
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
            <div key={route.id} className='route-card' onClick={() => handleDetail(route.id)}>
                <h3 className='small-route-title'>{route.name}</h3>
                <img className='small-map-image' src='/images/map-example.png' alt='map'/>
                <h5 className='small-rating'>
                    <Rating rating={averageRating} altColor={true}/>
                </h5>
                <h5 className='small-miles'>{route.distance} Miles</h5>

                {/* <div className='small-directions-lockup'>
                    <div className='small-directions-container'>
                        <h5 className='small-direction'>[START POINT ADDRESS]</h5>
                    </div>
                    <div className='small-directions-divider-container'>
                        <div className='small-directions-divider'></div>
                    </div>
                    <div className='small-directions-container'>
                        <h5 className='small-direction'>[END POINT ADDRESS]</h5>
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

    const removeRoutes = (index) => {
        setExtraPointsCount(extraPointsCount - 1);
        console.log(index);
    }
    
    const handleNewPoints = (index, value) => {
        setExtraPoints(value);
        console.log(index);
        console.log(extraPoints);
    }

    // const post = () => {
    //     formattedDate = user.rides.filter(ride => ride.date < `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2,'0')}-${String(new Date().getDate()).padStart(2,'0')} ${String(new Date().getHours()).padStart(2,'0')}:${String(new Date().getMinutes()).padStart(2,'0')}:${String(new Date().getSeconds()).padStart(2,'0')}`)
    //     new Date().toUTCString()
    // }

    const additionalEndPoints = Array.from({length: extraPointsCount}, (_, index) => (
        <form className='create-form' key={index}>
            <h4 className='create-header'>Stop {index + 2}</h4>
            <div className='create-lockup'>
                <div className='add-stops-button' onClick={() => removeRoutes(index)}>
                    <h3 className='plus-symbol'>-</h3>
                </div>
                <input
                    className='create-input-field'
                    type='text'
                    id={index}
                    value={extraPoints}
                    onChange={(e) => handleNewPoints(index, e.target.value)}
                />
            </div>
        </form>
    ))

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
                            <h4 className='create-header'>Starting Address</h4>
                            <div className='create-lockup'>
                                <input
                                    className='create-input-field'
                                    // placeholder='Ride Start...'
                                    type='text'
                                    id='name'
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
                                    id='name'
                                    value={endPoint}
                                    onChange={(e) => setEndPoint(e.target.value)}
                                />
                            </div>
                        </form>
                        <div>
                            <p className='existing-ride' onClick={() => setCustomizeRoute(false)}>Choose From an <span>Existing Route ></span></p>
                        </div>
                    </div>
                    :
                    <div className='rides-routes-spacing'>
                        <div className='rides-routes-container'>
                            {detailRoute ?
                                <div className='create-detail-container' style={{height: gridHeight}} onClick={() => handleDetail('')}>
                                    edit
                                </div>
                                :
                                <div className='routes-grid' ref={divRef} style={{height: gridHeight}}>                                    
                                    {renderRoutes}
                                </div>
                            }
                            <div className='arrow-container'>
                                <h1 className='left-arrow' className={firstSliceNum <= 0 ? 'left-arrow-inactive' : 'left-arrow'} onClick={() => handleSlice('left')}>〈</h1>
                                <h5 className='page-number'>{secondSliceNum / 9}/{Math.ceil(routes.length / 9)}</h5>
                                <h1 className='right-arrow' className={secondSliceNum >= routes.length ? 'right-arrow-inactive' : 'right-arrow'} onClick={() => handleSlice('right')}>〈</h1>
                            </div>
                        </div>
                        <div>
                            <p className='existing-ride' onClick={() => setCustomizeRoute(true)}>Create a <span>New Route ></span></p>
                        </div>
                    </div>
                }
            </div>
            <div className='create-button-container'>
                <div className='create-new-container'>
                    <button className='create-new-button'>Create Ride</button>
                </div>
                <div className='cancel-container'>
                    <button className='cancel-button' onClick={handleRideCreatorActive}>Cancel</button>
                </div>
            </div>
        </div>  
    )
}

export default RideCreator