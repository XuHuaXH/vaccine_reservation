import React from 'react';
import axios from 'axios';
import { Box, Button, Flex } from "@chakra-ui/react";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import * as Constants from "./Constants.js";

class CartItemCard extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			product: this.props.item.product,
			count: this.props.item.count,
			id: this.props.item.id
		}
	}

	componentDidMount = () => {
		console.log(this.props.item);
	}

	handleDelete = () => {
		const url = Constants.BASE_URL + ":" + Constants.PORT + "/cart-item/";
		const token = localStorage.getItem('token');
		const config = {
			headers: {
    			Authorization: "JWT " + token
  			},
  			data: {
				"id": this.state.id
			}
		}
		axios.delete(url, config).then(this.props.reload);
	}

	changeOrderSize = (size) => {
		const url = Constants.BASE_URL + ":" + Constants.PORT + "/cart-item/";
		const token = localStorage.getItem('token');
		const data = {
			"id": this.state.id,
			"product": this.state.product.id,
			"count": size
		};
		 const header = {
			 headers: {
       			Authorization: "JWT " + token
    		}
		};
		axios.put(url, data, header).then((response) => {
			console.log(response.data);
		});

	}



    render() {
		const bgColor = this.props.index % 2 === 0 ? "gray.200" : "white";
		return (
			<Flex p={5} w="100%" bg={bgColor}>
				<Box
                p={4}
				w="40%"
				color="black"
				fontWeight="semibold"
				letterSpacing="wide"
				fontSize="xl"
				>
					{this.state.product.name}
				</Box>
				<Flex w="100%" justify="center" alignItems="center">
					<Box p={5} w="90%" fontWeight="semibold" color="gray.700">
						${this.state.product.price}
					</Box>
					<NumberInput w="30%" defaultValue={this.state.count} min={1} max={20} onChange={this.changeOrderSize}>
						<NumberInputField
							borderColor="gray.500" />
						<NumberInputStepper>
						<NumberIncrementStepper borderColor="gray.500" color="gray.500"/>
						<NumberDecrementStepper borderColor="gray.500" color="gray.500"/>
						</NumberInputStepper>
					</NumberInput>
					<Flex w="20%">
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


export default CartItemCard;
