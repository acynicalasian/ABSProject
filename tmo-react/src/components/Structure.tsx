/** @jsxImportSource @emotion/react */
import React from 'react';
import { Divider, Stack } from '@mui/joy';
import Navbar from './navbar/Navbar';
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
            <div css={css` background-color: black; width: 87.5%`}/>
        </Stack>
    );
}