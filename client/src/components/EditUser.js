import React, {useContext} from 'react'
import { UserContext } from '../context/user'

function EditUser({setEditUser}) {
    const { user, setUser } = useContext(UserContext)

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

    const handleDelete = (e) => {
        deleteUser(user.id)
        setUser(null)
        setEditUser(false)
    }

    const handleConfirmChanges = (e) => {
        setEditUser(false)
    }

    return (
        <div>
            <h2>Edit User</h2>
            <button onClick={handleConfirmChanges}>Confirm Changes</button>
            <button onClick={handleDelete} value={'test'}>Delete User</button>
        </div>  
    )
}

export default EditUser