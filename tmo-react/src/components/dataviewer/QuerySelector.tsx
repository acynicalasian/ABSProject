/** @jsxImportSource @emotion/react */
import React from 'react';
import { Select, Option, Button, Input } from '@mui/joy';
import { useEffect, useState } from 'react';
import { Stack } from '@mui/joy';
import { css } from '@emotion/react';

const API_LOADING = 0;
const API_IDLING = 1;

// This probably needs to be changed depending on dev environment, actual deployment, etc.
const API_URL_PREFIX = "http://localhost:5139/PerformanceReport/"

function DropdownMenu(props: {fetchStatus: number, branchlist: string[]}) {
    if (props.fetchStatus === API_LOADING) {
        return (
            <Select disabled={true} placeholder="Loading..."/>
        );
    } else {
        return (
            <Select placeholder="Choose a value...">
                {props.branchlist.map((item: string) => (
                    <Option key={item} value={item}>{item}</Option>
                ))}
            </Select>
        );
    }
}

export default function QuerySelector() {
    var emptystringarr: string[];
    emptystringarr = [];
    const [currentBranchList, setCurrentBranchList] = useState(emptystringarr);
    const [apiStatus, setApiStatus] = useState(API_LOADING);
    useEffect(() => {
        let ignore = false;
        if (apiStatus === API_LOADING) {
            // Empty out the branch list and start over, just in case.
            const fetchBranches = async function (): Promise<void> {
                const url = "/PerformanceReport/GetBranches";
                console.log(`Requested URL: ${url}`);
                const res = await fetch(url, {method: "GET"});
                const contentType = res.headers.get("content-type");
                console.log(`Printing header: ${res.headers}`);
                window.localStorage.TESTVAR = res.headers;
                console.log(contentType);
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
            <Button/>
        </Stack>
    );
}