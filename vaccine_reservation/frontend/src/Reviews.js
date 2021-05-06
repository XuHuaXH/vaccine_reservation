import React from 'react';
import axios from 'axios';
import { Box, Heading } from "@chakra-ui/react";
import ReviewCard from "./ReviewCard.js";
import ReviewEditor from "./ReviewEditor.js";
import * as Constants from "./Constants.js";

class Review extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			reviews: []
		}
	}

	componentDidMount = () => {
		this.fetchReviews();
	}

	fetchReviews = () => {
		const data = {
			"id": this.props.id
		}

		axios.post(Constants.BASE_URL + ":" + Constants.PORT + "/list-reviews/", data).then( (response) => {
			this.setState({
				reviews: response.data,
			});
		});
	}




    render() {
		return (
			<Box bg="yellow.50" align="center" justify="center">
				<ReviewEditor id={this.props.id} reload={this.fetchReviews}/>
				<Box bg="orange.50" w="90%" p={16} alignItems="center">
					<Box p={10} justify="center">
						<Heading as="h1" size="xl" color="gray.600">
							Customer Reviews
						</Heading>
					</Box>
					<Box bg="yellow.50" align="center" justify="center">
						{this.state.reviews.map((review, index) =>
							<ReviewCard review={review} index={index}/>
						)}
					</Box>
				</Box>
			</Box>
	    );
	}
}


export default Review;
