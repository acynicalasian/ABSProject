/** @jsxImportSource @emotion/react */
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import { ButtonGroup, Button, FormControl, FormLabel, FormHelperText } from '@mui/joy';
import { API_LOADING, API_IDLING, API_REFRESHING } from './DataViewer';
import { css } from '@emotion/react';

const CHECKBOXBLANK = <CheckBoxOutlineBlankRoundedIcon/>;
const CHECKBOXFILLED = <CheckBoxRoundedIcon/>;

export default function Submitter(
    props:
    {
        apiStatus: number,
        checked: boolean,
        checkSetter: (b: boolean) => void,
        // We need this to fix formatting issues with the button when errors occur.
        errState: number,
    })
{
    const handleClick = () => {
        props.checkSetter(!props.checked);
    };
    let checkbox = (props.checked) ? CHECKBOXFILLED : CHECKBOXBLANK;
    if (props.apiStatus === API_LOADING || props.apiStatus === API_REFRESHING) {
        return (
            <FormControl sx={{ width: 1/4 }}>
                <FormHelperText sx={{ visibility: "hidden" }}>foo</FormHelperText>
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
            </FormControl>
        );
    }
    else {
        return (
            <FormControl sx={{ width: 1/4 }}>
                <FormHelperText sx={{ visibility: "hidden" }}>foo</FormHelperText>
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
            </FormControl>
        );
    }
}