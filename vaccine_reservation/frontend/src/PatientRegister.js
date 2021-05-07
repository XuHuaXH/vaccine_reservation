import React, { useState } from 'react';
import axios from 'axios';
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




function PatientRegister(props) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const initialRef = React.useRef();
    const [username, setUsername] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [email, setEmail] = useState('');
    const [first_name, setFirstname] = useState('');
    const [last_name, setLastname] = useState('');
    const [ssn, setSSN] = useState('');
    const [dob, setDOB] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [max_distance, setMaxDistance] = useState('');
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
            "first_name": first_name,
            "last_name": last_name,
            "ssn": ssn,
            "dob": dob,
            "patient_address": address,
            "patient_phone": phone,
            "max_distance": max_distance
    	};

        // check if all fields are filled
        if (data.username === '') {
            setErrorMessage("Username cannot be empty.");
            return;
        }

        if (data.first_name === '') {
            setErrorMessage("First Name cannot be empty.");
            return;
        }

        if (data.last_name === '') {
            setErrorMessage("Last Name cannot be empty.");
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

        if (data.ssn === '') {
            setErrorMessage("SSN cannot be empty.");
            return;
        }

        if (data.dob === '') {
            setErrorMessage("dob cannot be empty.");
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

        if (data.max_distance === '') {
            setErrorMessage("Max Distance cannot be empty.");
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

        // check other fields
        if (!Number.isInteger(parseInt(max_distance)) || parseInt(max_distance) <= 0) {
            setErrorMessage("Max Distance must be a positive integer");
            return;
        }

		axios.post(Constants.BASE_URL + ":" + Constants.PORT + "/register-patient/", data).then(function (response) {
			localStorage.setItem('token', response.data.token);
            console.log(response.data.token);
            return  <Redirect  to="/patient-dashboard/" />
		}).then(handleClose).then(props.reload).catch((error) => {
            if (error.response.status === 404) {
                setErrorMessage("An error occurred.")
            }
        });;
	}


	return (
		<>
	      <Button colorScheme="blue" style={{float: 'right', display: props.authenticated ? 'none' : 'block'}} onClick={onOpen}>Patient Register</Button>

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
                    bg="gray.700"
                    placeholder="Password"
                    onChange={(e)=>setPassword1(e.target.value)}
                    />
	            </FormControl>

				<FormControl mt={4} isRequired>
	              <FormLabel>Confirm Password</FormLabel>
	              <Input
                    bg="gray.700"
                    placeholder="Enter your password again"
                    onChange={(e)=>setPassword2(e.target.value)}
                    />
	            </FormControl>

                <FormControl mt={4} isRequired>
	              <FormLabel>First Name</FormLabel>
	              <Input
                    bg="gray.700"
                    ref={initialRef}
                    placeholder="Peppa"
                    onChange={(e)=>setFirstname(e.target.value)}
                    />
	            </FormControl>

                <FormControl mt={4} isRequired>
	              <FormLabel>Last Name</FormLabel>
	              <Input
                    bg="gray.700"
                    ref={initialRef}
                    placeholder="Pig"
                    onChange={(e)=>setLastname(e.target.value)}
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
	              <FormLabel>SSN</FormLabel>
	              <Input
                    bg="gray.700"
                    ref={initialRef}
                    placeholder="SSN"
                    onChange={(e)=>setSSN(e.target.value)}
                    />
	            </FormControl>

                <FormControl mt={4} isRequired>
	              <FormLabel>Date of Birth</FormLabel>
	              <Input
                    bg="gray.700"
                    ref={initialRef}
                    placeholder="1980-01-01"
                    onChange={(e)=>setDOB(e.target.value)}
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
	              <FormLabel>Max Distance</FormLabel>
	              <Input
                    bg="gray.700"
                    ref={initialRef}
                    placeholder="num of miles you will travel to get a vaccine ;)"
                    onChange={(e)=>setMaxDistance(e.target.value)}
                    />
	            </FormControl>
                <Box p={1} color="tomato">
                    {errorMessage}
                </Box>
	          </ModalBody>

	          <ModalFooter>
	            <Button
                    onClick={onSubmit}
                    variantColor="blue"
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


export default PatientRegister;
