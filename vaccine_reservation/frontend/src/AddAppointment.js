import React, { useState } from 'react';
import axios from 'axios';
import { Button, Input, Stack, Select, useDisclosure } from "@chakra-ui/react";
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
	const [capacity, setCapacity] = useState('');

    function onSubmit() {
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
        console.log(data);
        console.log(header);
		axios.post(Constants.BASE_URL + ":" + Constants.PORT + "/add-appointment/", data, header).then(function (response) {
            console.log(response.data);
		}).then(onClose).then(props.reload);
	}


	return (
		<>
	      <Button colorScheme="blue" size="md" style={{float: 'left'}} onClick={onOpen}>Add Appointment</Button>

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


export default AddAppointment;
