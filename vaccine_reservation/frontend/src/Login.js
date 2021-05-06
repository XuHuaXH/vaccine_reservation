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





function Login(props) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const initialRef = React.useRef();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    function handleClose() {
        setErrorMessage('');
        onClose();
    }
	function onSubmit() {

		const data = {
			"username" : username,
			"password" : password
    	};
		axios.post(Constants.BASE_URL + ":" + Constants.PORT + "/login/", data).then(function (response) {
			localStorage.setItem('token', response.data.token);
            return  <Redirect  to="/patient-dashboard/" />
		}).then(handleClose).then(props.reload).catch((error) => {
            if (error.response.status === 404) {
                setErrorMessage("Invalid credentials.")
            }
        });
	}




	return (
		<>
	      <Button colorScheme="blue" style={{float: 'right', display: props.authenticated ? 'none' : 'block'}} onClick={onOpen}>Login</Button>

	      <Modal
	        initialFocusRef={initialRef}
	        isOpen={isOpen}
	        onClose={handleClose}
	      >
	        <ModalOverlay />
	        <ModalContent bg="gray.700" color="gray.200">
	          <ModalHeader>Login to your account</ModalHeader>
	          <ModalCloseButton />
	          <ModalBody pb={6}>
	            <FormControl isRequired>
	              <FormLabel>Username</FormLabel>
	              <Input
				  	ref={initialRef}
					placeholder="Username"
                    bg="gray.700"
					onChange={(e)=>setUsername(e.target.value)}
					/>
	            </FormControl>

	            <FormControl mt={4} isRequired>
	              <FormLabel>Password</FormLabel>
	              <Input
				  	placeholder="Password"
                    bg="gray.700"
					onChange={(e)=>setPassword(e.target.value)}
					/>
	            </FormControl>
                <Box p={1} color="tomato">
                    {errorMessage}
                </Box>
	          </ModalBody>

	          <ModalFooter>
	            <Button onClick={onSubmit} variantColor="blue" mr={3}>
	            	Submit
	            </Button>
	            <Button variant="outline" color="gray.200" onClick={handleClose}>Cancel</Button>
	          </ModalFooter>
	        </ModalContent>
	      </Modal>
	    </>
	);
}


export default Login;
