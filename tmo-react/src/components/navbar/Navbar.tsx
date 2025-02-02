/** @jsxImportSource @emotion/react */
import React from 'react';
import { Stack, Button, Typography, ListItemContent } from '@mui/joy';
import {List, ListItem, ListItemButton } from '@mui/joy';
import { css } from '@emotion/react';
import LogoGroup from './LogoGroup';

function ButtonList() {
    return (
        <List
            css={css`
                    padding: 8px;
                    height: stretch;
                    width: stretch;
                `}
        >
            <div id="padding" css={css`height: 5%`}/>
            <BLButton s={true} t={"Analyze Branch Data"}/>
            <BLButton s={false} t={"Placeholder Link 1"}/>
            <BLButton s={false} t={"Placeholder Link 2"}/>
        </List>
    )
}

function BLButton(props: {s: boolean, t: string}) {
    return (
        <ListItem
            css={css`
                    height: 5%;
                `}
        >
            <ListItemButton
                selected={props.s}
            > 
                <ListItemContent>{props.t}</ListItemContent>
            </ListItemButton>
        </ListItem>
    );
}

export default function Navbar() {
    return (
        <Stack
            direction="column"
            spacing={0}
            sx={{
                justifyContent: "flex-start",
                alignItems: "flex-start",
            }}
            css={css`
                    width: 12.5%;
                    height: stretch;
                    padding: 8px;
                `}
        >
            <LogoGroup/>
            <ButtonList />
        </Stack>
    );
}