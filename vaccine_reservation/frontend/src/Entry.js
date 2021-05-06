import React from 'react';
import { SimpleGrid, Box, Flex, Text } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react"
import axios from 'axios';
import * as Constants from "./Constants.js";
import Login from './Login.js';
import PatientRegister from './PatientRegister.js';
import ProviderRegister from './ProviderRegister.js';


class Entry extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}

	componentDidMount() {
		let list = [];
		axios.get(Constants.BASE_URL + ":" + Constants.PORT + "/list-products/").then((response) => {
			list = response.data;
			this.setState({
				productList: list
			});
		});
	}

	render() {
		return (
			<Flex bg="blue.50" align="center" justify="center">
				<Box h="800px" p={16} alignItems="center">
					<PatientRegister
						reload={this.componentDidMount}
						authenticated={this.state.authenticated}
					/>
				</Box>
				<Box h="800px" p={16} alignItems="center">
					<ProviderRegister
						reload={this.componentDidMount}
						authenticated={this.state.authenticated}
					/>
				</Box>
				<Box h="800px" p={16} alignItems="center">
					<Login
						reload={this.componentDidMount}
						authenticated={this.state.authenticated}
					/>
				</Box>
			</Flex>
		);
	}
}

export default Entry;
