import "@/styles/globals.css";

import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import Layout from "@/components/layout";
export default function App({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <SessionProvider session={session}>
            <ChakraProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </ChakraProvider>
        </SessionProvider>
    );
}
