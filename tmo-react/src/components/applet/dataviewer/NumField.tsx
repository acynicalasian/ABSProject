/** @jsxImportSource @emotion/react */
import React from 'react';
import { FormControl, FormLabel, Input, FormHelperText } from "@mui/joy";
import { API_LOADING, API_REFRESHING } from "./DataViewer";
import { ERRSTATE_BADVAL, ERRSTATE_EMPTYVAL } from "./Form";

export default function NumField(
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
    if (props.apiStatus === API_LOADING || props.apiStatus === API_REFRESHING) {
        placeholdertxt = "Loading...";
        disableStatus = true;
    } else {
        placeholdertxt = "Enter value...";
        disableStatus = false;
    }

    // These values are determined by whether or not we just tried to submit bad values.
    let errtxt;
    if (props.errState === ERRSTATE_BADVAL)
        errtxt = "Value must be a positive integer.";
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