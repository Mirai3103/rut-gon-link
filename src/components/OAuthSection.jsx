import { Grid } from "@chakra-ui/react";
import React from "react";
import {
    FacebookLoginButton,
    GithubLoginButton,
    GoogleLoginButton,
    MicrosoftLoginButton,
} from "react-social-login-buttons";
import OAuthButton from "./OAuthButton";

export default function OAuthSection({ providers, csrfToken, callbackUrl }) {
    return (
        <Grid
            templateColumns={{
                base: "repeat(1, 1fr)",
                md: "repeat(2, 1fr)",
            }}
            gap={2}
        >
            <FacebookLoginButton text="Đăng nhập với Facebook" onClick={() => alert("Hello")} />
            <OAuthButton
                ButtonComponent={GoogleLoginButton}
                providerName={"Google"}
                callbackUrl={callbackUrl}
                signInUrl={providers.google.signinUrl}
                csrfToken={csrfToken}
            />

            <GithubLoginButton text="Đăng nhập bằng Github" onClick={() => alert("Hello")} />
            <MicrosoftLoginButton text="Đăng nhập với Microsoft" onClick={() => alert("Hello")} />
        </Grid>
    );
}
