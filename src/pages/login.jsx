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
import OAuthSection from "@/components/OAuthSection";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { useForm } from "react-hook-form";
import { set } from "mongoose";
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
                        <OAuthSection providers={providers} csrfToken={csrfToken} callbackUrl={callbackUrl} />
                        <StackDivider mt={4} textAlign={"center"} color={useColorModeValue("gray.600", "gray.400")}>
                            hoặc
                        </StackDivider>
                        <Stack as={"form"} spacing={"5"} action={providers.credentials.callbackUrl} method={"POST"}>
                            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                            <input name="callbackUrl" type="hidden" defaultValue={callbackUrl} />
                            <FormControl isRequired>
                                <FormLabel>Email</FormLabel>
                                <Input type="email" name="email" />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Mật khẩu</FormLabel>
                                <Input type="password" name="password" />
                            </FormControl>

                            <Button colorScheme="teal" size="lg" fontSize={"md"} type="submit">
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
    const query = context.query;

    const session = await getServerSession(context.req, context.res, authOptions);
    if (session) {
        return {
            redirect: {
                destination: query.callbackUrl || "/",
                permanent: false,
            },
        };
    }
    const providers = await getProviders();
    const csrfToken = await getCsrfToken(context);

    return {
        props: { providers, callbackUrl: query.callbackUrl || "/", csrfToken },
    };
}
