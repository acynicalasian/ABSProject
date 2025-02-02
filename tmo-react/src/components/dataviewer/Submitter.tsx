/** @jsxImportSource @emotion/react */
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import { ButtonGroup, Button, List, Checkbox } from '@mui/joy';
import { API_LOADING, API_IDLING } from './QuerySelector';
import { useState } from 'react';

const CHECKBOXBLANK = <CheckBoxOutlineBlankRoundedIcon/>;
const CHECKBOXFILLED = <CheckBoxRoundedIcon/>;

function CheckboxContainer(props: {checked: boolean})
{
    return (
        <Checkbox
            // These props might need to be commented out after testing.
            color="primary"

            checked={props.checked}
            checkedIcon={CHECKBOXFILLED}
            uncheckedIcon={CHECKBOXBLANK}

        >

        </Checkbox>
    );
}

function SubmitterTest(
    props:
    {
        fetchStatus: number,
        fetchSetter: any,
        sendValue: string,
        errStatus: boolean,
        errSetter: (state: boolean) => void
    })
{
    const [checked, setChecked] = useState(false);
    let checkbox = (checked) ? CHECKBOXFILLED : CHECKBOXBLANK;
    if (props.fetchStatus === API_LOADING) {
        return (
            <ButtonGroup
                color="primary"
                disabled={true}
                variant="solid"
            >
                <Button>Query</Button>
                <Button startDecorator={CHECKBOXBLANK}>Refresh?</Button>
            </ButtonGroup>
        );
    }
    else {
        return (
            <ButtonGroup
                color="primary"
                disabled={false}
                variant="solid"
            >
                <Button>Query</Button>
                <Button component={Checkbox} startDecorator={checkbox}>Refresh?</Button>
            </ButtonGroup>
        );
    }
}

export default function Submitter(
    props:
    {
        fetchStatus: number,
        fetchSetter: any,
        sendValue: string,
        errStatus: boolean,
        errSetter: (state: boolean) => void
    })
{
    const [checked, setChecked] = useState(false);
    let checkbox = (checked) ? CHECKBOXFILLED : CHECKBOXBLANK;
    if (props.fetchStatus === API_LOADING) {
        return (
            <ButtonGroup
                color="primary"
                disabled={true}
                variant="solid"
            >
                <Button>Query</Button>
                <Button startDecorator={CHECKBOXBLANK}>Refresh?</Button>
            </ButtonGroup>
        );
    }
    else {
        return (
            <ButtonGroup
                color="primary"
                disabled={false}
                variant="solid"
            >
                <Button>Query</Button>
                <Button component={Checkbox} startDecorator={checkbox}>Refresh?</Button>
            </ButtonGroup>
        );
    }
}