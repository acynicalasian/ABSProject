/** @jsxImportSource @emotion/react */
import React from 'react';
import { Stack, Typography } from '@mui/joy';
import { css } from '@emotion/react';
import logo from "./logo.png";

export default function LogoGroup() {
    return (
        <Stack
            direction="row"
            spacing={0}
            sx={{
                justifyContent: "flex-start",
                alignItems: "center",
            }}
            css={css`
                    width: stretch;
                    height: 10%;
                    padding: 8px;
                `}
        >
            <img src={logo} css={css`width:125px;`}/>
            <div css={css`width:auto; padding: 8px;`}>
                <Typography css={css`font-size: 1.5em; margin-left:8px`}>Placeholder Inc.</Typography>
            </div>
        </Stack>
    );
}