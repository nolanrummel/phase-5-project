import React, { useState, useEffect, useRef } from 'react'
import Rating from './Rating'

function RenderRides({rides, sliceNum}) {
    const [detailRide, setDetailRide] = useState('')
    const [mapHeight, setMapHeight] = useState('')
  
    const divRef = useRef(null)

    const handleDetail = (rideId) => {
        if (detailRide === rideId) {
            setDetailRide('')
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

    const pastPublic = true

    const renderPastPublic = rides.slice(0, sliceNum).map((ride) => {
        const month = ride.date.slice(5, 7)
        const day = ride.date.slice(8, 10)
        const hour = ride.date.slice(11, 13)
        const minutes = ride.date.slice(14, 16)
        const milesInteger = Math.floor(ride.route.distance)
        const milesDecimal = Math.round((ride.route.distance % 1) * 100)
        
        //console.log(month + '/' + day + ' ' + hour + ':' + minutes + `${hour >= 12 ? 'PM' : 'AM'}`)
        return (
            <div className={detailRide === ride.id ? 'detail-container' : ''} key={ride.id}>
                <div className='ride-card' key={ride.id} onClick={() => handleDetail(ride.id)}>
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
            </div>
        )
    })
    return <div className='card-grid'>{renderPastPublic}</div>
}

export default RenderRides