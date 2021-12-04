import { useContext } from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import "./App.css";
import Auth from "./Pages/Auth";
import Events from "./Pages/Events";
import Bookings from "./Pages/Bookings";
import Navbar from "./Components/Navbar";

import { AuthContext } from "./Context/AuthContext";

function App() {
  const { authValues } = useContext(AuthContext);
  const authToken = authValues.token;

  return (
    <Router>
      <Navbar />
      <main className="main-content">
        <Switch>
          <Route exact path="/">
            {!authToken ? <Redirect to="/auth" /> : <Redirect to="/events" />}
          </Route>
          <Route path="/auth">
            {!authToken ? <Auth /> : <Redirect to="/events" />}
          </Route>
          <Route path="/events">
            <Events />
          </Route>
          <Route path="/bookings">
            {authToken ? <Bookings /> : <Redirect to="/auth" />}
          </Route>
        </Switch>
      </main>
    </Router>
  );
}

export default App;
