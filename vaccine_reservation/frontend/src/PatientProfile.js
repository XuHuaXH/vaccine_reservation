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


class PatientProfile extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			first_name: '',
			last_name: '',
			email: '',
			dob: '',
			ssn: '',
			address: '',
			phone: '',
			max_distance: '',
		}
	}


    componentDidMount = () => {
		const token = localStorage.getItem('token');
		const config = {
   			headers: {
      			Authorization: "Token " + token
   			}
		};
		axios.get(Constants.BASE_URL + ":" + Constants.PORT + "/patient-info/", config).then((response) => {
			const patient = response.data;
			this.setState({
				first_name: patient.user.first_name,
				last_name: patient.user.last_name,
				email: patient.user.email,
				dob: patient.dob,
				ssn: patient.ssn,
				address: patient.patient_address,
				phone: patient.patient_phone,
				max_distance: patient.max_distance,
			})
			console.log(this.state.patient);
		});
    }



    render() {
		return (
			<Stack spacing={3}>
			  <Text fontSize="md">First Name: {this.state.first_name}</Text>
			  <Text fontSize="md">Last Name: {this.state.last_name}</Text>
			  <Text fontSize="md">Email: {this.state.email}</Text>
			  <Text fontSize="md">Date of Birth: {this.state.dob}</Text>
			  <Text fontSize="md">SSN: {this.state.ssn}</Text>
			  <Text fontSize="md">Address: {this.state.address}</Text>
			  <Text fontSize="md">Phone: {this.state.phone}</Text>
			  <Text fontSize="md">Max Distance: {this.state.max_distance} mile(s)</Text>

			</Stack>
		);
	}
}


export default PatientProfile;
