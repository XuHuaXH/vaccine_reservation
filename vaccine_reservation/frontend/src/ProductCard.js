import React from 'react';
import axios from 'axios';
import { Box, Image, Badge, Icon } from "@chakra-ui/react";
import {
  Link
} from "react-router-dom";
import * as Constants from "./Constants.js";

// imageUrl: "https://bit.ly/2Z4KKcF"
class ProductCard extends React.Component {

	constructor(props) {
		super(props);
		const product = this.props.product;
		this.state = {
			id: product.id,
			image: '',
			name: product.name,
			formattedPrice: "$" + product.price,
			description: product.short_description,
			reviewCount: 0,
            reviews: [],
			rating: 0
		}
	}

    componentDidMount = () => {
        this.fetchReviews();
        this.fetchImages();
    }

    fetchImages = () => {
		const data = {
			"id": this.props.product.id
		}
		axios.post(Constants.BASE_URL + ":" + Constants.PORT + "/list-images/", data).then((response) => {
			this.setState({
				image: response.data[0]
			});
            console.log(response.data);
		});
	}

    fetchReviews = () => {
		const data = {
			"id": this.props.product.id
		}
		axios.post(Constants.BASE_URL + ":" + Constants.PORT + "/list-reviews/", data).then( (response) => {
			this.setState({
                reviews: response.data,
				reviewCount: response.data.length,
			});
		}).then(() => this.computeRating());
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
        console.log("the rating is " + this.state.rating);
    }



    render() {
		return (
		<Link to={"/product/" + this.state.id}>
	      <Box maxW="sm" borderWidth="1px" rounded="lg" overflow="hidden">
	        <Image height={230} width={350} src={this.state.image.path} alt={this.state.imageAlt} />

	        <Box p="6">
	          <Box d="flex" alignItems="baseline">
	            <Badge rounded="full" px="2" variantColor="teal">
	              New
	            </Badge>
	          </Box>

	          <Box
	            mt="1"
	            fontWeight="semibold"
	            as="h4"
	            lineHeight="tight"
	            isTruncated
	          >
	            {this.state.name}
	          </Box>

	          <Box>
	            {this.state.formattedPrice}
	          </Box>
			  <Box color="gray.600">
	            {this.state.description}
	          </Box>

	          <Box d="flex" mt="2" alignItems="center">
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
	        </Box>
	      </Box>
		  </Link>

	    );
	}
}


export default ProductCard;
