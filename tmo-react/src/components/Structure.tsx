/** @jsxImportSource @emotion/react */
import React from 'react';
import { Divider, Stack } from '@mui/joy';
import Navbar from './navbar/Navbar';
import DataViewer from './applet/Applet';
import { css } from '@emotion/react';

export default function Structure() {
    return (
        <Stack
            direction="row"
            divider={<Divider orientation='vertical'/>}
            spacing={0}
            sx={{
                justifyContent: "flex-start",
                alignItems: "stretch",
            }}
            css={css`
                height: 100vh;
                width: 100vw;
            `}
        >
            <Navbar/>
            <DataViewer/>
        </Stack>
    );
}