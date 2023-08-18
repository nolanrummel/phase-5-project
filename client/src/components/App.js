import React, {useState} from "react";
import Login from "./Login";
import Signup from "./Signup";
import Title from "./Title";
import Home from "./Home";
import Places from "./Places"
import Routes from "./Routes";
import Team from "./Team";
import Navbar from "./Navbar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { UserProvider  } from "../context/user";

function App() {
  const [user, setUser] = useState(null)
  console.log(user)

  return (
    <Router>
      <UserProvider>
        <Title user={user} />
        <Navbar />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/login">
            <Login setUser={setUser} />
          </Route>
          <Route path="/signup">
            <Signup setUser={setUser} />
          </Route>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/team">
            <Team />
          </Route>
          <Route exact path="/routes">
            <Routes />
          </Route>
          <Route exact path="/places">
            <Places />
          </Route>
        </Switch>
      </UserProvider>
    </Router>
  );
}

export default App;