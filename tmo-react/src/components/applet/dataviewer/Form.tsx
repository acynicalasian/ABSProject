/** @jsxImportSource @emotion/react */
import React from 'react';
import { useState } from 'react';
import { API_IDLING, API_REFRESHING, API_LOADING, TABLESTATE_SHOWDATA } from "./DataViewer";
import { css } from '@emotion/react';
import { Stack } from '@mui/joy';
import Submitter from './Submitter';
import { API_URL_SELLERDATA_PREFIX, API_URL_GETBRANCHES } from './DataViewer';
import DropdownMenu from './DropdownMenu';
import NumField from './NumField';
export const ERRSTATE_OK = 0;
export const ERRSTATE_BADVAL = 1;
export const ERRSTATE_EMPTYVAL = 2;
// We need this to handle trying to submit on load (numSellers is initialized to 1)
export const ERRSTATE_EMPTYONLOAD = 3;

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
        sellerDataSetter: (obj: object) => void,
        tableStatusSetter: (s: number) => void,
    })
{
    // Store error states of each text entry field here. We need to declare it here so we can set
    // an error state if needed when we handle onSubmit.
    const [errStateBranch, setErrStateBranch] = useState(ERRSTATE_OK);
    const errSetterBranch = (n: number) => {
        setErrStateBranch(n);
    };
    const [errStateNum, setErrStateNum] = useState(ERRSTATE_EMPTYONLOAD);
    const errSetterNum = (n: number) => {
        setErrStateNum(n);
    };

    // Store the state of the checkbox asking whether we want to refresh our query (not read 
    // cached values. We need to store state here so handleSubmit can tinker with it as needed.
    const [checked, setChecked] = useState(false);
    const checkSetter = () => {
        setChecked(b => !b);
    };

    // Clear error state if we modify an input field.
    const handleChangeBranch = () => {
        setErrStateBranch(ERRSTATE_OK);
    };
    const handleChangeNum = () => {
        setErrStateNum(ERRSTATE_OK);
    };

    const handleSubmit = (f: FormData) => {

        let branchStr = f.get("branchInput") as string;
        let numStr = f.get("numInput") as string;
        const parsedNumStr = Number.parseInt(numStr);

        // This error checking might become redunant after I tweak the number field, but more error
        // checking can't hurt us...
        let exitEarly = false;
        // If branchStr is empty or numStr is non-integral and/or less than 1, we can stop early.
        if (branchStr === "") { // Not sure if JS does some implicit comparison bs with "" and null
            setErrStateBranch(ERRSTATE_EMPTYVAL);
            exitEarly = true;
        }
        // numStr can't be both negative or a bad value.
        if (numStr === "" || errStateNum === ERRSTATE_EMPTYONLOAD) {
            setErrStateNum(ERRSTATE_EMPTYVAL);
            exitEarly = true;
        }
        else {
            // If there's anything else but numeric values in the field
            if (!(/^\d+$/).test(numStr))
            {
                setErrStateNum(ERRSTATE_BADVAL);
                exitEarly = true;
            }
        }
        if (exitEarly) return;

        // If we wanted a refresh, we have to fetch the branch list again to make sure the branch
        // name we're looking for isn't in the most recent data.
        var updatedBranchList = props.branchlist;
        if (checked) {
            const fetchBranches = async function (): Promise<void> {
                props.apiSetter(API_REFRESHING);
                const res = await fetch(API_URL_GETBRANCHES, {method: "GET"});
                const contentType = res.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json"))
                    // We straight up bork the program if the API doesn't return as expected, but
                    // for a prototype, it's fine for now.
                    throw new TypeError("Uh-oh!!");
                const obj = await res.json();
                updatedBranchList = obj["list"];
                props.branchSetter(obj["list"]);
                props.apiSetter(API_IDLING);
                setChecked(false);
            };
            fetchBranches();
        }

        exitEarly = true;
        for (var i = 0; i < updatedBranchList.length; i++)
            if (branchStr === updatedBranchList[i]) exitEarly = false;
        if (exitEarly) {
            setErrStateBranch(ERRSTATE_BADVAL);
            return;
        }

        // If we got this far, now we can finally make the API request.
        // First, strip whitespace from numStr in a hacky way because JS has way too many implicit
        // casts... it could cause issues with the backend.
        let formattedNumStr = Number.parseInt(parsedNumStr.toFixed(0));
        const fetchSellerData = async function (): Promise<void> {
            let url = encodeURI(`${API_URL_SELLERDATA_PREFIX}/${branchStr}/${formattedNumStr}`);
            props.apiSetter(API_REFRESHING);
            const res = await fetch(url, {method: "GET"});
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json"))
                // Again, we'll bork the program but that's fine for now.
                throw new TypeError("uh-oh!")
            // More temporary bork.
            if (!res.ok) throw new Error("Our backend failed!");
            const objtext = await res.text();
            var obj = JSON.parse(objtext);

            // Add the branchname as a property for later use.
            obj.branchname = branchStr;
            props.numSetter(formattedNumStr);
            props.sellerDataSetter(obj);
            props.apiSetter(API_IDLING);
            props.tableStatusSetter(TABLESTATE_SHOWDATA);
        };
        fetchSellerData();
        // I don't know why we're not resetting the input field using React's new behavior. Let's
        // try this???
        f.set("branchInput", "");
    }
    return (
        <form action={handleSubmit} css={css`width: stretch;`}>
            <Stack
                direction="row"
                spacing={2}
                sx={{
                    justifyContent: "flex-end",
                    alignItems: "flex-start",
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
                    changeFn={handleChangeBranch}
                />
                <NumField
                    apiStatus={props.apiStatus}
                    errState={errStateNum}
                    errSetter={errSetterNum}
                    changeFn={handleChangeNum}
                />
                <Submitter
                    apiStatus={props.apiStatus}
                    checked={checked}
                    checkSetter={checkSetter}
                    errState={errStateNum}
                />
            </Stack>
        </form>
    );
}