/** @jsxImportSource @emotion/react */
import React from 'react';
import { Select, Option, Input, Typography, ButtonGroup, Button } from '@mui/joy';
import { useEffect, useState, useRef } from 'react';
import { Stack } from '@mui/joy';
import { css } from '@emotion/react';
import Submitter from './Submitter';


export const API_LOADING = 0;
export const API_IDLING = 1;

// This probably needs to be changed depending on dev environment, actual deployment, etc.
const API_URL_PREFIX = "http://localhost:5139/PerformanceReport/"

function DropdownMenu(props: {fetchStatus: number, branchlist: string[]}) {
    if (props.fetchStatus === API_LOADING) {
        return (
            <Select css={css`width: 50%;`} disabled={true} placeholder="Loading..."/>
        );
    } else {
        return (
            <Select css={css`width: 50%;`} placeholder="Choose a value...">
                {props.branchlist.map((item: string) => (
                    <Option key={item} value={item}>{item}</Option>
                ))}
            </Select>
        );
    }
}

function NumField(
    props:
    {
        fetchStatus: number,
        value: string,
        handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
        errState: boolean
    })
{
    function ErrMsg() {
        if (props.errState) {
            return (
                <Typography color="danger" level="body-xs">
                    Error. Input numeric value.
                </Typography>
            );
        }
        else return <></>;
    }
    if (props.fetchStatus === API_LOADING) {
        return (
            <Input
                value={props.value}
                css={css`width: 25%;`}
                disabled={true}
                placeholder="Loading..."
                variant='outlined'
            />
        );
    } else {
        return (
            <>
                <Input
                    css={css`width: 25%;`}
                    placeholder="Input number of sellers..." 
                    value={props.value}
                    onChange={props.handleChange}
                />
                <ErrMsg/>
            </>
        );
    }
}



export default function QuerySelector() {
    let emptystringarr: string[];
    emptystringarr = [];
    const [currentBranchList, setCurrentBranchList] = useState(emptystringarr);
    const [numSellers, setNumSellers] = useState("");
    const [apiStatus, setApiStatus] = useState(API_LOADING);
    const [inputErrState, setInputErrState] = useState(false);
    const onFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumSellers(event.target.value);
    };
    const errSetter = (b: boolean) => {
        setInputErrState(b);
    };
    const apiStatusSetter = (n: number) => {
        setApiStatus(n);
    }
    useEffect(() => {
        let ignore = false;
        if (apiStatus === API_LOADING) {
            const fetchBranches = async function (): Promise<void> {
                const url = "/PerformanceReport/GetBranches";
                const res = await fetch(url, {method: "GET"});
                const contentType = res.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json"))
                    throw new TypeError("Pretty positive GetBranches() always returns JSON.");
                const obj = await res.json();
                if (!ignore)
                {
                    setCurrentBranchList(obj["list"]);
                    setApiStatus(API_IDLING);
                }
            };
            fetchBranches();
            return () => {
                ignore = true;
            }
        }
    }, [apiStatus]);
    return (
        <Stack
            direction="row"
            spacing={2}
            sx={{
                justifyContent: "flex-start",
                alignItems: "stretch",
            }}
            css={css`
                    margin-top: 24px;
                    height: "fit-content";
                    width: 100%;
                `}
        >
            <DropdownMenu fetchStatus={apiStatus} branchlist={currentBranchList}/>
            <NumField fetchStatus={apiStatus} value={numSellers} handleChange={onFieldChange} errState={inputErrState}/>
            <Submitter fetchStatus={apiStatus} fetchSetter={apiStatusSetter} sendValue={numSellers} errStatus={inputErrState} errSetter={errSetter}/>
        </Stack>
    );
}