import React, { useContext } from 'react'
import { UserContext } from '../context/user'
import Rating from './Rating'
import "../styling/leader-board.css"

function LeaderBoard({route, currentTime}) {
    const { user } = useContext(UserContext)

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
    const sortedLeaders = Object.keys(userCount).map(userId => ({
        id: userId,
        name: rides.find(rideData => rideData.user.id === parseInt(userId)).user.name,
        count: userCount[userId]
    }))
    sortedLeaders.sort((a, b) => b.count - a.count)
    const slicedLeaders = sortedLeaders.slice(0, 5)
    return (
        <div>
            {user ? 
                <table className='leader-table'>
                    <thead>
                        {/* <tr>
                            <th>Times Ridden</th>
                            <th></th>
                            <th>Leader Names</th>
                            <th>Total Miles</th>
                        </tr> */}
                    </thead>
                    <tbody>
                        {slicedLeaders.map((leader) => (
                            <tr key={leader.id}>
                                <td className={user.id === parseInt(leader.id) ? 'user-leader' : 'user-leader-name'}>{leader.name}</td>
                                <td className={user.id === parseInt(leader.id) ? 'user-leader' : 'user-leader-name'}>X</td>
                                <td className={user.id === parseInt(leader.id) ? 'user-leader' : 'user-leader-name'}>{leader.count}</td>
                                <td className={user.id === parseInt(leader.id) ? 'user-leader' : 'user-leader-name'}>{(leader.count * route.distance).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                :
                <table className='leader-table'>
                    <thead>
                        {/* <tr>
                            <th>Times Ridden</th>
                            <th></th>
                            <th>Leader Names</th>
                            <th>Total Miles</th>
                        </tr> */}
                    </thead>
                    <tbody>
                        {slicedLeaders.map((leader) => (
                            <tr key={leader.id}>
                                <td className={'user-leader-name'}>{leader.name}</td>
                                <td className={'user-leader-name'}>X</td>
                                <td className={'user-leader-name'}>{leader.count}</td>
                                <td className={'user-leader-name'}>{(leader.count * route.distance).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
            {/* {slicedLeaders.map(leader => {
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
            })} */}
            <h4 className='total-trips'>Total Trips: {completedRides.length}</h4>
            <h3 className='ride-detail-group'>Average Rating: {averageRating}</h3>
            <div className='rating-routes-detail'>
                <Rating rating={averageRating}/>
            </div>
            {/* <h4 className='ride-detail-group'>({completedRides.length})</h4> */}
        </div>
    )
}

export default LeaderBoard