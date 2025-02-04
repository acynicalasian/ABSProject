/** @jsxImportSource @emotion/react */
import React from 'react';
import { Accordion, AccordionDetails, AccordionGroup, AccordionSummary, Table, Typography } from '@mui/joy';
import { css } from '@emotion/react';

export default function AccordionList(props: {sellerData: any}) {
    // Generate each subaccordion programatically.
    // console.log(props.sellerData);
    let ind = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
               "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let months = ["January", "February", "March", "April", "May", "June", "July",
                  "August", "September", "October", "November", "December"];
    return (
        <AccordionGroup>
            {[...Array(12)].map((_, i) => (
                <SubAccordion month={months[i]} monthlydata={props.sellerData[ind[i]]}/>
            ))}
        </AccordionGroup>
    );
}

function SubAccordion(props: {month: string, monthlydata: any})
{
    // For each accordion, parse the monthly data, which has two keys "ranking" and "sellertotal".
    let emptyentry = (
        <tr>
            <td><Typography>There were no sales for the month of {props.month}.</Typography></td>
        </tr>
    );
    let len = props.monthlydata["ranking"].length;
    var entries = [];
    if (len < 1) entries[0] = emptyentry;
    else {
        for (var i = 0; i < len; i++) {
            let rank = i + 1;
            let sellerName = props.monthlydata["ranking"][i];
            let saleVal = props.monthlydata["sellertotal"][i];
            entries[i] = <tr><td>{rank}</td><td>{sellerName}</td><td>{saleVal}</td></tr>;
        }
    }
    return (
        <Accordion>
            <AccordionSummary>{props.month}</AccordionSummary>
            <AccordionDetails>
                <Table variant="soft">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Seller</th>
                            <th>Total Sales</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries}
                    </tbody>
                </Table>
            </AccordionDetails>
        </Accordion>
    );
}