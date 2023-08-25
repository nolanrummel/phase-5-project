import React, {useContext, useState} from 'react'
import { UserContext } from '../context/user'
import "../styling/edit-user.css"
import { ReactComponent as BikeIcon } from '../icons/bike-icon.svg'

function EditUser({setEditUser}) {
    const { user, setUser } = useContext(UserContext)
    const [name, setName] = useState(user.name)
    const [userName, setUserName] = useState(user.user_name)
    const [password, setPassword] = useState(user._password_hash)

    console.log(`Name: ${name} | Username: ${userName} | Password: ${password}`)

    const changeAttr = (e) => {
        // if (e.value === 'Change Name...') {
        //     console.log('name is empty and will not change')
        //     name = user.name
        // } else {
        //     setName(e.value)
        // }
        // if (e.value === 'Change Username...') {
        //     userName = user.user_name
        // } else {
        //     setUserName(e.value)
        // }
        // if (e.value === 'Change Password...') {
        //     password = user._password_hash
        // } else {
        //     setPassword(e.value)
        // }
    }

    const handleSubmit = (e) => {
        // e.preventDefault()
        // if (name !== user.name) {
        //     console.log('name is empty and will not change')
        //     setName(user.name)
        // }
        // if (userName !== '') {
        //     console.log('username is empty and will not change')
        //     setUserName(user.user_name)
        // }
        // if (password === '') {
        //     console.log('password is empty and will not change')
        //     setPassword(user._password_hash)
        // }

        const formObj = {
            'name': name,
            'user_name': userName,
            'password': password
        }

        setEditUser(false)
        console.log(formObj)

        fetch(`http://127.0.0.1:5555/users/${user.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formObj),
        }).then(r => {
        if (r.ok) {
            // r.json().then(data => {
            //     user.name = data.name
            //     user.user_name = data.user_name
            //     user._password_hash = data.password
            //     setUser(data)
            // })
            r.json().then(data => {
                setUser(data)
            })
        }
        })

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
        fetch(`http://127.0.0.1:5555/users/${userId}`, { 
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
            <form className='edit-form' onSubmit={changeAttr}>
                <h4 className='edit-name'>Name</h4>
                <div className='edit-lockup'>
                    <input
                        className='edit-input-field'
                        placeholder='Change Name...'
                        type='text'
                        id='name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {/* <button className='change-button' type='submit'>Change Name</button> */}
                </div>
            </form>
            <form className='edit-form' onSubmit={changeAttr}>
                <h4 className='edit-name'>Username</h4>
                <div className='edit-lockup'>
                    <input
                        className='edit-input-field'
                        placeholder='Change Username...'
                        type='text'
                        id='userName'
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    {/* <button className='change-button' type='submit'>Change Username</button> */}
                </div>
            </form>
            <form className='edit-form' onSubmit={changeAttr}>
                <h4 className='edit-name'>Password</h4>
                <div className='edit-lockup'>
                    <input
                        className='edit-input-field'
                        placeholder='Change Password...'
                        type='text'
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {/* <button className='change-button' type='submit'>Change Password</button> */}
                </div>
            </form>
                
            <button className='finish-edit-button' onClick={handleSubmit}>Confirm Changes</button>
            <button className='delete-user-button' onClick={handleDelete} value={'test'}>Delete User</button>
        </div>  
    )
}

export default EditUser