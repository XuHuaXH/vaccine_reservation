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





function AddAvailability(props) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const initialRef = React.useRef();
    const [day_of_week, setDayofweek] = useState('');
    const [timeslot, setTimeslot] = useState('');

    function onSubmit() {
		const data = {
			"day_of_week" : day_of_week,
			"timeslot" : timeslot,
    	};
		const token = localStorage.getItem('token');
		const header = {
			headers: {
      			Authorization: "Token " + token
   			}
		};
        console.log(data);
        console.log(header);
		axios.post(Constants.BASE_URL + ":" + Constants.PORT + "/add-availability/", data, header).then(function (response) {
            console.log(response.data);
		}).then(onClose).then(props.reload);
	}


	return (
		<>
	      <Button variantColor="teal" size="md" style={{float: 'left'}} onClick={onOpen}>Add Availability</Button>

	      <Modal
	        initialFocusRef={initialRef}
	        isOpen={isOpen}
	        onClose={onClose}
	      >
	        <ModalOverlay />
	        <ModalContent>
	          <ModalHeader>Add an availability</ModalHeader>
	          <ModalCloseButton />
	          <ModalBody pb={6}>
	            <FormControl isRequired>
	              <FormLabel>Day of Week</FormLabel>
				  <RadioGroup onChange={setDayofweek} value={day_of_week}>
				  	 <Stack direction="column">
					  <Radio value="Monday">Monday</Radio>
					  <Radio value="Tuesday">Tuesday</Radio>
					  <Radio value="Wednesday">Wednesday</Radio>
					  <Radio value="Thursday">Thursday</Radio>
					  <Radio value="Friday">Friday</Radio>
					  <Radio value="Saturday">Saturday</Radio>
					  <Radio value="Sunday">Sunday</Radio>
					 </Stack>
					</RadioGroup>
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


export default AddAvailability;
