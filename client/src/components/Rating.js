import React, { useContext, useState } from 'react'
import { UserContext } from '../context/user'
import "../styling/rating.css"

function Rating({rating, editing}) {
    const { user } = useContext(UserContext)

    const [starRating, setStarRating] = useState(0)

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
    console.log(arrayLength)
    console.log(averageDecimal)

    return (
        <div>
            {editing ? 
                <div>
                    {Array.from({length: 5}, (_, index) => (
                        <span
                            key={index}
                            onClick={() => handleStarClick(index +1)}
                            className={index < starRating ? 'filled-star' : 'empty-star'}
                        >
                            ★
                        </span>
                    ))}
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
                    </div>
                </div>
            }
        </div>  
    )
}

export default Rating