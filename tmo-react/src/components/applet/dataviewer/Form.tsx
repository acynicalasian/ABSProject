/** @jsxImportSource @emotion/react */
import React from 'react';
import { useState } from 'react';
import { API_IDLING, API_LOADING } from "./DataViewer";
import { css } from '@emotion/react';
import { Stack, Autocomplete, FormControl, FormLabel, FormHelperText, Input } from '@mui/joy';
import Submitter from './Submitter';

export const ERRSTATE_OK = 0;
export const ERRSTATE_BADBRANCH = 1;
export const ERRSTATE_BADNUM = 2;
export const ERRSTATE_BOTH = 3;

export default function Form(
    // Changing the API state will lead to a rerender in the parent component, which leads to a
    // rerender of this component due to the new prop, so we don't need to set branchlist ourselves
    // in this component.
    props: {
        apiStatus: number,
        apiSetter: (s: number) => void,
        branchlist: string[],
        numSetter: (i: number) => void,     // Record the last number we tried to submit.
    })
{
    // We'll store error state in here instead, so we don't have to rerender the viewing window.
    const [errState, setErrState] = useState(0);
    const errSetter = (n: number) => {
        setErrState(n);
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        // Prevent the page from reloading.
        e.preventDefault();
        alert("testing!");
    };
    return (
        <form onSubmit={handleSubmit}>
            <Stack
                direction="row"
                spacing={2}
                sx={{
                    justifyContent: "flex-start",
                    alignItems: "flex-end",
                }}
                css={css`
                        margin-top: 24px;
                        height: "fit-content";
                        width: "stetch";
                    `}
            >
                <DropdownMenu apiStatus={props.apiStatus} branchlist={props.branchlist} errState={errState}/>
                <NumField apiStatus={props.apiStatus} errState={errState}/>
                <Submitter
                    apiStatus={props.apiStatus}
                    apiSetter={props.apiSetter}
                    errSetter={errSetter}
                />
            </Stack>
        </form>
    );
}

function DropdownMenu(
    props: {
        apiStatus: number,      // We want to know whether our API is still loading branchnames.
        branchlist: string[],
        errState: number,
    })
{
    let errcheck = (props.errState === ERRSTATE_BADBRANCH || props.errState === ERRSTATE_BOTH);
    // These values are determined by the status of the API.
    let placeholdertxt;
    let disableStatus;
    if (props.apiStatus === API_LOADING) {
        placeholdertxt = "Loading...";
        disableStatus = true;
    } else {
        placeholdertxt = "Search for a branch...";
        disableStatus = false;
    }

    // These values are determined by whether or not we just tried to submit bad values.
    let errtxt = (errcheck) ? "No such branch found. Please try again." : "";

    return (
        <FormControl error={props.errState === ERRSTATE_BADBRANCH} disabled={disableStatus}>
            <FormLabel>Branch name</FormLabel>
            <Autocomplete
                freeSolo={true}
                options={props.branchlist}
                placeholder={placeholdertxt}
                type="search"
            />
            <FormHelperText>{errtxt}</FormHelperText>
        </FormControl>
    );
}

function NumField(
    props: {
        apiStatus: number,      // We want to know whether our API is still loading branchnames.
        errState: number,
    })
{
    let errcheck = (props.errState === ERRSTATE_BADNUM || props.errState === ERRSTATE_BOTH);
    // These values are determined by the status of the API.
    let placeholdertxt;
    let disableStatus;
    if (props.apiStatus === API_LOADING) {
        placeholdertxt = "Loading...";
        disableStatus = true;
    } else {
        placeholdertxt = "Enter value...";
        disableStatus = false;
    }

    // These values are determined by whether or not we just tried to submit bad values.
    let errtxt = (errcheck) ? "Please enter an integral value." : "";

    return (
        <FormControl error={props.errState === ERRSTATE_BADBRANCH} disabled={disableStatus}>
            <FormLabel>Number of sellers</FormLabel>
            <Input
                placeholder={placeholdertxt}
                
            />
            <FormHelperText>{errtxt}</FormHelperText>
        </FormControl>
    );
}