import React from 'react';
import { Box, Flex, Heading, Button, Select } from "@chakra-ui/react";
import CartItemCard from "./CartItemCard.js";
import axios from 'axios';
import * as Constants from "./Constants.js";




class Cart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			items: [],
			addresses: [],
			selectedAddress: -1
		}
	}

	fetchCartItems = () => {
		const token = localStorage.getItem('token');
		const config = {
   			headers: {
      			Authorization: "JWT " + token
   			}
		}

		axios.get(Constants.BASE_URL + ":" + Constants.PORT + "/view-cart/", config)
		.then((response) => {
			console.log(response.data);
			this.setState({
				items: response.data,
			});
		});
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
		}).then(() => {
			console.log(this.state.addresses);
		})
	}

	handleSelect = (e) => {
		this.setState({
			selectedAddress: e.target.value
		});
	}

	componentDidMount = () => {
		this.fetchCartItems();
		this.fetchAddresses();
	}

	handleCheckout = () => {
		if (this.state.selectedAddress === -1) {
			alert("Please select a valid address");
		}
		const token = localStorage.getItem('token');
		const header = {
			headers: {
      			Authorization: "JWT " + token
   			}
		};
		const data = {
			"address": this.state.selectedAddress
		};

		axios.post(Constants.BASE_URL + ":" + Constants.PORT + "/create-order/", data, header)
		.then((response) => {
			console.log(response.data);
			this.setState({
				items: []
			});
		});

	}

	render() {
		return (
			<Flex bg="blue.50" w="100%" height={900} p={16}>
				<Box w="100%" p={16}>
					<Heading p={5}>
						Cart
					</Heading>
					<Box alignItems="center" justify="center">
						{this.state.items.map((item, index) =>
							<CartItemCard
								item={item}
								reload={this.fetchCartItems}
								index={index}/>
						)}
					</Box>
					<Box p={5} style={{ display: this.state.items.length === 0 ? "block" : "none" }}>
						Nothing in cart yet :)
					</Box>
					<Flex p={4} style={{ display: this.state.items.length === 0 ? "none" : 'inline-block' }} w="100%" justify="center" alignItems="center">
						<Select
							w="40%"
							placeholder="Select a shipping address"
							color="black"
							borderColor="black"
							onChange={this.handleSelect}>
							{this.state.addresses.map((address, index) => (
								<option value={address.id}>{address.street_number} {address.street_name}, {address.city}, {address.state} {address.zipcode}</option>
							))}
						</Select>
						<Button mt="2" onClick={this.handleCheckout} variantColor="teal" size="md">
							Checkout
						</Button>
					</Flex>
				</Box>
			</Flex>
		);
	}

}



export default Cart;
