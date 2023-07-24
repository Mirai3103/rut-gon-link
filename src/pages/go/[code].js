import axios from "axios";
import Head from "next/head";
import React from "react";
import parse from "html-react-parser";
import {
    Box,
    Button,
    Center,
    Heading,
    Stack,
    Table,
    TableContainer,
    Tbody,
    Td,
    Tfoot,
    Th,
    Thead,
    Input,
    Tr,
    useColorModeValue,
    FormControl,
    FormLabel,
    FormErrorMessage,
    useToast,
} from "@chakra-ui/react";
import { getDiffStr } from "@/utils";
import { useRouter } from "next/router";
export default function CodePage({ data }) {
    const [password, setPassword] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const toast = useToast();
    const { redirect } = useRouter();
    const handleClick = () => {
        if (!data.isHasPassword) {
            redirect(data.originalUrl);
            return;
        }
        if (!password) {
            toast({
                colorScheme: "red",
                title: "Lỗi",
                description: "Vui lòng nhập mật khẩu",
                isClosable: true,
            });
            return;
        }
        setIsLoading(true);
        axios
            .post("/api/url-shortener/" + data.code, { password })
            .then((res) => {
                window.location.href = res.data.originalUrl;
            })
            .catch((err) => {
                toast({
                    colorScheme: "red",
                    title: "Lỗi",
                    description: "Mật khẩu không đúng",
                    isClosable: true,
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };
    return (
        <main className="min-h-[80vh] w-full">
            <Head>{data.headerHtml ? parse(data.headerHtml) : null}</Head>

            <Center py={6}>
                <Box
                    maxW={"720px"}
                    w={"full"}
                    bg={useColorModeValue("white", "gray.900")}
                    boxShadow={"2xl"}
                    rounded={"lg"}
                    p={20}
                    pt={"10"}
                    textAlign={"center"}
                >
                    <Heading fontSize={"3xl"} fontWeight={"semibold"} fontFamily={"body"}>
                        {data.title}
                    </Heading>
                    <Stack mt={"16"} maxW={"420px"} mx={"auto"} spacing={"3"}>
                        {data.isHasPassword && (
                            <FormControl isRequired>
                                <FormLabel>Mật khẩu</FormLabel>
                                <Input type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
                            </FormControl>
                        )}
                        <Button colorScheme="blue" size="lg" onClick={handleClick} isLoading={isLoading}>
                            Nhấn vào đây để truy cập
                        </Button>
                        <Button colorScheme="blue" size="lg" variant={"outline"}>
                            Tạo mã QR
                        </Button>
                        <Button colorScheme="blue" size="lg" variant={"outline"} onClick={() => redirect("/")}>
                            Tạo liên kết mới
                        </Button>
                    </Stack>
                    <Stack mt={"16"} maxW={"420px"} mx={"auto"} spacing={"3"}>
                        <Heading
                            ml={"-16"}
                            textAlign={"start"}
                            fontSize={"2xl"}
                            fontWeight={"semibold"}
                            fontFamily={"body"}
                            mb={"5"}
                        >
                            Thông tin liên kết
                        </Heading>
                        <TableContainer>
                            <Table variant="striped">
                                <Tbody>
                                    <Tr>
                                        <Td>ID </Td>
                                        <Td>{data.code}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Mật khẩu</Td>
                                        <Td>{data.isHasPassword ? "Có" : "Không"}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Lượt truy cập</Td>
                                        <Td>{data.visits}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Tạo vào</Td>
                                        <Td>{getDiffStr(data.createdAt)}</Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </Stack>
                </Box>
            </Center>
        </main>
    );
}

export async function getServerSideProps(context) {
    try {
        const urlShortener = await axios.get(process.env.APP_DOMAIN + `/api/url-shortener/${context.params.code}`);

        return {
            props: {
                data: urlShortener.data,
            },
        };
    } catch (err) {
        return {
            redirect: {
                destination: "/404",
                permanent: false,
            },
        };
    }
}
