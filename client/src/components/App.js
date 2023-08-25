import React, { useState, useEffect } from "react"
import Title from "./Title"
import Home from "./Home"
import Places from "./Places"
import Routes from "./Routes"
import Rides from "./Rides"
import Navbar from "./Navbar"
import NotFound from "./NotFound"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { UserProvider } from "../context/user"

function App() {
  //here for useContext
  const [user, setUser] = useState(null)

  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    setCurrentTime(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2,'0')}-${String(new Date().getDate()).padStart(2,'0')} ${String(new Date().getHours()).padStart(2,'0')}:${String(new Date().getMinutes()).padStart(2,'0')}:${String(new Date().getSeconds()).padStart(2,'0')}`)
  }, [])

  return (
    <Router>
      <UserProvider>
        <div className="title-nav-container">
          <Title />
          <Navbar />
        </div>
        <div className="background-container">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/home">
              <Home />
            </Route>
            <Route exact path="/rides">
              <Rides currentTime={currentTime} />
            </Route>
            <Route exact path="/routes">
              <Routes currentTime={currentTime} />
            </Route>
            <Route exact path="/places">
              <Places />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </div>
      </UserProvider>
    </Router>
  )
}

export default App