import {
    Box,
    Input,
    Button,
    Center,
    FormControl,
    FormLabel,
    Heading,
    Text,
    useColorModeValue,
    Grid,
    Stack,
    StackDivider,
    useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { signIn, signOut, useSession, getProviders, getCsrfToken } from "next-auth/react";

import {
    FacebookLoginButton,
    GoogleLoginButton,
    GithubLoginButton,
    MicrosoftLoginButton,
} from "react-social-login-buttons";
import { useRouter } from "next/router";
import OAuthButton from "@/components/OAuthButton";
export default function Login({ providers, callbackUrl, csrfToken }) {
    const toast = useToast();
    React.useEffect(() => {
        toast({
            title: "Thông báo",
            description: "Hiện tại chỉ đăng nhập bằng Google được hỗ trợ",
            status: "info",
            duration: 10000,
            isClosable: true,
            position: "top",
        });
    }, [toast]);

    const [isLoading, setIsLoading] = React.useState(false);
    return (
        <main className="min-h-screen">
            <Center py={6}>
                <Box
                    maxW={"620px"}
                    w={"full"}
                    bg={useColorModeValue("white", "gray.900")}
                    boxShadow={"2xl"}
                    rounded={"lg"}
                    p={6}
                >
                    <Heading textAlign={"center"} fontSize={"2xl"} fontFamily={"body"}>
                        Đăng nhập
                    </Heading>
                    <Stack mt={8}>
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
                        <StackDivider mt={4} textAlign={"center"} color={useColorModeValue("gray.600", "gray.400")}>
                            hoặc
                        </StackDivider>
                        <Stack as={"form"} spacing={"5"}>
                            <FormControl isRequired>
                                <FormLabel>Email</FormLabel>
                                <Input type="email" />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Mật khẩu</FormLabel>
                                <Input type="password" />
                            </FormControl>
                            <Button colorScheme="teal" size="lg" fontSize={"md"} isLoading={isLoading}>
                                Đăng nhập
                            </Button>
                            <Text textAlign={"center"} fontSize={"sm"}>
                                Bạn chưa có tài khoản?{" "}
                                <Text as={Link} color={"blue.400"} href={"/register"}>
                                    Đăng ký
                                </Text>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Center>
        </main>
    );
}

export async function getServerSideProps(context) {
    const providers = await getProviders();
    const query = context.query;
    const csrfToken = await getCsrfToken(context);

    return {
        props: { providers, callbackUrl: query.callbackUrl || "/", csrfToken },
    };
}
