import React from 'react';
import { Button, useColorMode } from "@chakra-ui/react";

function ColorModeButton() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
      <Button
        style={{float: 'right'}}
        onClick={toggleColorMode}
        >
        Toggle {colorMode === "light" ? "Dark" : "Light"}
      </Button>
  );
}


export default ColorModeButton;
