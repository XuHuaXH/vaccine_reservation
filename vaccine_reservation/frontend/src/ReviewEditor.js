import React from 'react';
import axios from 'axios';
import { Box, Icon, Flex, Heading, Input, Button, Textarea } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import * as Constants from "./Constants.js";

class ReviewEditor extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			rating: 0,
			title: '',
			review: ''
		}
	}


	setRating = (i) => {
		this.setState({
			rating: i
		})
	}

	setTitle = (e) => {
		this.setState({
			title: e.target.value
		});
	}

	setReview = (e) => {
		this.setState({
			review: e.target.value
		});
	}

	handleSubmit = () => {
		let d = new Date();
		const time = d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear();
		const data = {
			"product": this.props.id,
			"time": time,
			"title": this.state.title,
			"review": this.state.review,
			"rating": this.state.rating
		};
        console.log(data);
		const token = localStorage.getItem('token');
		const header = {
			headers: {
      			Authorization: "JWT " + token
   			}
		};
		axios.post(Constants.BASE_URL + ":" + Constants.PORT + "/add-review/", data, header).then(function (response) {
            console.log(response.data);
		}).then(() => {
            this.setState({
                rating: 0,
    			title: '',
    			review: ''
            });
        }).then(this.props.reload);
	}

    render() {
		return (
			<Box bg="yellow.50" align="center" justify="center">
				<Box bg="orange.50" w="90%" p={16} alignItems="center">
					<Box p={10} justify="center">
						<Heading as="h1" size="xl" color="gray.600">
							Write a review
						</Heading>
					</Box>
					<Box bg="yellow.50" align="center" justify="center">
						<FormControl p={3}>
							<Box p={3}>
								<FormLabel htmlFor="title">Title</FormLabel>
								<Input
                                    bg="yellow.50"
                                    value={this.state.title}
									onChange={this.setTitle}
									borderColor="gray.500"
									placeholder="Give your review a short title."/>
							</Box>
							<Box p={3}>
								<FormLabel htmlFor="review">Review</FormLabel>
								<Textarea
                                    bg="yellow.50"
                                    value={this.state.review}
									onChange={this.setReview}
									borderColor="gray.500"
									placeholder="What do you think of this product?"/>
							</Box>
							<Flex>
								<Box p={3} w="30%" fontWeight="semibold" alignItems="center">
				  	            Rating: {Array(5)
				  	              .fill("")
				  	              .map((_, i) => (
				  	                <Button
										width="10px"
										size="lg"
                                        variant="ghost"
                                        variantColor="yellow"
										onClick={() => this.setRating(i + 1)}>
										<Icon
										  size="26px"
										  name="star"
										  key={i}
										  color={i < this.state.rating ? "teal.500" : "gray.300"}
										/>
									</Button>
				  	              ))}
				  	          	</Box>
								<Box p={3}>
									<Button variantColor="teal" size="md" onClick={this.handleSubmit}>
										Submit
									</Button>
								</Box>
							</Flex>
						</FormControl>
					</Box>
				</Box>
			</Box>
	    );
	}
}


export default ReviewEditor;
