import React, { useState } from 'react';
import axios from 'axios';
import PageRedirect from './PageRedirect.js';
import { Box, Button, Input, useDisclosure } from "@chakra-ui/react";
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
import {Redirect} from 'react-router-dom';




function ProviderRegister(props) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const initialRef = React.useRef();
    const [username, setUsername] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [email, setEmail] = useState('');
    const [provider_name, setProvidername] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [type, setType] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    function handleClose() {
        setErrorMessage('');
        onClose();
    }

    function onSubmit() {
		const data = {
			"username" : username,
			"password" : password1,
            "email" : email,
            "provider_name": provider_name,
            "provider_address": address,
            "provider_phone": phone,
            "provider_type": type
    	};

        // check if all fields are filled
        if (data.username === '') {
            setErrorMessage("Username cannot be empty.");
            return;
        }

        if (data.provider_name === '') {
            setErrorMessage("Provider Name cannot be empty.");
            return;
        }

        if (data.password1 === '' || data.password2 === '') {
            setErrorMessage("Password cannot be empty.");
            return;
        }

        if (data.email === '') {
            setErrorMessage("Email cannot be empty.");
            return;
        }

        if (data.address === '') {
            setErrorMessage("Address cannot be empty.");
            return;
        }

        if (data.phone === '') {
            setErrorMessage("Phone cannot be empty.");
            return;
        }

        if (data.type === '') {
            setErrorMessage("Provider Type cannot be empty.");
            return;
        }

        // check if password matches
        if (password1 !== password2) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        // check password length and strength
        var hasNumber = /\d/;
        if (password1.length < 8 || !hasNumber.test(password1)) {
            setErrorMessage("Password needs to be at least 8 characters long, containing both letters and digits.");
            return;
        }

		axios.post(Constants.BASE_URL + ":" + Constants.PORT + "/register-provider/", data).then(function (response) {
			localStorage.setItem('token', response.data.token);
            console.log(response.data.token);
            window.location = Constants.BASE_URL + ":" + Constants.CLIENT + "/provider-page/";
		}).then(handleClose).then(props.reload).catch((error) => {
            if (error.response.status != 201) {
                setErrorMessage("An error occurred.")
            }
        });;
	}


	return (
		<>
	      <Button colorScheme="blue" style={{float: 'right', display: props.authenticated ? 'none' : 'block'}} onClick={onOpen}>Provider Register</Button>

	      <Modal
	        initialFocusRef={initialRef}
	        isOpen={isOpen}
	        onClose={handleClose}
	      >
	        <ModalOverlay />
	        <ModalContent bg="gray.700" color="gray.200">
	          <ModalHeader>Create a new account</ModalHeader>
	          <ModalCloseButton />
	          <ModalBody pb={6}>
	            <FormControl isRequired>
	              <FormLabel>Username</FormLabel>
	              <Input
                    bg="gray.700"
                    ref={initialRef}
                    placeholder="Username"
                    onChange={(e)=>setUsername(e.target.value)}
                    />
	            </FormControl>

	            <FormControl mt={4} isRequired>
	              <FormLabel>Password</FormLabel>
	              <Input
                    type='password'
                    bg="gray.700"
                    placeholder="Password"
                    onChange={(e)=>setPassword1(e.target.value)}
                    />
	            </FormControl>

				<FormControl mt={4} isRequired>
	              <FormLabel>Confirm Password</FormLabel>
	              <Input
                    type='password'
                    bg="gray.700"
                    placeholder="Enter your password again"
                    onChange={(e)=>setPassword2(e.target.value)}
                    />
	            </FormControl>

                <FormControl mt={4} isRequired>
	              <FormLabel>Provider Name</FormLabel>
	              <Input
                    bg="gray.700"
                    ref={initialRef}
                    placeholder="Peppa"
                    onChange={(e)=>setProvidername(e.target.value)}
                    />
	            </FormControl>

				<FormControl mt={4} isRequired>
	              <FormLabel>Email</FormLabel>
	              <Input
                    bg="gray.700"
                    placeholder="Email"
                    onChange={(e)=>setEmail(e.target.value)}
                    />
	            </FormControl>


                <FormControl mt={4} isRequired>
	              <FormLabel>Address</FormLabel>
	              <Input
                    bg="gray.700"
                    ref={initialRef}
                    placeholder="Address"
                    onChange={(e)=>setAddress(e.target.value)}
                    />
	            </FormControl>

                <FormControl mt={4} isRequired>
	              <FormLabel>Phone</FormLabel>
	              <Input
                    bg="gray.700"
                    ref={initialRef}
                    placeholder="Phone"
                    onChange={(e)=>setPhone(e.target.value)}
                    />
	            </FormControl>

                <FormControl mt={4} isRequired>
	              <FormLabel>Provider Type</FormLabel>
	              <Input
                    bg="gray.700"
                    ref={initialRef}
                    placeholder="Hospital/Clinic/Pharmacy"
                    onChange={(e)=>setType(e.target.value)}
                    />
	            </FormControl>
                <Box p={1} color="tomato">
                    {errorMessage}
                </Box>
	          </ModalBody>

	          <ModalFooter>
	            <Button
                    onClick={onSubmit}
                    variant="outline" color="gray.200"
                    mr={3}
                >
	            	Submit
	            </Button>
	            <Button variant="outline" color="gray.200"  onClick={handleClose}>Cancel</Button>
	          </ModalFooter>
	        </ModalContent>
	      </Modal>
	    </>
	);
}


export default ProviderRegister;
