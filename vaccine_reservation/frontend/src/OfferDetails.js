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





function OfferDetails(props) {
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
			  <Text fontSize="md">Provider: {props.offer.appointment.provider.provider_name}</Text>
			  <Text fontSize="md">Provider Phone: {props.offer.appointment.provider.provider_phone}</Text>
			  <Text fontSize="md">Provider Type: {props.offer.appointment.provider.provider_type}</Text>
			  <Text fontSize="md">Appointment Address: {props.offer.appointment.provider.provider_address}</Text>
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


export default OfferDetails;
