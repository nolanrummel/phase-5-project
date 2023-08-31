import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/user'
import { Link } from 'react-router-dom'
import LeaderBoard from './LeaderBoard'
import "../styling/routes.css"

function Routes({currentTime}) {
    const { user } = useContext(UserContext)
    const [routeList, setRouteList] = useState([])

    useEffect(() => {
        fetch('/routes')
          .then(response => response.json())
          .then(data => {
            setRouteList(data)
          })
          .catch(error => {
            console.error('Error Fetching Routes:', error)
          })
    }, [])

    const renderRoutes = routeList.map((route) => {
        return (
            <div key={route.id} className='routes-container'>
                <div>
                    <h2 className='route-title'>{route.name}</h2>
                    <div className='directions-full'>
                        <h4 className='direction-origin'>{route.origin}</h4>
                        <div className='divider-to'></div>
                        <h4 className='direction-dest'>{route.destination}</h4>
                    </div>
                </div>
                <div className='map-stats-container'>
                    <img className='route-map-image' src={route.map_preview} alt={route.name}/>
                    <div className='right-side-info'>
                        {route.rides.length > 1 ?
                            <div>
                                <h3 className='leader-title'>Leader Board</h3>
                                <LeaderBoard route={route} currentTime={currentTime}/>
                            </div>
                            :
                            <div>
                                <h3 className='be-the-first'>Be the First<br></br>to Ride this Route!</h3>
                                <Link to='/rides' className='top-left-buttons'>
                                    <button className='more-info'>More Info</button>
                                </Link>
                            </div>
                        }
                        <h3>{route.distance} Miles</h3>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div>
            {renderRoutes}
        </div>  
    )
}

export default Routes