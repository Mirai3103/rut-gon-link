import { getServerSession } from "next-auth";
import { getCsrfToken, getProviders } from "next-auth/react";
import React from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import {
    Box,
    Button,
    Center,
    FormControl,
    FormLabel,
    Heading,
    Stack,
    StackDivider,
    Text,
    useColorModeValue,
    Input,
    FormHelperText,
    useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/router";

export default function Register({ providers, callbackUrl, csrfToken }) {
    const [isLoading, setIsLoading] = React.useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
            name: "",
            rePassword: "",
        },
    });
    const toast = useToast();
    const { push } = useRouter();
    const onSubmit = (data) => {
        setIsLoading(true);
        axios
            .post("/api/auth/register", data)
            .then((res) => {
                toast({
                    title: "Đăng ký thành công",
                    description: "Bạn đã đăng ký thành công, vui lòng đăng nhập để tiếp tục",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                setTimeout(() => {
                    push("/login?callbackUrl=" + callbackUrl);
                }, 2000);
            })
            .catch((err) => {
                toast({
                    title: "Đăng ký thất bại",
                    description: err.response.data.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };
    return (
        <main className="min-h-screen">
            <Center py={6}>
                <Box
                    maxW={"520px"}
                    w={"full"}
                    bg={useColorModeValue("white", "gray.900")}
                    boxShadow={"2xl"}
                    rounded={"lg"}
                    p={6}
                >
                    <Heading textAlign={"center"} fontSize={"2xl"} fontFamily={"body"}>
                        Đăng ký
                    </Heading>
                    <Stack mt={8}>
                        <Stack as={"form"} spacing={"5"} onSubmit={handleSubmit(onSubmit)}>
                            <FormControl isRequired>
                                <FormLabel>Email</FormLabel>
                                <Input type="email" {...register("email")} />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Tên hiển thị</FormLabel>
                                <Input
                                    type="text"
                                    {...register("name", {
                                        minLength: {
                                            value: 6,
                                            message: "Tên hiển thị phải có ít nhất 6 ký tự",
                                        },
                                        maxLength: {
                                            value: 32,
                                            message: "Tên hiển thị không được quá 32 ký tự",
                                        },
                                    })}
                                />
                                {errors?.name && (
                                    <FormHelperText color={"red.400"}>{errors.name.message}</FormHelperText>
                                )}
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Mật khẩu</FormLabel>
                                <Input
                                    type="password"
                                    {...register("password", {
                                        minLength: {
                                            value: 6,
                                            message: "Mật khẩu phải có ít nhất 6 ký tự",
                                        },
                                        maxLength: {
                                            value: 32,
                                            message: "Mật khẩu không được quá 32 ký tự",
                                        },
                                    })}
                                />
                                {errors?.password && (
                                    <FormHelperText color={"red.400"}>{errors.password.message}</FormHelperText>
                                )}
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Nhập lại mật khẩu</FormLabel>
                                <Input
                                    type="password"
                                    {...register("rePassword", {
                                        validate: (value, formValues) =>
                                            value === formValues.password || "Mật khẩu không khớp",
                                    })}
                                />
                                {errors?.rePassword && (
                                    <FormHelperText color={"red.400"}>{errors.rePassword.message}</FormHelperText>
                                )}
                            </FormControl>
                            <Button colorScheme="teal" size="lg" fontSize={"md"} isLoading={isLoading} type="submit">
                                Đăng ký
                            </Button>
                            <Text textAlign={"center"} fontSize={"sm"}>
                                Bạn đã có tài khoản?{" "}
                                <Text as={Link} color={"blue.400"} href={"/login"}>
                                    Đăng nhập
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

    return {
        props: { callbackUrl: query.callbackUrl || "/" },
    };
}
