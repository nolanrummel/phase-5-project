import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/user'
import "../styling/rating.css"

function Rating({rating, rideId, detailRide }) {
    const { user } = useContext(UserContext)

    const [starRating, setStarRating] = useState(rating)
    const [newRating, setNewRating] = useState(0)
    const [startingRating, setStartingRating] = useState(rating)
    const [editing, setEditing] = useState(false)

    useEffect(() => {
        setStartingRating(rating)
    }, [])

    const handleStarClick = (selectedRating) => {
        setStarRating(selectedRating)
    }

    const averageInteger = Math.floor(starRating)
    const averageDecimal = Math.round((starRating % 1) * 100)

    let arrayLength = 0
    if (averageDecimal != 0) {
        arrayLength = 4 - averageInteger
    } else {
        arrayLength = 5 - averageInteger
    }

    const handleEditState = (e) => {
        e.stopPropagation()
        setEditing(!editing)
    }

    const confirmRating = (e) => {
        e.stopPropagation()

        console.log(rideId)
        const formObj = {
            'rating': starRating
        }
        fetch(`http://127.0.0.1:5555/rides/${rideId.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formObj),
        }).then(r => {
        if (r.ok) {
            r.json().then(data => {
                console.log(data)
                setNewRating(starRating)
                setStartingRating(starRating)
            })
        } else {
            r.json().then(data => {
                console.log(data)
            })
        }})
    }

    return (
        <div>
            {detailRide ? 
                <div>
                    {editing ? 
                        <div>
                            {Array.from({length: 5}, (_, index) => (
                                <span
                                    key={index}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleStarClick(index + 1);
                                    }}
                                    className={index < starRating ? 'edit-filled-star' : 'edit-empty-star'}
                                >
                                    ★
                                </span>
                            ))}
                            <div>
                                <button onClick={confirmRating}>Confirm Changes</button>
                                <button onClick={handleEditState}>Cancel Editing</button>
                            </div>
                        </div>
                        :
                        <div className='rating-lockup'>
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
                            </div>
                            <button className='change-rating' onClick={handleEditState}>Change Rating</button>
                        </div>
                    }
                </div>
                :
                <div className='rating-lockup'>
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
                    </div>
                </div>
            }
            {/* {user !== null ? 
                            <div>
                                {detailRide === rideId ? '' : <button className='change-rating' onClick={handleRatingChange}>Change Rating</button> }
                            </div>
                            :
                            ''
                        } */}
        </div>  
    )
}

export default Rating