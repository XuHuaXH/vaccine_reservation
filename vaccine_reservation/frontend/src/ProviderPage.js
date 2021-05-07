import React from 'react';
import './App.css';
import Entry from './Entry.js';
import Logout from './Logout.js';
import AddAppointment from './AddAppointment.js';
import axios from 'axios';
import * as Constants from "./Constants.js";
import { ChakraProvider } from "@chakra-ui/react"
import { Button, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
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


class ProviderPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			scheduled: [],
			cancelled: [],
			missed: [],
			completed: [],
			summary: {},
			appointments: []
		}
	}

	onLogout = () => {
		const token = localStorage.getItem('token');
		const config = {
			headers: {
				Authorization: "Token " + token
			}
		};
		axios.post(Constants.BASE_URL + ":" + Constants.PORT + "/logout/", config);
	}

    componentDidMount = () => {
		let list = [];
		const token = localStorage.getItem('token');
		const config = {
   			headers: {
      			Authorization: "Token " + token
   			}
		};
		axios.get(Constants.BASE_URL + ":" + Constants.PORT + "/provider-get-summary/", config).then((response) => {
			this.setState({
				summary: response.data
			});
		});

		axios.get(Constants.BASE_URL + ":" + Constants.PORT + "/provider-scheduled-appointments/", config).then((response) => {
			this.setState({
				scheduled: response.data
			});
		});

		axios.get(Constants.BASE_URL + ":" + Constants.PORT + "/provider-cancelled-appointments/", config).then((response) => {
			this.setState({
				cancelled: response.data
			});
		});

		axios.get(Constants.BASE_URL + ":" + Constants.PORT + "/provider-missed-appointments/", config).then((response) => {
			this.setState({
				missed: response.data
			});
		});

		axios.get(Constants.BASE_URL + ":" + Constants.PORT + "/provider-completed-appointments/", config).then((response) => {
			this.setState({
				completed: response.data
			});
		});

		axios.get(Constants.BASE_URL + ":" + Constants.PORT + "/get-appointments/", config).then((response) => {
			this.setState({
				appointments: response.data
			});
		});
    }



    render() {
		return (
			<Tabs>
			  <TabList w='100%'>
			    <Tab>Dashboard</Tab>
			    <Tab>Settings</Tab>
				<Logout />
			  </TabList>

			  <TabPanels>
			    <TabPanel>
			      <p>Scheduled Appointments</p>
				  <Table variant="simple">
					  <Thead>
					    <Tr>
					      <Th>Patient Name</Th>
					      <Th>Appointment Date</Th>
						  <Th>Appointment Time</Th>
					    </Tr>
					  </Thead>
					  <Tbody>
						{this.state.scheduled.map((appointment, index) => (
							<Tr>
							<Td>{appointment.patient.user.first_name} {appointment.patient.user.last_name}</Td>
							<Td>{appointment.appointment.date}</Td>
							<Td>{appointment.appointment.timeslot}</Td>
						    </Tr>
						))}
					  </Tbody>
					</Table>

					<p>Cancelled Appointments</p>
  				  <Table variant="simple">
  					  <Thead>
  					    <Tr>
  					      <Th>Patient Name</Th>
  					      <Th>Appointment Date</Th>
  						  <Th>Appointment Time</Th>
  					    </Tr>
  					  </Thead>
  					  <Tbody>
  						{this.state.cancelled.map((appointment, index) => (
  							<Tr>
							<Td>{appointment.patient.user.first_name} {appointment.patient.user.last_name}</Td>
							<Td>{appointment.appointment.date}</Td>
							<Td>{appointment.appointment.timeslot}</Td>
  						    </Tr>
  						))}
  					  </Tbody>
  					</Table>

					<p>Missed Appointments</p>
  				  <Table variant="simple">
  					  <Thead>
  					    <Tr>
  					      <Th>Patient Name</Th>
  					      <Th>Appointment Date</Th>
  						  <Th>Appointment Time</Th>
  					    </Tr>
  					  </Thead>
  					  <Tbody>
  						{this.state.missed.map((appointment, index) => (
  							<Tr>
							<Td>{appointment.patient.user.first_name} {appointment.patient.user.last_name}</Td>
							<Td>{appointment.appointment.date}</Td>
							<Td>{appointment.appointment.timeslot}</Td>
  						    </Tr>
  						))}
  					  </Tbody>
  					</Table>

					<p>Completed Appointments</p>
  				  <Table variant="simple">
  					  <Thead>
  					    <Tr>
  					      <Th>Patient Name</Th>
  					      <Th>Appointment Date</Th>
  						  <Th>Appointment Time</Th>
  					    </Tr>
  					  </Thead>
  					  <Tbody>
  						{this.state.completed.map((appointment, index) => (
  							<Tr>
  						      <Td>{appointment.patient.user.first_name} {appointment.patient.user.last_name}</Td>
  						      <Td>{appointment.appointment.date}</Td>
  						      <Td>{appointment.appointment.timeslot}</Td>
  						    </Tr>
  						))}
  					  </Tbody>
  					</Table>


			    </TabPanel>
			    <TabPanel>

					<p>Appointments</p>
					<Table variant="simple">
						<Thead>
						  <Tr>
							<Th>Date</Th>
							<Th>Timeslot</Th>
							<Th>Capacity</Th>
						  </Tr>
						</Thead>
						<Tbody>
						  {this.state.appointments.map((appointment, index) => (
							  <Tr>
								<Td>{appointment.date}</Td>
								<Td>{appointment.timeslot}</Td>
								<Td>{appointment.capacity}</Td>
							  </Tr>
						  ))}
						</Tbody>
					  </Table>

					  <AddAppointment
  						reload={this.componentDidMount}
  						authenticated={this.state.authenticated}
  					/>


			    </TabPanel>
			  </TabPanels>
			</Tabs>
	    );
	}
}


export default ProviderPage;
