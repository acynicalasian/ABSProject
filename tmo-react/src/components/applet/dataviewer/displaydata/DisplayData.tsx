/** @jsxImportSource @emotion/react */
import React from 'react';
import { Table } from '@mui/joy';
import { API_LOADING, API_IDLING, API_REFRESHING } from '../DataViewer';

export default function DisplayData(
    props: {
        apiStatus: number,
        apiSetter: (n: number) => void,

    })
{

    return (
        <Table>
            
        </Table>
    );
}