import React, {useState} from "react"
import Title from "./Title"
import Home from "./Home"
import Places from "./Places"
import Routes from "./Routes"
import Team from "./Team"
import Navbar from "./Navbar"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { UserProvider  } from "../context/user"

function App() {
  const [user, setUser] = useState(null)

  return (
    <Router>
      <UserProvider>
        <Title user={user} />
        <Navbar />
        <Switch>
          <Route exact path="/">
            <Home user={user} />
          </Route>
          <Route exact path="/home">
            <Home user={user} />
          </Route>
          <Route exact path="/team">
            <Team user={user}/>
          </Route>
          <Route exact path="/routes">
            <Routes user={user}/>
          </Route>
          <Route exact path="/places">
            <Places user={user}/>
          </Route>
        </Switch>
      </UserProvider>
    </Router>
  )
}

export default App