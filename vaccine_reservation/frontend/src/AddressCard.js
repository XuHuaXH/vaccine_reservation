import React from 'react';
import axios from 'axios';
import { Box, Heading, Button, Flex } from "@chakra-ui/react";
import AddressEditor from "./AddressEditor.js";
import * as Constants from "./Constants.js";

class AddressCard extends React.Component {

	handleDelete = () => {
		const url = Constants.BASE_URL + ":" + Constants.PORT + "/address/";
		const token = localStorage.getItem('token');
		const config = {
			headers: {
    			Authorization: "JWT " + token
  			},
  			data: {
    			id: this.props.address.id
			}
		}
		axios.delete(url, config).then(this.props.reload());
	}


    render() {
		const address = this.props.address;
		const bgColor = this.props.index % 2 === 0 ? "gray.200" : "white";
		return (
			<Flex p={5} w="100%" bg={bgColor}>
				<Heading fontSize="xl">{address.name}</Heading>
				<Flex w="100%" justify="center" alignItems="center">
					<Box p={5} w="90%">{address.street_number} {address.street_name}, {address.city}, {address.state} {address.zipcode}
					</Box>
					<Flex w="20%">
						<Box p={2}>
							<AddressEditor address={address} reload={this.props.reload}/>
						</Box>
						<Box p={2}>
							<Button onClick={this.handleDelete} variantColor="teal" size="md">
							Delete
							</Button>
						</Box>
					</Flex>
				</Flex>
    		</Flex>
	    );
	}
}


export default AddressCard;
