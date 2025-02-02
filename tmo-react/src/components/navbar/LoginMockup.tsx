/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Divider, Chip, Stack, Avatar, Link } from "@mui/joy";
import avatar from "./avatar.png";

export default function LoginMockup() {
    return (
        <>
            <Divider orientation="horizontal" role="presentation">
                <Chip size="sm" variant="plain">Login (mockup)</Chip>
            </Divider>
            <Stack
                direction="row"
                spacing={0}
                sx={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                }}
                css={css`
                        width: 80%;
                        height:10%;
                        padding: 8px;
                    `}
            >
                <Avatar
                    src={avatar}
                    alt="Arthur Kim"
                    css={css`
                            max-height: 50%;
                            margin-left: 20px;
                            margin-right: 20px;
                        `}
                />
                <Stack
                    direction="column"
                    spacing={0}
                    sx={{
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                    }}
                    css={css`
                            width: stretch;
                            max-height: 60%;
                        `}
                >
                    <Link
                        underline="none"
                        color="neutral"
                        variant="plain"
                        css={css`font-size: 1em;`}
                        sx={{
                            '&:hover': {
                                color: "inherit",
                                backgroundColor: "transparent",
                            }
                        }}
                    >
                        Arthur Kim
                    </Link>
                    <Link
                        underline="none"
                        color="neutral"
                        variant="plain"
                        css={css`font-size: 0.8em;`}
                        sx={{
                            '&:hover': {
                                color: "inherit",
                                backgroundColor: "transparent",
                            }
                        }}
                    >
                        arthur.kim@ucla.edu</Link>
                </Stack>
            </Stack>
        </>
    );
}