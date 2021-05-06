import React from 'react';
import Login from './Login.js';
import Register from './Register.js';
import ProductDetails from "./ProductDetails.js";
import Settings from "./Settings.js";
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


class Header extends React.Component {


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
    		<Box bg="teal.100" color="gray.800" w="100%" p={16}>
                <Box>
                    <Box p={8}>
                    </Box>
                    <Link to="/about">
                    <Button color="black" variantColor="teal" variant="ghost" style={{float: 'left'}}>
                        About
                    </Button>
                    </Link>
                    <Link to="/products">
                    <Button color="black" variantColor="teal" variant="ghost" style={{float: 'left'}}>
                        Shop
                    </Button>
                    </Link>
                    <Login
                        reload={this.componentDidMount}
                        authenticated={this.state.authenticated}
                    />
                    <Register
                        reload={this.componentDidMount}
                        authenticated={this.state.authenticated}
                    />
                    <Link to="/settings">
                    <Button color="black" variantColor="teal" variant="ghost" style={{float: 'right', display: this.state.authenticated ? 'block' : 'none'}} onClick={this.showSettings}>
                        Settings
                    </Button>
                    </Link>
                </Box>
    		</Box>

        	    <Switch>
                <Route exact path="/">
                    <Redirect to="/products" />
                </Route>
            <Route path="/settings">
                <Settings />
            </Route>
           <Route path="/product/:id" component={ProductDetails} />
              </Switch>
        	</Router>
    	);
    }
}


export default Header;
