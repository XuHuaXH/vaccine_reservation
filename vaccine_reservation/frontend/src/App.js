import React from 'react';
import './App.css';
import Entry from './Entry.js';
import { ChakraProvider } from "@chakra-ui/react"
import { ColorModeProvider, ThemeProvider, CSSReset } from '@chakra-ui/react';


function App() {
  return (
     <ChakraProvider>
        <CSSReset />
        <Entry />
     </ChakraProvider>
  );
}

export default App;
