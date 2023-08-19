import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/user'
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
            console.error('Error fetching routes:', error)
          })
    }, [])

    const LeaderBoard = (route) => {
        const rides = route.rides
        const completedRides = rides.filter(item => item.date < currentTime)
        const userCount = {}
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
        const sortedLeaders = Object.keys(userCount).map(userId => ({
            id: userId,
            name: rides.find(rideData => rideData.user.id === parseInt(userId)).user.name,
            count: userCount[userId]
        }))
        sortedLeaders.sort((a, b) => b.count - a.count)
        const slicedLeaders = sortedLeaders.slice(0, 5)
        return (
            <div>
                {slicedLeaders.map(leader => {
                    return (
                        <div key={leader.id}>
                            {user ? 
                                <div>
                                    {user.id === parseInt(leader.id) ?
                                        <div key={leader.id} className='user-leader'>
                                            <p>{leader.name}: {leader.count} | Total Miles: {(leader.count * route.distance).toFixed(2)}</p>
                                        </div>
                                        :
                                        <div key={leader.id}>
                                            <p>{leader.name}: {leader.count} | Total Miles: {(leader.count * route.distance).toFixed(2)}</p>
                                        </div>
                                    }
                                </div>
                                :
                                <div key={leader.id}>
                                    <p>{leader.name}: {leader.count} | Total Miles: {(leader.count * route.distance).toFixed(2)}</p>
                                </div>
                            }
                        </div>
                    )
                })}
                <p>Total Trips: {completedRides.length}</p>
                <p>Average Rating: {(totalRating/completedRides.length).toFixed(2)} ({completedRides.length})</p>
            </div>
        )
    }

    const renderRoutes = routeList.map((route) => {
        return (
            <div key={route.id}>
                <h3>{route.name}</h3>
                <h5>{route.distance} Miles</h5>
                <div>
                    <h5>Leader Board</h5>
                    {LeaderBoard(route)}
                </div>
            </div>
        )
    })

    return (
        <div>
            <h2>Routes Page</h2>
            {renderRoutes}
        </div>  
    )
}

export default Routes