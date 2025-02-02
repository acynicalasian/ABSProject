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
                    width: auto;
                    height: 10%;
                    padding: 8px;
                `}
        >
            <img src={logo} css={css`width:80px;`}/>
            <div css={css`width:auto; padding: 8px;`}>
                <Typography css={css`font-size: 1.25em; margin-left:8px`}>Placeholder Inc.</Typography>
            </div>
        </Stack>
    );
}