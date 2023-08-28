import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/user'
import LeaderBoard from './LeaderBoard'
import "../styling/routes.css"

function Routes({currentTime}) {
    const { user } = useContext(UserContext)
    const [routeList, setRouteList] = useState([])

    useEffect(() => {
        fetch('http://127.0.0.1:5555/routes')
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
            <div key={route.id}>
                <h3>{route.name}</h3>
                <h5>{route.distance} Miles</h5>
                <div>
                    <h5>Leader Board</h5>
                    {/* {LeaderBoard(route)} */}
                    <LeaderBoard route={route} currentTime={currentTime}/>
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