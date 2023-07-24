import React from "react";

export default function OAuthButton({ signInUrl, ButtonComponent, callbackUrl, providerName, csrfToken }) {
    const ref = React.useRef(null);
    return (
        <form method="post" action={signInUrl} ref={ref}>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <input type="hidden" name="csrfToken" value={csrfToken} />
            <ButtonComponent onClick={() => ref.current.submit()}>Đăng nhập với {providerName}</ButtonComponent>
        </form>
    );
}
