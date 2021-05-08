import React from 'react';
import './App.css';
import Entry from './Entry.js';
import Logout from './Logout.js';
import OfferDetails from './OfferDetails.js';
import PatientProfile from './PatientProfile.js';
import AddAvailability from './AddAvailability.js';
import axios from 'axios';
import * as Constants from "./Constants.js";
import { ChakraProvider } from "@chakra-ui/react"
import { Heading, Center, Box, Flex, Button, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
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
} from "@chakra-ui/react"


class PatientPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			currentOfferList: [],
			scheduledAppointmentList: [],
			expiredOfferList: [],
			pastOfferList: [],
			availabilities: []
		}
	}

	onDeleteAvailability(availability) {
		const token = localStorage.getItem('token');
		const config = {
			headers: {
    			Authorization: "Token " + token
  			},
  			data: availability
		}
		axios.delete(Constants.BASE_URL + ":" + Constants.PORT + "/delete-availability/", config).then((response) => {
			console.log(response);
			this.componentDidMount();
		});
	}

	onCancel(id) {
		const token = localStorage.getItem('token');
		const header = {
   			headers: {
      			Authorization: "Token " + token
   			}
		};
		const data = {
			"id": id
		}
		axios.post(Constants.BASE_URL + ":" + Constants.PORT + "/cancel-appointment/", data, header).then((response) => {
			console.log(response);
			this.componentDidMount();
		});
	}

	onResponse(id, accept) {
		const accepted = accept ? 1 : 0;
		const token = localStorage.getItem('token');
		const header = {
   			headers: {
      			Authorization: "Token " + token
   			}
		};
		const data = {
			"id": id,
			"accepted": accepted
		}
		axios.post(Constants.BASE_URL + ":" + Constants.PORT + "/offer-response/", data, header).then((response) => {
			console.log(response);
            this.componentDidMount();
		});
	}

	onAccept(id) {
		this.onResponse(id, true);
	}

	onDecline(id) {
		this.onResponse(id, false);
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

    componentDidMount= () => {
		let list = [];
		const token = localStorage.getItem('token');
		const config = {
   			headers: {
      			Authorization: "Token " + token
   			}
		};
		axios.get(Constants.BASE_URL + ":" + Constants.PORT + "/patient-current-offers/", config).then((response) => {
			list = response.data;
			this.setState({
				currentOfferList: list
			});
		});

		axios.get(Constants.BASE_URL + ":" + Constants.PORT + "/patient-scheduled-appointments/", config).then((response) => {
			this.setState({
				scheduledAppointmentList: response.data
			});
		});

		axios.get(Constants.BASE_URL + ":" + Constants.PORT + "/patient-expired-offers/", config).then((response) => {
			list = response.data;
			this.setState({
				expiredOfferList: list
			});
		});

		axios.get(Constants.BASE_URL + ":" + Constants.PORT + "/patient-past-offers/", config).then((response) => {
			list = response.data;
			this.setState({
				pastOfferList: list
			});
		});

		axios.get(Constants.BASE_URL + ":" + Constants.PORT + "/get-availability/", config).then((response) => {
			list = response.data;
			this.setState({
				availabilities: list
			});
		});
    }



    render() {
		return (
			<Tabs>
			  <TabList>
			    <Tab>Dashboard</Tab>
			    <Tab>Settings</Tab>
				<Tab>Profile</Tab>
				<Logout />
			  </TabList>

			  <TabPanels>
			    <TabPanel>
				<Heading as="h2" size="lg">
					Current Offers
				</Heading>
				  <Table mt={4} variant="simple">
					  <Thead>
					    <Tr>
					      <Th>Provider Name</Th>
					      <Th>Appointment Date</Th>
						  <Th>Appointment Time</Th>
						  <Th>Offer Expires</Th>
						  <Th>Actions</Th>
					    </Tr>
					  </Thead>
					  <Tbody>
						{this.state.currentOfferList.map((offer, index) => (
							<Tr>
						      <Td>{offer.appointment.provider.provider_name}</Td>
						      <Td>{offer.appointment.date}</Td>
						      <Td>{offer.appointment.timeslot}</Td>
							  <Td>{offer.expiration_datetime}</Td>
							  <Td>
							    <OfferDetails offer={offer}/>
							  	<Button onClick={() => this.onAccept(offer.id)} colorScheme="blue" mr={3}>
			  	            	Accept
			  	            	</Button>
								<Button onClick={() => this.onDecline(offer.id)} colorScheme="red" mr={3}>
			  	            	Decline
			  	            	</Button>
							  </Td>
						    </Tr>
						))}
					  </Tbody>
					</Table>

					<Box h='60px' />

					<Heading as="h2" size="lg">
    					Scheduled Offers
    				</Heading>
  				  <Table mt={4} variant="simple">
  					  <Thead>
  					    <Tr>
  					      <Th>Provider Name</Th>
  					      <Th>Appointment Date</Th>
  						  <Th>Appointment Time</Th>
						  <Th>Actions</Th>
  					    </Tr>
  					  </Thead>
  					  <Tbody>
  						{this.state.scheduledAppointmentList.map((offer, index) => (
  							<Tr>
  						      <Td>{offer.appointment.provider.provider_name}</Td>
  						      <Td>{offer.appointment.date}</Td>
  						      <Td>{offer.appointment.timeslot}</Td>
							  <Td>
							    <OfferDetails offer={offer}/>
								<Button onClick={() => this.onCancel(offer.id)} colorScheme="red" mr={3}>
			  	            	Cancel
			  	            	</Button>
							  </Td>
  						    </Tr>
  						))}
  					  </Tbody>
  					</Table>

					<Box h='60px' />

					<Heading as="h2" size="lg">
						Expired Offers
					</Heading>
  				  <Table mt={4} variant="simple">
  					  <Thead>
  					    <Tr>
  					      <Th>Provider Name</Th>
  					      <Th>Appointment Date</Th>
  						  <Th>Appointment Time</Th>
  						  <Th>Offer Expired</Th>
  					    </Tr>
  					  </Thead>
  					  <Tbody>
  						{this.state.expiredOfferList.map((offer, index) => (
  							<Tr>
  						      <Td>{offer.appointment.provider.provider_name}</Td>
  						      <Td>{offer.appointment.date}</Td>
  						      <Td>{offer.appointment.timeslot}</Td>
  							  <Td>{offer.expiration_datetime}</Td>
  						    </Tr>
  						))}
  					  </Tbody>
  					</Table>

					<Box h='60px' />

					<Heading as="h2" size="lg">
						Past Offers
					</Heading>
  				  <Table mt={4} variant="simple">
  					  <Thead>
  					    <Tr>
  					      <Th>Provider Name</Th>
  					      <Th>Appointment Date</Th>
  						  <Th>Appointment Time</Th>
						  <Th>Response</Th>
  						  <Th>Status</Th>
  					    </Tr>
  					  </Thead>
  					  <Tbody>
  						{this.state.pastOfferList.map((offer, index) => (
  							<Tr>
  						      <Td>{offer.appointment.provider.provider_name}</Td>
  						      <Td>{offer.appointment.date}</Td>
  						      <Td>{offer.appointment.timeslot}</Td>
							  <Td>{offer.accepted ? 'Accepted' : 'Declined'}</Td>
  							  <Td>{offer.accepted ? offer.status : 'Declined'}</Td>
  						    </Tr>
  						))}
  					  </Tbody>
  					</Table>
			    </TabPanel>
			    <TabPanel>

				<Heading as="h2" size="lg">
					Availabilities
				</Heading>
					<Table mt={4} variant="simple">
						<Thead>
						  <Tr>
							<Th>Day of week</Th>
							<Th>Timeslot</Th>
						  </Tr>
						</Thead>
						<Tbody>
						  {this.state.availabilities.map((availability, index) => (
							  <Tr>
								<Td>{availability.day_of_week}</Td>
								<Td>{availability.timeslot}</Td>
								<Td>
								  <Button onClick={() => this.onDeleteAvailability(availability)} colorScheme="red" mr={3}>
								  Delete
								  </Button>
								</Td>
							  </Tr>
						  ))}
						</Tbody>
					  </Table>


					  <AddAvailability
  						reload={this.componentDidMount}
  						authenticated={this.state.authenticated}
  					/>

			    </TabPanel>

				<TabPanel>
					<PatientProfile />
				</TabPanel>
			  </TabPanels>
			</Tabs>
	    );
	}
}


export default PatientPage;
