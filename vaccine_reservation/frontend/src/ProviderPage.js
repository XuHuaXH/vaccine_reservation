import React from 'react';
import './App.css';
import Entry from './Entry.js';
import Logout from './Logout.js';
import ProviderProfile from './ProviderProfile.js';
import OfferDetailsForProviders from './OfferDetailsForProviders.js';
import AddAppointment from './AddAppointment.js';
import axios from 'axios';
import * as Constants from "./Constants.js";
import { ChakraProvider } from "@chakra-ui/react"
import { HStack,Container, Box, Heading, Button, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
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
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
} from "@chakra-ui/react"
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

    onMark(id, action) {
		const token = localStorage.getItem('token');
		const header = {
   			headers: {
      			Authorization: "Token " + token
   			}
		};
		const data = {
			"id": id,
			"action": action
		}
		axios.post(Constants.BASE_URL + ":" + Constants.PORT + "/provider-appointment-action/", data, header).then((response) => {
			console.log(response);
            this.componentDidMount();
		});
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
				<Tab>Profile</Tab>
				<Logout />
			  </TabList>

			  <TabPanels>
			    <TabPanel>
				<HStack mt={4} spacing="24px">
				<Stat>
				  <StatLabel>Scheduled</StatLabel>
				  <StatNumber>{this.state.summary.scheduled}</StatNumber>
				  <StatHelpText># of scheduled appointments</StatHelpText>
				</Stat>
				<Stat>
				  <StatLabel>Missed</StatLabel>
				  <StatNumber>{this.state.summary.missed}</StatNumber>
				  <StatHelpText># of missed appointments</StatHelpText>
				</Stat>
				<Stat>
				  <StatLabel>Cancelled</StatLabel>
				  <StatNumber>{this.state.summary.cancelled}</StatNumber>
				  <StatHelpText># of cancelled appointments</StatHelpText>
				</Stat>
				<Stat>
				  <StatLabel>Completed</StatLabel>
				  <StatNumber>{this.state.summary.completed}</StatNumber>
				  <StatHelpText># of completed appointments</StatHelpText>
				</Stat>
				<Stat>
				  <StatLabel>Waiting</StatLabel>
				  <StatNumber>{this.state.summary.waiting_for_response}</StatNumber>
				  <StatHelpText># of appointments waiting for response</StatHelpText>
				</Stat>
				</HStack>

				<Box h='50px' />

				<Heading as="h2" size="lg">
				  Scheduled Appointments
			  </Heading>
				  <Table mt={4} variant="simple">
					  <Thead>
					    <Tr>
					      <Th>Patient Name</Th>
					      <Th>Appointment Date</Th>
						  <Th>Appointment Time</Th>
                          <Th>Mark as</Th>
                          <Th>Details</Th>

					    </Tr>
					  </Thead>
					  <Tbody>
						{this.state.scheduled.map((appointment, index) => (
							<Tr>
							<Td>{appointment.patient.user.first_name} {appointment.patient.user.last_name}</Td>
							<Td>{appointment.appointment.date}</Td>
							<Td>{appointment.appointment.timeslot}</Td>
                            <Td><Button onClick={() => this.onMark(appointment.id, 'completed')} colorScheme="blue" m={3}>
                            Completed
                            </Button>
                            <Button onClick={() => this.onMark(appointment.id, 'missed')} colorScheme="red" m={3}>
                            Missed
                            </Button>
                            </Td>
                            <Td><OfferDetailsForProviders offer={appointment} /></Td>
						    </Tr>
						))}
					  </Tbody>
					</Table>

					<Box h='60px' />

					<Heading as="h2" size="lg">
					  Cancelled Appointments
				  </Heading>
  				  <Table mt={4} variant="simple">
  					  <Thead>
  					    <Tr>
  					      <Th>Patient Name</Th>
  					      <Th>Appointment Date</Th>
  						  <Th>Appointment Time</Th>
                          <Th>Details</Th>
  					    </Tr>
  					  </Thead>
  					  <Tbody>
  						{this.state.cancelled.map((appointment, index) => (
  							<Tr>
							<Td>{appointment.patient.user.first_name} {appointment.patient.user.last_name}</Td>
							<Td>{appointment.appointment.date}</Td>
							<Td>{appointment.appointment.timeslot}</Td>
                            <Td><OfferDetailsForProviders
                            offer={appointment} /></Td>
  						    </Tr>
  						))}
  					  </Tbody>
  					</Table>
					<Box h='60px' />

					<Heading as="h2" size="lg">
					  Missed Appointments
				  </Heading>
  				  <Table mt={4} variant="simple">
  					  <Thead>
  					    <Tr>
  					      <Th>Patient Name</Th>
  					      <Th>Appointment Date</Th>
  						  <Th>Appointment Time</Th>
                          <Th>Details</Th>
  					    </Tr>
  					  </Thead>
  					  <Tbody>
  						{this.state.missed.map((appointment, index) => (
  							<Tr>
							<Td>{appointment.patient.user.first_name} {appointment.patient.user.last_name}</Td>
							<Td>{appointment.appointment.date}</Td>
							<Td>{appointment.appointment.timeslot}</Td>
                            <Td><OfferDetailsForProviders offer={appointment} /></Td>
  						    </Tr>
  						))}
  					  </Tbody>
  					</Table>
					<Box h='60px' />

					<Heading as="h2" size="lg">
					  Completed Appointments
				  </Heading>
  				  <Table mt={4} variant="simple">
  					  <Thead>
  					    <Tr>
  					      <Th>Patient Name</Th>
  					      <Th>Appointment Date</Th>
  						  <Th>Appointment Time</Th>
                           <Th>Details</Th>
  					    </Tr>
  					  </Thead>
  					  <Tbody>
  						{this.state.completed.map((appointment, index) => (
  							<Tr>
  						      <Td>{appointment.patient.user.first_name} {appointment.patient.user.last_name}</Td>
  						      <Td>{appointment.appointment.date}</Td>
  						      <Td>{appointment.appointment.timeslot}</Td>
                              <Td><OfferDetailsForProviders offer={appointment} /></Td>
  						    </Tr>
  						))}
  					  </Tbody>
  					</Table>


			    </TabPanel>
			    <TabPanel>

				<Heading as="h2" size="lg">
				  Appointments
			  </Heading>
					<Table mt={4} variant="simple">
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

				<TabPanel>
					<ProviderProfile />
				</TabPanel>
			  </TabPanels>
			</Tabs>
	    );
	}
}


export default ProviderPage;
