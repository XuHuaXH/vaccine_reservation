import React from 'react';
import Login from './Login.js';
import ProductDetails from "./ProductDetails.js";
import Settings from "./Settings.js";
import Entry from "./Entry.js";
import PatientPage from "./PatientPage.js";
import ProviderPage from "./ProviderPage.js";
import axios from 'axios';
import { Box, Button, useColorMode, Heading } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import * as Constants from "./Constants.js";


class RouterPage extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            authenticated: false
        };
    }

    componentDidMount = () => {
        if (localStorage.getItem('token') != null) {
            this.setState({authenticated: true});
        }
        console.log(this.state.authenticated);
        this.render();
    }

    logout = () => {
        axios.post(Constants.BASE_URL + ":" + Constants.PORT + "/rest-auth/logout/").then(() => {
            localStorage.removeItem('token');
        }).then(() => {
            this.setState({authenticated: false});
        });
    }


    render() {
        return (
            <Router>
        	    <Switch>
                <Route exact path="/">
                    <Redirect to="/entry" />
                </Route>
                <Route exact path="/entry">
                    <Entry />
                </Route>
                <Route path="/patient-page">
                    <PatientPage />
                </Route>
                <Route path="/provider-page">
                    <ProviderPage />
                </Route>
                // <Route path="/product/:id" component={ProductDetails} />
              </Switch>
        	</Router>
    	);
    }
}


export default RouterPage;
