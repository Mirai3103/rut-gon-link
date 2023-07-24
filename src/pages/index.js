import { randomUniqueId } from "@/utils";
import {
    Box,
    Center,
    FormControl,
    Input,
    FormLabel,
    Heading,
    useColorModeValue,
    Switch,
    Stack,
    InputGroup,
    InputLeftAddon,
    Button,
    Text,
    FormErrorMessage,
    FormHelperText,
    useToast,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useForm } from "react-hook-form";
import React from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
export default function Home({ appDomain }) {
    const { data } = useSession();
    const { push } = useRouter();
    const {
        register,
        formState: { errors },
        handleSubmit,
        setError,
        setValue,
        getValues,
    } = useForm({
        defaultValues: {
            originalUrl: "",
            password: "",
            code: randomUniqueId(),
            isCustomId: false,
        },
    });
    const [isCheckingId, setIsCheckingId] = React.useState(false);
    const toast = useToast();
    const onSubmit = async (data) => {
        try {
            setIsCheckingId(true);
            await axios.get(`/api/url-shortener/${getValues("code")}`);
            toast({
                title: "Lỗi",
                description: "Id đã tồn tại, vui lòng chọn id khác",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } catch (err) {
            const res = await axios.post("/api/url-shortener", data);
            push("/go/" + data.code);
        } finally {
            setIsCheckingId(false);
        }
    };
    return (
        <main className="min-h-[80vh] w-full">
            <Head>
                <title>Rút gọn liên kết</title>
                <meta name="description" content="Rút gọn liên kết" />
                <meta name="keywords" content="Rút gọn liên kết" />
                <meta name="author" content="Laffy" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta property="og:title" content="Rút gọn liên kết" />
                <meta property="og:description" content="Rút gọn liên kết" />
                <meta property="og:image" content="/favicon.ico" />
                <meta property="og:site_name" content="Rút gọn liên kết" />
            </Head>
            <Center py={6}>
                <Box
                    maxW={"520px"}
                    w={"full"}
                    bg={useColorModeValue("white", "gray.900")}
                    boxShadow={"2xl"}
                    rounded={"lg"}
                    p={6}
                >
                    <Heading fontSize={"xl"} fontFamily={"body"}>
                        Tạo liên kết rút gọn mới
                    </Heading>
                    <Stack as={"form"} mt={"10"} spacing={"5"} onSubmit={handleSubmit(onSubmit)}>
                        <FormControl isRequired>
                            <FormLabel>Liên kết gốc</FormLabel>
                            <Input
                                type="url"
                                {...register("originalUrl", {
                                    required: "Vui lòng nhập liên kết gốc",
                                })}
                            />
                            {errors.originalUrl && (
                                <FormHelperText color={"red.400"}>{errors.originalUrl.message}</FormHelperText>
                            )}
                        </FormControl>
                        <FormControl>
                            <FormLabel>Mật khẩu (tuỳ chọn)</FormLabel>
                            <Input type="password" {...register("password")} />
                        </FormControl>
                        <FormControl display="flex" gap={"5"} alignItems="center">
                            <Switch
                                checked={getValues("isCustomId")}
                                onChange={(e) =>
                                    setValue("isCustomId", !getValues("isCustomId"), {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                        shouldTouch: true,
                                    })
                                }
                            />
                            <FormLabel htmlFor="customId" mb="0">
                                Sử dụng liên kết tùy chỉnh ?
                            </FormLabel>
                        </FormControl>
                        <FormControl
                            isRequired
                            isDisabled={!getValues("isCustomId")}
                            isReadOnly={!getValues("isCustomId")}
                            display="flex"
                            className="flex-col"
                        >
                            <FormLabel>Id liên kết</FormLabel>
                            <InputGroup>
                                <InputLeftAddon>{appDomain + "/"}</InputLeftAddon>
                                <Input type="text" name="code" {...register("code")} />
                            </InputGroup>
                        </FormControl>
                        <Button
                            colorScheme="teal"
                            size="lg"
                            fontSize="md"
                            onClick={handleSubmit}
                            disabled={!data && !getValues("isCustomId")}
                            type="submit"
                            isLoading={isCheckingId}
                        >
                            Rút gọn liên kết
                        </Button>
                        {!data && (
                            <Text fontSize="sm" mt={"5"} color="gray.500">
                                Lưu ý: Liên kết chỉ tồn tại trong vòng 24h, sau đó sẽ bị xóa khỏi hệ thống. Vui lòng
                                đăng nhập để bỏ qua giới hạn này.
                            </Text>
                        )}
                    </Stack>
                </Box>
            </Center>
        </main>
    );
}

export async function getStaticProps() {
    return {
        props: {
            appDomain: process.env.APP_DOMAIN,
        },
    };
}
