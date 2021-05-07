import React from 'react';
import './App.css';
import Entry from './Entry.js';
import Logout from './Logout.js';
import AddAppointment from './AddAppointment.js';
import axios from 'axios';
import * as Constants from "./Constants.js";
import { ChakraProvider } from "@chakra-ui/react"
import { Text, Stack, Box, Heading, Button, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import { ColorModeProvider, ThemeProvider, CSSReset } from '@chakra-ui/react';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react";
import {Redirect} from 'react-router-dom';


class ProviderProfile extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			name: '',
			email: '',
			address: '',
			phone: '',
		}
	}


    componentDidMount = () => {
		const token = localStorage.getItem('token');
		const config = {
   			headers: {
      			Authorization: "Token " + token
   			}
		};
		axios.get(Constants.BASE_URL + ":" + Constants.PORT + "/provider-info/", config).then((response) => {
			const provider = response.data;
			this.setState({
				name: provider.provider_name,
				email: provider.user.email,
				address: provider.provider_address,
				phone: provider.provider_phone,
			})
		});
    }



    render() {
		return (
			<Stack spacing={3}>
			  <Text fontSize="md">Name: {this.state.name}</Text>
			  <Text fontSize="md">Email: {this.state.email}</Text>
			  <Text fontSize="md">Address: {this.state.address}</Text>
			  <Text fontSize="md">Phone: {this.state.phone}</Text>

			</Stack>
		);
	}
}


export default ProviderProfile;
