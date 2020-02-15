import React, { Fragment } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

/*
import { isAuthenticated } from "./services/auth";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import App from "./pages/App";
*/

import status404 from './components/status404';
import Home from './components/Home';
import Login from './components/Login';
import Registrar from './components/Registrar';

import {isAuthenticated} from './services/auth';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/", state: { from: props.location } }} />
      )
    }
  />
);

const Routes = () => (
  <BrowserRouter>
    <Fragment>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/registrar" component={Registrar} />
        <PrivateRoute path="/home" component={Home} />       
        <Route path="*" component={status404} />
      </Switch>
    </Fragment>
  </BrowserRouter>
);

export default Routes;
