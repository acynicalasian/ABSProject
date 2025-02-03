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
        apiStatus: number,
        apiSetter: any,
        errSetter: (state: number) => void
    })
{
    const [checked, setChecked] = useState(false);
    const handleClick = () => {
        setChecked(b => !b);
    };
    let checkbox = (checked) ? CHECKBOXFILLED : CHECKBOXBLANK;
    if (props.apiStatus === API_LOADING) {
        return (
            <FormControl>
                <ButtonGroup
                    color="primary"
                    disabled={true}
                    variant="solid"
                    css={css`
                            width: 200px;
                        `}
                >
                    <Button>Query</Button>
                    <Button
                        startDecorator={CHECKBOXBLANK}
                        sx={{ width: 200 }}
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
            <FormControl>
                <ButtonGroup
                    color="primary"
                    disabled={false}
                    variant="solid"
                    css={css`
                            width: 200px;
                        `}
                >
                    <Button type="submit">Query</Button>
                    <Button
                        startDecorator={checkbox}
                        onClick={handleClick}
                        sx={{ width: 200 }}
                    >
                        Refresh?
                    </Button>
                </ButtonGroup>
                <FormLabel/>
            </FormControl>
        );
    }
}