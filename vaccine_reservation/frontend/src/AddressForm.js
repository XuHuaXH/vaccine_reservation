import React, { useState } from 'react';
import axios from 'axios';
import { Button, Input, useDisclosure } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import * as Constants from "./Constants.js";




function AddressForm(props) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const initialRef = React.useRef();
    const [streetNumber, setStreetNumber] = useState('');
    const [streetName, setStreetName] = useState('');
	const [city, setCity] = useState('');
	const [state, setState] = useState('');
	const [zipcode, setZipcode] = useState('');

    function onSubmit() {
		const data = {
			"street_number" : streetNumber,
			"street_name" : streetName,
            "city" : city,
            "state" : state,
			"zipcode" : zipcode,
    	};
		const token = localStorage.getItem('token');
		const header = {
			headers: {
      			Authorization: "JWT " + token
   			}
		};
        console.log(data);
        console.log(header);
		axios.post(Constants.BASE_URL + ":" + Constants.PORT + "/create-address/", data, header).then(function (response) {
            console.log(response.data);
		}).then(onClose).then(props.reload);
	}


	return (
		<>
	      <Button variantColor="teal" size="md" style={{float: 'left'}} onClick={onOpen}>Add address</Button>

	      <Modal
	        initialFocusRef={initialRef}
	        isOpen={isOpen}
	        onClose={onClose}
	      >
	        <ModalOverlay />
	        <ModalContent>
	          <ModalHeader>Create a new address</ModalHeader>
	          <ModalCloseButton />
	          <ModalBody pb={6}>
	            <FormControl isRequired>
	              <FormLabel>Street Number</FormLabel>
	              <Input
                    ref={initialRef}
                    onChange={(e)=>setStreetNumber(e.target.value)}
                    />
	            </FormControl>

	            <FormControl mt={4} isRequired>
	              <FormLabel>Street Name</FormLabel>
	              <Input
                    onChange={(e)=>setStreetName(e.target.value)}
                    />
	            </FormControl>

				<FormControl mt={4} isRequired>
	              <FormLabel>City</FormLabel>
	              <Input
                    onChange={(e)=>setCity(e.target.value)}
                    />
	            </FormControl>

				<FormControl mt={4} isRequired>
	              <FormLabel>State</FormLabel>
	              <Input
                    onChange={(e)=>setState(e.target.value)}
                    />
	            </FormControl>
				<FormControl mt={4} isRequired>
	              <FormLabel>Zipcode</FormLabel>
	              <Input
                    onChange={(e)=>setZipcode(e.target.value)}
                    />
	            </FormControl>
	          </ModalBody>

	          <ModalFooter>
	            <Button
                    onClick={onSubmit}
                    variantColor="blue"
                    mr={3}
                >
	            	Submit
	            </Button>
	            <Button onClick={onClose}>Cancel</Button>
	          </ModalFooter>
	        </ModalContent>
	      </Modal>
	    </>
	);
}


export default AddressForm;
