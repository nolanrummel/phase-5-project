import React, {useContext, useState} from 'react'
import { UserContext } from '../context/user'

function EditUser({setEditUser}) {
    const { user, setUser } = useContext(UserContext)
    const [name, setName] = useState(user.name)
    const [userName, setUserName] = useState(user.user_name)
    const [password, setPassword] = useState(user._password_hash)

    console.log(name, userName, password)

    const handleSubmit = (e) => {
        e.preventDefault()
        const formObj = {
            'name': name,
            'userName': userName,
            'password': password
        }

        setEditUser(false)
        console.log(formObj)

        fetch(`http://127.0.0.1:5555/users/${user.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formObj)
        })
            .then(r => {
                if(r.ok) {
                    r.json()
                        .then(data => {
                            setUser(data)
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

    return (
        <div>
            <h2>Edit User</h2>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder='Name'
                    type='text'
                    id='name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    placeholder='Username'
                    type='text'
                    id='userName'
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
                <input
                    placeholder='Password'
                    type='text'
                    id='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Confirm Changes</button>
            </form>
            <button onClick={handleDelete} value={'test'}>Delete User</button>
        </div>  
    )
}

export default EditUser