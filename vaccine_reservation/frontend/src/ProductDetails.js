import React from 'react';
import {withRouter} from 'react-router';
import { Box } from "@chakra-ui/react";
import OrderPanel from "./OrderPanel.js";
import Reviews from "./Reviews.js";

class ProductDetails extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			id: this.props.match.params.id
		}
	}

	componentDidMount = () => {

	}


    render() {
		return (
			<Box bg="blue.50">
				<OrderPanel id={this.state.id}/>
				<Reviews id={this.state.id}/>
			</Box>
	    );
	}
}


export default withRouter(ProductDetails);
