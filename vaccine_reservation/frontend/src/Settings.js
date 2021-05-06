import React from 'react';
import { Box, Heading, Divider } from "@chakra-ui/react";
import AddressCard from "./AddressCard.js";
import AddressForm from "./AddressForm.js";
import OrderCard from "./OrderCard.js";
import axios from 'axios';
import * as Constants from "./Constants.js";



class Settings extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			addresses: [],
			orders: []
		}
	}

	fetchAddresses = () => {
		const token = localStorage.getItem('token');
		const config = {
   			headers: {
      			Authorization: "JWT " + token
   			}
		};
		axios.get(Constants.BASE_URL + ":" + Constants.PORT + "/list-addresses/", config).then((response) => {
			this.setState({
				addresses: response.data,
			});
		});
	}

	fetchOrders = () => {

		const token = localStorage.getItem('token');
		const config = {
   			headers: {
      			Authorization: "JWT " + token
   			}
		}

		axios.get(Constants.BASE_URL + ":" + Constants.PORT + "/list-orders/", config).then( (response) => {
			this.setState({
				orders: response.data,
			});
		}).then(() => {
			console.log(this.state.orders);
		});
	}

	componentDidMount = () => {
		this.fetchAddresses();
		this.fetchOrders();
	}

	render() {
		return (
			<Box bg="blue.50" w="100%" p={16} alignItems="center">
				<Box bg="blue.50" w="100%" p={16} alignItems="center">
					<Heading p={5}>
						Address
					</Heading>
					<Box p={5} style={{ display: this.state.addresses.length === 0 ? "block" : "none" }}>
						No address added yet : (
					</Box>
					<Box alignItems="center" justify="center">
						{this.state.addresses.map((address, index) =>
							<AddressCard
								address={address}
								reload={this.fetchAddresses}
								index={index}/>
						)}
					</Box>
					<Box p={4}>
						<AddressForm reload={this.fetchAddresses} />
					</Box>
				</Box>
				<Divider borderColor="gray.300"/>

				<Box bg="blue.50" w="100%" p={16} alignItems="center">
					<Heading p={5}>
						Orders
					</Heading>
					<Box p={5} style={{ display: this.state.orders.length === 0 ? "block" : "none" }}>
						Placed order will show up here ; )
					</Box>
					<Box alignItems="center" justify="center">
						{this.state.orders.map((order, index) =>
							<OrderCard
								order={order}
								reload={this.fetchOrder}
								index={index}/>
						)}
					</Box>
				</Box>
			</Box>
		);
	}

}



export default Settings;
