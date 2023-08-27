import React, { useContext, useState } from 'react'
import { UserContext } from '../context/user'
import "../styling/rating.css"

function Rating({rating, pastPublic, rideId}) {
    const { user } = useContext(UserContext)

    const [starRating, setStarRating] = useState(0)
    const [editing, setEditing] = useState(false)

    const handleStarClick = (selectedRating) => {
        setStarRating(selectedRating)
    }

    const averageInteger = Math.floor(rating)
    const averageDecimal = Math.round((rating % 1) * 100)

    let arrayLength = 0
    if (averageDecimal != 0) {
        arrayLength = 4 - averageInteger
    } else {
        arrayLength = 5 - averageInteger
    }

    const handleRatingChange = (e) => {
        setEditing(!editing)
    }

    const confirmRating = (e) => {
        e.preventDefault()
        console.log(rideId)
        const formObj = {
            'rating': rating
        }
        fetch(`http://127.0.0.1:5555/rides/${rideId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formObj)
        })
            .then(r => {
                if(r.ok) {
                    r.json()
                        .then(data => {
                            console.log(data)
                        })
                }
                else {
                    r.json()
                        .then(data => {
                            console.log(data)
                        })
                }
            })
    }

    return (
        <div>
            {editing ? 
                <div>
                    {Array.from({length: 5}, (_, index) => (
                        <span
                            key={index}
                            onClick={() => handleStarClick(index +1)}
                            className={index < starRating ? 'edit-filled-star' : 'edit-empty-star'}
                        >
                            ★
                        </span>
                    ))}
                    <button onClick={confirmRating}>Confirm Changes</button>
                    <button onClick={handleRatingChange}>Cancel Editing</button>
                </div>
                :
                <div>
                    <div>
                        {Array.from({length: averageInteger}, (_, index) => (
                            <span key={index} className='filled-star'>
                                ★
                            </span>
                        ))}
                        {averageDecimal == 0 ? '':
                            <span className='fractional-star' style={{background: `linear-gradient(to right, gold ${averageDecimal}%, red ${averageDecimal}%)`, '-webkit-background-clip': 'text'}}>
                                ★
                            </span>
                        }
                        {Array.from({length: arrayLength}, (_, index) => (
                            <span key={index} className='empty-star'>
                                ★
                            </span>
                        ))}
                        {pastPublic ? '' : <button onClick={handleRatingChange}>Change Rating</button>}
                    </div>
                </div>
            }
        </div>  
    )
}

export default Rating