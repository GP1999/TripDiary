import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Navbar from './Components/Navigation/Navbar.js';
import Registration from './Components/Registration/Registration.js';
import Login from './Components/Login/Login';
import * as serviceWorker from './serviceWorker';
import Items from './Components/Items/Items.js';
import Admin from './Components/Admin/Admin.js';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Navbar/>
    <Router>
    <Switch>
          <Route exact path="/">
            <Items />
          </Route>
          <Route exact path="/Login">
            <Login />

          </Route>
          <Route exact path="/register">
            <Registration />
          </Route> 
          <Route exact path="/admin">
            <Admin/>
          </Route>
        </Switch>
    </Router>
    
  </React.StrictMode>
  ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
