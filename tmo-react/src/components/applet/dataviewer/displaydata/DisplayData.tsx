/** @jsxImportSource @emotion/react */
import React from 'react';
import { Button, Card, Table } from '@mui/joy';
import { API_LOADING, API_IDLING, API_REFRESHING } from '../DataViewer';
import { TABLESTATE_NOSELECTION, TABLESTATE_SHOWDATA } from '../DataViewer';
import { TEMPLATE_SELLERDATA } from '../DataViewer';
import { css } from '@emotion/react';

export default function DisplayData(
    props: {
        apiStatus: number,
        tableState: number,
        sellerData: any,
    })
{
    // Handle the simplest cases first.
    if (props.apiStatus === API_LOADING || props.apiStatus === API_REFRESHING) {
        return (
            <Button
                sx={{ width: "stretch", height: "stretch", }}
                loading
            />
        );
    }

    // We may have a branch list, but we haven't made a query yet.


    return (
        <Card sx={{ width: "stretch", height: "stretch" }}>
            <Table>

            </Table>
        </Card>
    );
}