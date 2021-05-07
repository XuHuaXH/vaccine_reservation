import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Input, Stack, Select, useDisclosure } from "@chakra-ui/react";
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
import { Radio, RadioGroup } from "@chakra-ui/react"





function AddAppointment(props) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const initialRef = React.useRef();
    const [date, setDate] = useState('');
    const [timeslot, setTimeslot] = useState('');
	const [capacity, setCapacity] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');

    function handleClose() {
        setErrorMessage('');
        onClose();
    }

    function onSubmit() {

        if (date === '') {
            setErrorMessage("Date cannot be empty.");
            return;
        }

        if (timeslot === '') {
            setErrorMessage("Timeslot cannot be empty.");
            return;
        }

        if (capacity === '') {
            setErrorMessage("Capacity cannot be empty.");
            return;
        }

        const dateFormat = /^\d{4}\-\d{2}\-\d{2}$/;
        if (!dateFormat.test(date)) {
            setErrorMessage("Date format must be YYYY-MM-DD");
            return;
        }

        if (!Number.isInteger(Number(capacity)) || capacity <= 0) {
            setErrorMessage("Capacity must be a positive integer.");
            return;
        }
		const data = {
			"date" : date,
			"timeslot" : timeslot,
			"capacity": capacity
    	};
		const token = localStorage.getItem('token');
		const header = {
			headers: {
      			Authorization: "Token " + token
   			}
		};
		axios.post(Constants.BASE_URL + ":" + Constants.PORT + "/add-appointment/", data, header).then(function (response) {
            console.log(response.data);
		}).then(onClose).then(props.reload);
	}


	return (
		<>
	      <Button mt={4} colorScheme="blue" size="md" style={{float: 'left'}} onClick={onOpen}>Add Appointment</Button>

	      <Modal
	        initialFocusRef={initialRef}
	        isOpen={isOpen}
	        onClose={onClose}
	      >
	        <ModalOverlay />
	        <ModalContent>
	          <ModalHeader>Add an appointment</ModalHeader>
	          <ModalCloseButton />
	          <ModalBody pb={6}>
			  <FormControl mt={4} isRequired>
				<FormLabel>Date</FormLabel>
				<Input
				  ref={initialRef}
				  placeholder="2021-06-15"
				  onChange={(e)=>setDate(e.target.value)}
				  />
			  </FormControl>

	            <FormControl mt={4} isRequired>
	              <FormLabel>Timeslot</FormLabel>
				  <RadioGroup onChange={setTimeslot} value={timeslot}>
				      <Stack direction="row">
				        <Radio value="08:00:00">8AM</Radio>
				        <Radio value="12:00:00">12PM</Radio>
				        <Radio value="16:00:00">4PM</Radio>
				      </Stack>
				    </RadioGroup>
	            </FormControl>

				<FormControl mt={4} isRequired>
	              <FormLabel>Capacity</FormLabel>
	              <Input
				  	ref={initialRef}
					placeholder="30"
					onChange={(e)=>setCapacity(e.target.value)}
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
	            <Button onClick={handleClose}>Cancel</Button>
	          </ModalFooter>
	        </ModalContent>
	      </Modal>
	    </>
	);
}


export default AddAppointment;
