import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/user'
import "../styling/rating.css"

function Rating({rating, rideId, detailRide, altColor, selectedColor}) {
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

        const formObj = {
            'rating': starRating
        }
        fetch(`/rides/${rideId.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formObj),
        }).then(r => {
        if (r.ok) {
            r.json().then(data => {
                setNewRating(starRating)
                setStartingRating(starRating)
            })
        } else {
            r.json().then(data => {
                console.log(data)
            })
        }})
        setEditing(!editing)
    }

    return (
        <div>
            {detailRide ? 
                <div>
                    {editing ? 
                        <div className='editing-rating-lockup'>
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
                                <button className='confirm-rating' onClick={confirmRating}>Confirm Changes</button>
                                {/* <button onClick={handleEditState}>Cancel Editing</button> */}
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
                                    <span className='fractional-star' style={{background: `linear-gradient(to right, gold ${averageDecimal}%, red ${averageDecimal}%)`, 'WebkitBackgroundClip': 'text'}}>  
                                    {/* '-webkit-background-clip': 'text' */}
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
                <div>
                    {altColor ? 
                        <div className='rating-lockup'>
                            <div>
                                {Array.from({length: averageInteger}, (_, index) => (
                                    <span key={index} className='alt-filled-star'>
                                        ★
                                    </span>
                                ))}
                                {averageDecimal == 0 ? '':
                                    <span className='alt-fractional-star' style={{background: `linear-gradient(to right, #2a344f ${averageDecimal}%, #56666f ${averageDecimal}%)`, 'WebkitBackgroundClip': 'text'}}>
                                        ★
                                    </span>
                                }
                                {Array.from({length: arrayLength}, (_, index) => (
                                    <span key={index} className='alt-empty-star'>
                                        ★
                                    </span>
                                ))}
                            </div>
                        </div>
                        : selectedColor ?
                        <div className='rating-lockup'>
                            <div>
                                {Array.from({length: averageInteger}, (_, index) => (
                                    <span key={index} className='selected-filled-star'>
                                        ★
                                    </span>
                                ))}
                                {averageDecimal == 0 ? '':
                                    <span className='selected-fractional-star' style={{background: `linear-gradient(to right, #56666f ${averageDecimal}%, #9eada5 ${averageDecimal}%)`, 'WebkitBackgroundClip': 'text'}}>
                                        ★
                                    </span>
                                }
                                {Array.from({length: arrayLength}, (_, index) => (
                                    <span key={index} className='selected-empty-star'>
                                        ★
                                    </span>
                                ))}
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
                                    <span className='fractional-star' style={{background: `linear-gradient(to right, gold ${averageDecimal}%, red ${averageDecimal}%)`, 'WebkitBackgroundClip': 'text'}}>
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