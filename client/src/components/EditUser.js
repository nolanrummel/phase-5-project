import React, {useContext, useState} from 'react'
import { UserContext } from '../context/user'
import "../styling/edit-user.css"
import { ReactComponent as BikeIcon } from '../icons/bike-icon.svg'

function EditUser({setEditUser}) {
    const { user, setUser } = useContext(UserContext)
    const [name, setName] = useState('')
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')

    // console.log(`Name: ${name} | Username: ${userName} | Password: ${password}`)

    const handleSubmit = (e) => {
        e.preventDefault()
      
        const formObj = {
            'name': name === '' ? user.name : name,
            'user_name': userName === '' ? user.user_name : userName,
            'password': password === '' ? user._password_hash : password
        }

        setEditUser(false)
        console.log(formObj)

        fetch(`/users/${user.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formObj),
        }).then(r => {
        if (r.ok) {
            r.json().then(data => {
                setUser(data)
            })
        } else {
            r.json().then(data => {
                console.log(data)
            })
        }})

        setName('')
        setUserName('')
        setPassword('')
    }

    const handleDelete = (e) => {
        deleteUser(user.id)
        setUser(null)
        setEditUser(false)
    }

    const deleteUser = (userId) => {
        fetch(`/users/${userId}`, { 
            method: "DELETE" 
        })
          .then(() => {
            console.log(`User ID: ${user.id} | ${user.name}: Was Deleted`)
          })
          .catch(error => {
            console.error('Error:', error)
          })
    }

    const exitEdit = () => {
        setEditUser(false)
    }

    return (
        <div className='edit-container'>
            <h1 className='x-to-exit' onClick={exitEdit}>X</h1>
            <div className='edit-header'>
                <h2 className='edit-title'>Edit User</h2>
                <BikeIcon className='edit-bike-icon'/>
            </div>
            {/* <form className='edit-form'>
                <h4 className='edit-name'>Profile Pic</h4>
                <div className='edit-lockup'>
                    <input
                        className='edit-input-field'
                        // placeholder='Change Name...'
                        type='text'
                        id='name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
            </form> */}
            <form className='edit-form'>
                <h4 className='edit-name'>Name</h4>
                <div className='edit-lockup'>
                    <input
                        className='edit-input-field'
                        // placeholder='Change Name...'
                        type='text'
                        id='name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {/* <button className='change-button' type='submit'>Change Name</button> */}
                </div>
            </form>
            <form className='edit-form'>
                <h4 className='edit-name'>Username</h4>
                <div className='edit-lockup'>
                    <input
                        className='edit-input-field'
                        // placeholder='Change Username...'
                        type='text'
                        id='userName'
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    {/* <button className='change-button' type='submit'>Change Username</button> */}
                </div>
            </form>
            <form className='edit-form'>
                <h4 className='edit-name'>Password</h4>
                <div className='edit-lockup'>
                    <input
                        className='edit-input-field'
                        // placeholder='Change Password...'
                        type='text'
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </form>
                
            <button className='finish-edit-button' onClick={handleSubmit}>Confirm Changes</button>
            <button className='delete-user-button' onClick={handleDelete} value={'test'}>Delete User</button>
        </div>  
    )
}

export default EditUser