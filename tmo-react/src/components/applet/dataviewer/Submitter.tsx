/** @jsxImportSource @emotion/react */
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import { ButtonGroup, Button, List, Checkbox, FormControl, FormLabel } from '@mui/joy';
import { API_LOADING, API_IDLING } from './DataViewer';
import { useState } from 'react';
import { css } from '@emotion/react';

const CHECKBOXBLANK = <CheckBoxOutlineBlankRoundedIcon/>;
const CHECKBOXFILLED = <CheckBoxRoundedIcon/>;

export default function Submitter(
    props:
    {
        // We control the query through handling the submission. We don't need to pass any handlers
        // or props here.
        apiStatus: number,
    })
{
    const [checked, setChecked] = useState(false);
    const handleClick = () => {
        setChecked(b => !b);
    };
    let checkbox = (checked) ? CHECKBOXFILLED : CHECKBOXBLANK;
    if (props.apiStatus === API_LOADING) {
        return (
            <FormControl sx={{ width: 1/4 }}>
                <ButtonGroup
                    color="primary"
                    disabled={true}
                    variant="solid"
                >
                    <Button sx={{ width: 3/8 }}>Query</Button>
                    <Button
                        startDecorator={CHECKBOXBLANK}
                        sx={{ width: 5/8 }}
                    >
                        Refresh?
                    </Button>
                </ButtonGroup>
                <FormLabel/>
            </FormControl>
        );
    }
    else {
        return (
            <FormControl sx={{ width: 1/4 }}>
                <ButtonGroup
                    color="primary"
                    disabled={false}
                    variant="solid"
                >
                    <Button type="submit" sx={{ width: 3/8 }}>Query</Button>
                    <Button
                        startDecorator={checkbox}
                        onClick={handleClick}
                        sx={{ width: 5/8 }}
                    >
                        Refresh?
                    </Button>
                </ButtonGroup>
                <FormLabel/>
            </FormControl>
        );
    }
}