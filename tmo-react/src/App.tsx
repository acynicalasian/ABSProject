import React from 'react';
import './App.css';
import Structure from './components/Structure';
import { CssVarsProvider, Divider, Stack, Sheet } from '@mui/joy';

function App() {
  return (
    <CssVarsProvider>
      <Sheet>
        <Structure/>
      </Sheet>
    </CssVarsProvider>
  );
}

export default App;
