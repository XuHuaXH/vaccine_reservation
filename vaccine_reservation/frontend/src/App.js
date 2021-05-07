import React from 'react';
import './App.css';
import Router from './RouterPage.js';
import { ChakraProvider } from "@chakra-ui/react"
import { ColorModeProvider, ThemeProvider, CSSReset } from '@chakra-ui/react';


function App() {
  return (
     <ChakraProvider>
        <CSSReset />
        <Router />
     </ChakraProvider>
  );
}

export default App;
