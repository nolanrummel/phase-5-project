import React, {useContext} from 'react'
import { UserContext } from '../context/user'

function EditUser() {
    const { user } = useContext(UserContext)
    const deleteUser = (e) => {
        console.log(user)
    }
    return (
        <div>
            <h2>Edit User</h2>
            <button onClick={deleteUser} value={'test'}>Delete User</button>
        </div>  
    )
}

export default EditUser