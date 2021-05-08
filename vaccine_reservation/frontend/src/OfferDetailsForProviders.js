import React, { useState } from 'react';
import axios from 'axios';
import { Text, Button, Input, Stack, Select, useDisclosure } from "@chakra-ui/react";
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





function OfferDetailsForProviders(props) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const initialRef = React.useRef();

	return (
		<>
	      <Button mr={3} variantColor="teal" size="md" onClick={onOpen}>Details</Button>

	      <Modal
	        initialFocusRef={initialRef}
	        isOpen={isOpen}
	        onClose={onClose}
	      >
	        <ModalOverlay />
	        <ModalContent>
	          <ModalHeader>Offer Details</ModalHeader>
	          <ModalCloseButton />
	          <ModalBody pb={6}>
			  <Stack spacing={3}>
			  <Text fontSize="md">Patient First Name: {props.offer.patient.user.first_name}</Text>
			  <Text fontSize="md">Patient Last Name: {props.offer.patient.user.last_name}</Text>
			  <Text fontSize="md">Patient Email: {props.offer.patient.user.email}</Text>
			  <Text fontSize="md">Patient Date of Birth: {props.offer.patient.dob}</Text>
			  <Text fontSize="md">Patient Phone: {props.offer.patient.patient_phone}</Text>
			  <Text fontSize="md">Appointment Date: {props.offer.appointment.date}</Text>
			  <Text fontSize="md">Appointment Time: {props.offer.appointment.timeslot}</Text>
			</Stack>


	          </ModalBody>

	          <ModalFooter>
	            <Button onClick={onClose}>Close</Button>
	          </ModalFooter>
	        </ModalContent>
	      </Modal>
	    </>
	);
}


export default OfferDetailsForProviders;
