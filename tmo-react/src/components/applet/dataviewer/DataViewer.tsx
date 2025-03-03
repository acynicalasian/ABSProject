/** @jsxImportSource @emotion/react */
import React from 'react';
import { useEffect, useState } from 'react';
import Form from './Form';
import DisplayData from './displaydata/DisplayData';

export const API_LOADING = 0;
export const API_IDLING = 1;
// This value lets us avoid calling the backend API's GetBranches twice when we handle a query
// submission in our Form while still letting us show the "Loading..." style of our components.
export const API_REFRESHING = 2;

// Set these values differently from the API states above so they'll never unintentionally compare
// as equal. Probably could use an enum but I'm busy enough as it is just trying to learn Joy UI.
export const TABLESTATE_NOQUERY = 3;
export const TABLESTATE_SHOWDATA = 4;

const EMPTYSTRINGARR: string[] = [];

// This probably needs to be changed depending on dev environment, actual deployment, etc.
const API_URL_PREFIX = "http://localhost:5139/PerformanceReport";
export const API_URL_GETBRANCHES = "/PerformanceReport/GetBranches";
export const API_URL_SELLERDATA_PREFIX = "/PerformanceReport/GetTopSellers"

export default function DataViewer() {
    // Manage apiStatus state here because we need to rerender pretty much all our child
    // components when this changes (I have loading variations set for each component). Both the
    // applet "viewport" and our input submission form rely on this, so put it here.
    const [apiStatus, setApiStatus] = useState(API_LOADING);

    // Pass this as a handler to components that need to modify the record of the state of the API.
    const apiStatusSetter = (n: number) => {
        setApiStatus(n);
    }
    
    // Both the submission form and the window need to know the current list of branches; keep that
    // synchronized here, and use state. This also makes sense since I suspect that rerenders might
    // occur when our form catches errors, and that doesn't necessarily need to trigger a reread of
    // the entire database; we'll lose this list if we rerender this component, so use state.
    const [branchList, setBranchList] = useState(EMPTYSTRINGARR);
    const branchSetter = (arr: string[]) => {
        setBranchList(arr);
    }

    // Both the viewing window and the form submission button need to know the number of sellers to
    // request. Keep this value synchronized.
    const [numSellers, setNumSellers] = useState(1);
    const numSetter = (i: number) => {
        setNumSellers(i);
    };

    // We need to synchronize the list of top sellers because we use the submit button to query the
    // database as needed.
    const [sellerData, setSellerData] = useState({});
    const sellerDataSetter = (obj: object) => {
        setSellerData(obj);
        // Getting seller data implies we can set the table state to show the table.
        setTableState(TABLESTATE_SHOWDATA);
    };

    // We need this to controll the state of the table... we don't want to display anything when we
    // haven't chosen a branch yet. Make this dependent on submission from Form.
    const [tableState, setTableState] = useState(TABLESTATE_NOQUERY);
    const tableStatusSetter = (s: number) => {
        setTableState(s);
    };

    // This forces all child nodes to be rerendered, but we need this parent component to control
    // what we see for the dropdown menu (so we don't see an empty list when branches aren't 
    // loaded yet) and the query button (we'll gray it out when we're reloading the data)
    //
    // The status of our backend API is definitely a dependency in rerendering, so it needs to
    // be a state variable for sure.
    useEffect(() => {
        let ignore = false;
        if (apiStatus === API_LOADING) {
            const fetchBranches = async function (): Promise<void> {
                const res = await fetch(API_URL_GETBRANCHES, {method: "GET"});
                const contentType = res.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json"))
                    // I think this means we just straight up get an Exception in our program when
                    // the API doesn't return as expected, but that's fine in our prototype for
                    // now.
                    throw new TypeError("Pretty positive GetBranches() always returns JSON.");
                // Again, this borks the program but that's fine for our prototype.
                if (!res.ok) throw new Error("Our backend failed!!")
                const obj = await res.json();
                if (!ignore)
                {
                    setBranchList(obj["list"]);
                    setApiStatus(API_IDLING);
                    setTableState(TABLESTATE_NOQUERY);
                }
            };
            fetchBranches();
            return () => {
                ignore = true;
            }
        }
    }, [apiStatus]);
    return (
        <>
            <Form
                apiStatus={apiStatus}
                apiSetter={apiStatusSetter}
                branchlist={branchList}
                branchSetter={branchSetter}
                numSetter={numSetter}
                sellerDataSetter={sellerDataSetter}
                tableStatusSetter={tableStatusSetter}
            />
            <DisplayData
                apiStatus={apiStatus}
                tableState={tableState}
                sellerData={sellerData}
                numSellers={numSellers}
            />
        </>
    );
}