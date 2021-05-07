import { withRouter } from 'react-router-dom'
import { Button, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import {Redirect, useHistory} from 'react-router-dom';
import * as Constants from "./Constants.js";
import axios from 'axios';



function Logout(props) {
	const history = useHistory();

	function onLogout() {
		const token = localStorage.getItem('token');
		const config = {
			headers: {
				Authorization: "Token " + token
			}
		};
		axios.post(Constants.BASE_URL + ":" + Constants.PORT + "/logout/", {}, config).then(() => {
			history.push('/entry');
		})
	}

	return (
		<Button
		  my={3}
		  mx={3}
	      colorScheme='blue'
	      onClick={() => onLogout()}
	    >
	      Logout
	    </Button>
	)

}



export default Logout;
