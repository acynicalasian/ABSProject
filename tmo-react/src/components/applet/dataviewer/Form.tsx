/** @jsxImportSource @emotion/react */
import React from 'react';
import { useState } from 'react';
import { API_IDLING, API_LOADING } from "./DataViewer";
import { css } from '@emotion/react';
import { Stack, Autocomplete, FormControl, FormLabel, FormHelperText, Input } from '@mui/joy';
import Submitter from './Submitter';
import { TEMPLATE_SELLERDATA } from './DataViewer';

export const ERRSTATE_OK = 0;
export const ERRSTATE_BADVAL = 1;
export const ERRSTATE_EMPTYVAL = 2;

export default function Form(
    // Changing the API state will lead to a rerender in the parent component, which leads to a
    // rerender of this component due to the new prop, so we don't need to set branchlist ourselves
    // in this component.
    props: {
        apiStatus: number,
        apiSetter: (s: number) => void,
        branchlist: string[],
        branchSetter: (arr: string[]) => void,     // Set branchlist if we refresh database.
        numSetter: (i: number) => void,     // Set the number of top sellers to show in the viewer.
        sellerDataSetter: (obj: typeof TEMPLATE_SELLERDATA) => void,
    })
{
    // Store error states of each text entry field here. We need to declare it here so we can set
    // an error state if needed when we handle onSubmit.
    const [errStateBranch, setErrStateBranch] = useState(ERRSTATE_OK);
    const errSetterBranch = (n: number) => {
        setErrStateBranch(n);
    };
    const [errStateNum, setErrStateNum] = useState(ERRSTATE_OK);
    const errSetterNum = (n: number) => {
        setErrStateNum(n);
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        // Prevent the page from reloading.
        e.preventDefault();
        
    };
    return (
        <form onSubmit={handleSubmit} css={css`width: stretch;`}>
            <Stack
                direction="row"
                spacing={2}
                sx={{
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                }}
                css={css`
                        margin-top: 24px;
                        height: "fit-content";
                    `}
            >
                <DropdownMenu
                    apiStatus={props.apiStatus}
                    branchlist={props.branchlist}
                    errState={errStateBranch}
                    errSetter={errSetterBranch}
                />
                <NumField
                    apiStatus={props.apiStatus}
                    errState={errStateNum}
                    errSetter={errSetterNum}
                />
                <Submitter
                    apiStatus={props.apiStatus}
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
        // We need this if we type after getting an error that we tried to submit an empty form.
        errSetter: (n: number) => void,
    })
{
    let errcheck = (props.errState === ERRSTATE_BADVAL || props.errState === ERRSTATE_EMPTYVAL);
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
    let errtxt;
    if (props.errState === ERRSTATE_BADVAL)
        errtxt = "No such branch found. Please try again.";
    else if (props.errState === ERRSTATE_EMPTYVAL)
        errtxt = "Please submit a value.";
    else errtxt = "";
    return (
        <FormControl error={errcheck} disabled={disableStatus} sx={{ width: "stretch" }}>
            <FormLabel>Branch name</FormLabel>
            <Autocomplete
                name="branchInput"
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
        errSetter: (n: number) => void,
    })
{
    let errcheck = (props.errState === ERRSTATE_BADVAL || props.errState === ERRSTATE_EMPTYVAL);
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
    let errtxt;
    if (props.errState === ERRSTATE_BADVAL)
        errtxt = "No such branch found. Please try again.";
    else if (props.errState === ERRSTATE_EMPTYVAL)
        errtxt = "Please submit a value.";
    else errtxt = "";
    return (
        <FormControl error={errcheck} disabled={disableStatus} sx={{ width: 1/4 }}>
            <FormLabel>Number of sellers</FormLabel>
            <Input
                placeholder={placeholdertxt}
                name="numInput"
            />
            <FormHelperText>{errtxt}</FormHelperText>
        </FormControl>
    );
}