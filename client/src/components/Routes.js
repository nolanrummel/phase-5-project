import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/user'

function Routes() {
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
        const userCount = {}
        route.forEach(routeData => {
            const userId = routeData.user.id
            if (userId in userCount) {
                userCount[userId]++
            } else {
                userCount[userId] = 1
            }
        })
        const sortedUsers = Object.keys(userCount).map(userId => ({
            id: userId,
            name: route.find(routeData => routeData.user.id === parseInt(userId)).user.name,
            count: userCount[userId]
        }))
        sortedUsers.sort((a, b) => b.count - a.count)
        return (
            <div>
                {sortedUsers.map(user => (
                    <li key={user.id}>
                        {user.name}: {user.count}
                    </li>
                ))}
            </div>
        )
    }

    const renderRoutes = routeList.map((route) => {
        return (
            <div key={route.id}>
                <h3>{route.name}</h3>
                <h5>{route.distance} Miles</h5>
                <p>Times Ridden: {route.rides.length}</p>
                <div>
                    <h5>Leader Board</h5>
                    {LeaderBoard(route.rides)}
                </div>
            </div>
        )
    })

    return (
        <div>
            <h2>Routes Page</h2>
            {renderRoutes}
        </div>
        // <div>
        //     {user ? 
        //         <div>
        //             <h2>Routes Page</h2>
        //         </div>
        //         :
        //         <Redirect to='/home' />
        //     }
        // </div>  
    )
}

export default Routes