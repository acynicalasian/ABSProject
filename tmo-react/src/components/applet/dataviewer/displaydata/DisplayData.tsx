/** @jsxImportSource @emotion/react */
import React from 'react';
import { Box, Button, Card, Divider, Sheet, Stack, Table, Typography } from '@mui/joy';
import { API_LOADING, API_IDLING, API_REFRESHING } from '../DataViewer';
import { TABLESTATE_SHOWDATA, TABLESTATE_NOQUERY } from '../DataViewer';
import { css } from '@emotion/react';
import AccordionList from './AccordionList';

function TableHeader(props: {branchname: string, n: number}) {
    return (
        <div css={css`padding: 8px; padding-left: 16px;`}>
            <h4>
            Viewing the data of {props.branchname}, up to {props.n} sellers per month.
            </h4>  
        </div>
    );
}

export default function DisplayData(
    props: {
        apiStatus: number,
        tableState: number,
        sellerData: any,
        numSellers: number,
    })
{
    // Handle the simplest cases first. Display a loading sign when API inits.
    if (props.apiStatus === API_LOADING || props.apiStatus === API_REFRESHING) {
        return (
            <Button
                sx={{ width: "stretch", height: "stretch", }}
                loading
            />
        );
    }

    // We may have a branch list, but we haven't made a query yet.
    if (props.tableState == TABLESTATE_NOQUERY) {
        return (
            <Card sx={{ width: "stretch", height: "stretch"}}>
                <Typography>Select a branch to query first.</Typography>
            </Card>
        );
    }

    return (
        <Sheet
            css={css`
                    height: stretch;
                    width: stretch;
                    padding: 8px;
                    border-radius: 12px;
                    overflow-x: hidden;
                `}
            variant="outlined"
        >
            <Stack
                direction="column"
                spacing={0}
                divider={<Divider orientation="horizontal"/>}
                sx={{
                    justifyContent: "center",
                    alignItems: "flex-start",
                    height: "stretch",
                    width: "stretch",
                }}
            >
                <TableHeader branchname={props.sellerData.branchname} n={props.numSellers}/>
                <Sheet
                    css={css`
                        height:stretch;
                        width: stretch;
                        overflow: auto;
                        `}
                >
                    <AccordionList sellerData={props.sellerData}/>
                </Sheet>
            </Stack>
        </Sheet>
    );



    // This should hopefully only go through when we have branch data.
    return (
        <Sheet
            css={css`
                    height: stretch; 
                    width: stretch;
                    padding: 8px;
                    border-radius: 12px;
                `}
            variant='outlined'
        >
            <Table stickyHeader >
                <TableHeader branchname={props.sellerData.branchname} n={props.numSellers}/>
                <div
                    css={css`
                        height:stretch;
                        width: stretch;
                        overflow: scroll;
                        `}
                >
                    <AccordionList sellerData={props.sellerData}/>
                </div>
            </Table>
        </Sheet>
    );
}