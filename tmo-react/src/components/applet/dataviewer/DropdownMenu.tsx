/** @jsxImportSource @emotion/react */
import React from 'react';
import { FormControl, FormLabel, Autocomplete, FormHelperText } from "@mui/joy";
import { API_LOADING, API_REFRESHING } from "./DataViewer";
import { ERRSTATE_BADVAL, ERRSTATE_EMPTYVAL } from "./Form";

export default function DropdownMenu(
    props: {
        apiStatus: number,      // We want to know whether our API is still loading branchnames.
        branchlist: string[],
        errState: number,
        // We need this if we type after getting an error that we tried to submit an empty form.
        errSetter: (n: number) => void,
        // We need this to clear error state from autocorrect when we type again.
        changeFn: () => void,
    })
{
    let errcheck = (props.errState === ERRSTATE_BADVAL || props.errState === ERRSTATE_EMPTYVAL);
    // These values are determined by the status of the API.
    let placeholdertxt;
    let disableStatus;
    if (props.apiStatus === API_LOADING || props.apiStatus === API_REFRESHING) {
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
                onChange={props.changeFn}
            />
            <FormHelperText>{errtxt}</FormHelperText>
        </FormControl>
    );
}