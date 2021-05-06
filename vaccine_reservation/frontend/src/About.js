import React from 'react';
import { Box, Flex, Text } from "@chakra-ui/react";




function About() {
	return (
		<Flex p={15} bg="blue.50" height="900px" justify="center">
			<Box w="60%">
				<Text color="gray.700" mt="20" fontWeight="semibold" fontSize="2xl">
					This is the Alpaca store. Each purchase comes with a comprehensive guide to caring for your alpaca, and a month worth of supply of your alpaca's favorite snacks!
				</Text>
			</Box>
		</Flex>
	);
}



export default About;
