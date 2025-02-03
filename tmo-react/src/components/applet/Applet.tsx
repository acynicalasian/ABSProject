/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from "@emotion/react";
import { Breadcrumbs, Link, Stack } from "@mui/joy";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DataViewer from './dataviewer/DataViewer';

function PathLink(props: {str: string, icon: boolean}) {
    return (
        <Link
            component='p'
            underline="none"
            color="neutral"
            variant="plain"
            startDecorator={props.icon ? <HomeRoundedIcon/> : null}
            sx={{
                '&:hover': {
                    color: "inherit",
                    backgroundColor: "transparent",
                }
            }}
        >
            {props.str}
        </Link>
    );
}

function Path() {
    return (
      <Breadcrumbs size="sm">
        <PathLink str="" icon={true}/>
        <PathLink str="Analyze Branch Data" icon={false}/>
      </Breadcrumbs>
    );
}

export default function Applet() {
    return (
        // This stack should help center our "viewport" vertically.
        <Stack
            direction="column"
            spacing={0}
            sx={{
                justifyContent: "flex-start",
                alignItems: "flex-start",
            }}
            css={css`
                    width: stretch;
                    height: stretch;
                    padding-top: 48px;
                    padding-bottom: 48px;
                    padding-left: 96px;
                    padding-right: 96px;
                    background-color: #FFF;
                `}
        >
            <Path/>
            <DataViewer/>
        </Stack>
    );
}