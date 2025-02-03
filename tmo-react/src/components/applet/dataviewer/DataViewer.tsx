/** @jsxImportSource @emotion/react */
import React from 'react';
import { useEffect, useState } from 'react';
import Form from './Form';

export const API_LOADING = 0;
export const API_IDLING = 1;

const EMPTYSTRINGARR: string[] = [];
let MONTHLYTEMPLATE = { ranking: EMPTYSTRINGARR, sellertotal: EMPTYSTRINGARR };
export const TEMPLATE_SELLERDATA = {
    Jan: MONTHLYTEMPLATE, Feb: MONTHLYTEMPLATE, Mar: MONTHLYTEMPLATE, Apr: MONTHLYTEMPLATE,
    May: MONTHLYTEMPLATE, Jun: MONTHLYTEMPLATE, Jul: MONTHLYTEMPLATE, Aug: MONTHLYTEMPLATE,
    Sep: MONTHLYTEMPLATE, Oct: MONTHLYTEMPLATE, Nov: MONTHLYTEMPLATE, Dec: MONTHLYTEMPLATE,
};

// This probably needs to be changed depending on dev environment, actual deployment, etc.
const API_URL_PREFIX = "http://localhost:5139/PerformanceReport";
const API_URL_GETBRANCHES = "/PerformanceReport/GetBranches";

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
    const [sellerData, setSellerData] = useState(TEMPLATE_SELLERDATA);
    const sellerDataSetter = (obj: typeof TEMPLATE_SELLERDATA) => {
        setSellerData(obj);
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
                const obj = await res.json();
                if (!ignore)
                {
                    setBranchList(obj["list"]);
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
        <>
            <Form
                apiStatus={apiStatus}
                apiSetter={apiStatusSetter}
                branchlist={branchList}
                branchSetter={branchSetter}
                numSetter={numSetter}
                sellerDataSetter={sellerDataSetter}
            />
            {/*<WindowedViewer/>*/}
            <></>
        </>
    );
}