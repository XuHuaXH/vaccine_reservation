import React from 'react';
import axios from 'axios';
import { Box, Badge, Icon, Flex, Heading, Button, Divider } from "@chakra-ui/react";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import * as Constants from "./Constants.js";

class ProductInfo extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			product: {

			},
			orderSize: 0,
            reviews: [],
            reviewCount: 0,
            rating: 0
		}
	}

	componentDidMount = () => {
		this.fetchProduct();
        this.fetchReviews();
	}

    computeRating = () => {
        let sum = 0.0;
        const reviews = this.state.reviews;
        for (let i = 0; i < reviews.length; ++i) {
            sum += reviews[i].rating;
        }
        const rating = reviews.length === 0 ? 0 : sum / reviews.length;
        this.setState({
            rating: rating
        });
    }

    fetchReviews = () => {
		const token = localStorage.getItem('token');
		const header = {
			headers: {
				Authorization: "JWT " + token
			}
		};
		const data = {
			"id": this.props.id
		}
		axios.post(Constants.BASE_URL + ":" + Constants.PORT + "/list-reviews/", data, header).then( (response) => {
			this.setState({
                reviews: response.data,
				reviewCount: response.data.length,
			});
		}).then(() => this.computeRating());
	}

	fetchProduct = () => {
		const data = {
			"id": this.props.id
		}
		axios.post(Constants.BASE_URL + ":" + Constants.PORT + "/product/", data).then((response) => {
			this.setState({
				product: response.data
			});
			console.log(response.data);
		});
	}

	handleAddToCart = () => {
		const url = Constants.BASE_URL + ":" + Constants.PORT + "/add-item/";
		const token = localStorage.getItem('token');
		const data = {
			"product" : this.props.id,
			"count" : this.state.orderSize
		}
		const header = {
			headers: {
      			Authorization: "JWT " + token
   			}
		};
		axios.post(url, data, header)
		.then((response) => {
			console.log(response.data);
		});
	}

	changeOrderSize = (size) => {
		this.setState({
			orderSize: size
		});
		console.log(this.state.orderSize);
	}



    render() {
		return (
		<Box mt="3" alignItems="center">
			<Heading as="h1" size="xl">
				{this.state.product.name}
			</Heading>
	        <Box mt="3" d="flex" alignItems="baseline">
				<Badge rounded="full" px="2" variantColor="teal">
					New
				</Badge>
				<Box
				color="gray.500"
				fontWeight="semibold"
				letterSpacing="wide"
				fontSize="xs"
				textTransform="uppercase"
				ml="2"
				>
					{this.state.product.short_description}
				</Box>
	        </Box>
	        <Box d="flex" mt="3" fontWeight="semibold" alignItems="center">
	        	${this.state.product.price}
	        </Box>
			<Box d="flex" mt="3" alignItems="center">
	          {Array(5)
	            .fill("")
	            .map((_, i) => (
	              <Icon
				  	name="star"
	                key={i}
	                color={i < this.state.rating ? "teal.500" : "gray.300"}
	              />
	            ))}
	          <Box as="span" ml="2" color="gray.600" fontSize="sm">
	            {this.state.reviewCount} reviews
	          </Box>
	        </Box>


			<Divider />
			<Flex mt="4">
				<NumberInput w="30%" defaultValue={1} min={1} max={20} onChange={this.changeOrderSize}>
					<NumberInputField
                        bg="blue.50"
						borderColor="gray.500" />
					<NumberInputStepper>
					<NumberIncrementStepper borderColor="gray.500" color="gray.500"/>
					<NumberDecrementStepper borderColor="gray.500" color="gray.500"/>
					</NumberInputStepper>
				</NumberInput>
				<Box w="10%"/>
				<Button onClick={this.handleAddToCart} variantColor="teal" size="md">
					Add to cart
				</Button>
			</Flex>

			<Flex mt="3"
			  fontSize="s"
	          lineHeight="tight"
	        >
	        	{this.state.product.long_description}
	        </Flex>
		</Box>
	    );
	}
}


export default ProductInfo;
