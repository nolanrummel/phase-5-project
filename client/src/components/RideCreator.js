import React, { useContext, useState } from 'react'
import { UserContext } from '../context/user'
import { ReactComponent as BikeIcon } from '../icons/bike-icon.svg'
import "../styling/ride-creator.css"

function RideCreator({setRideCreatorActive}) {
    const { user } = useContext(UserContext)

    const [name, setName] = useState('')
    const [rideDate, setRideDate] = useState('')
    const [rideTime, setRideTime] = useState('')
    const [startPoint, setStartPoint] = useState('')
    const [endPoint, setEndPoint] = useState('')
    const [extraPoints, setExtraPoints] = useState([])
    const [extraPointsCount, setExtraPointsCount] = useState(0)

    const formattedDate = `${rideDate} ${rideTime}:00.000000`
    // console.log(formattedDate)

    // console.log([startPoint, extraPoints, endPoint])
    // console.log(extraPoints)
    
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