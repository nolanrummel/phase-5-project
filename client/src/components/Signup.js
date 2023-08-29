import React, { useContext } from 'react'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { UserContext } from '../context/user'
import "../styling/login-signup.css"


function Signup() {

  const history = useHistory()

  const [name, setName] = useState('')
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const { setUser } = useContext(UserContext)

  function handleSubmit(e) {
    e.preventDefault();
    const formObj = {
      'userName': userName,
      'password': password,
      'name': name
    }

    fetch('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formObj)
    })
      .then(r => {
        if(r.ok) {
          r.json()
            .then(data => {
              history.push('/home')
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

  return (
    <form onSubmit={handleSubmit} className='form'>
      <h4>Name</h4>
      <input
        className='input-field'
        placeholder=''
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <h4>Username</h4>
      <input
        className='input-field'
        placeholder=''
        type="text"
        id="userName"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <h4>Password</h4>
      <input
        className='input-field'
        placeholder=''
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className='finish-button' type="submit">Signup</button>
    </form>
  )
}

export default Signup