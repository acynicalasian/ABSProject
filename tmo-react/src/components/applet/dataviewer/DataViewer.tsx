/** @jsxImportSource @emotion/react */
import React from 'react';
import { useEffect, useState } from 'react';
import Form from './Form';

export const API_LOADING = 0;
export const API_IDLING = 1;

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
    // syncrhonized here, and use state. This also makes sense since I suspect that rerenders might
    // occur when our form catches errors, and that doesn't necessarily need to trigger a reread of
    // the entire database; we'll lose this list if we rerender this component, so use state.
    let emptystringarr: string[];
    emptystringarr = [];
    const [branchList, setBranchList] = useState(emptystringarr);

    // This could be a bad UX decision, but allow users to resubmit a query using the last value
    // a query was made with. We want to store this value between potential rerenders (i.e. we
    // refresh branchlist or top seller information manually, but numSellers stayed the same). We
    // also want to synchronize between the form and the view window anyway.
    const [lastNumSellers, setLastNumSellers] = useState(1);

    // Handler function for form elements that need to record the last number used if it was good.
    const lastNumSetter = (i: number) => {
        setLastNumSellers(i);
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
                lastNumSetter={lastNumSetter}
            />
            {/*<WindowedViewer/>*/}
            <></>
        </>
    );
}