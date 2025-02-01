import React from 'react';
import './App.css';
import SideBar from './components/SideBar';
import { CssVarsProvider, Divider, Stack, Sheet } from '@mui/joy';

// I think I have to comment this part out when I'm done debugging.
// import { PlasmicCanvasHost, registerComponent } from '@plasmicapp/react-web/lib/host';

function App() {
  return (
    <CssVarsProvider>
      <Sheet>
        <Stack
          direction="row"
          divider={<Divider orientation='vertical'/>}
          spacing={0}
          sx={{
            justifyContent: "flex-start",
            alignItems: "stretch",
          }}
        >
          <SideBar/>
          Lorem ipsum.
        </Stack>
      </Sheet>
    </CssVarsProvider>
  );
}

export default App;
