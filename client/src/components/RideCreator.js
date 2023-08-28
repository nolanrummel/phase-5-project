import React, { useContext, useState } from 'react'
import { UserContext } from '../context/user'
import { ReactComponent as BikeIcon } from '../icons/bike-icon.svg'
import "../styling/ride-creator.css"

function RideCreator({setRideCreatorActive}) {
    const { user } = useContext(UserContext)

    const [name, setName] = useState('')
    const [rideDate, setRideDate] = useState('')
    const [startPoint, setStartPoint] = useState('')
    const [endPoint, setEndPoint] = useState('')

    const handleRideCreatorActive = (e) => {
        setRideCreatorActive(false)
    }

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
                <form className='create-form'>
                    <h4 className='create-header'>Ride Date</h4>
                    <div className='create-lockup'>
                        <input
                            className='create-input-field'
                            // placeholder='Ride Date...'
                            type='text'
                            id='name'
                            value={rideDate}
                            onChange={(e) => setRideDate(e.target.value)}
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