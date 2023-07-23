import { getDiffStr } from "@/utils";
import {
    Box,
    Button,
    Center,
    Heading,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";

export default function LinkManage({ data }) {
    console.log(data);
    return (
        <main className="min-h-[80vh] w-full">
            <Center py={6}>
                <Box
                    maxW={"1020px"}
                    w={"full"}
                    bg={useColorModeValue("white", "gray.900")}
                    boxShadow={"2xl"}
                    rounded={"lg"}
                    p={6}
                >
                    <Heading fontSize={"2xl"} fontFamily={"body"}>
                        Quản lý liên kết rút gọn
                    </Heading>
                    <TableContainer maxWidth={"100%"} mt={"10"}>
                        <Table variant="striped">
                            <Thead>
                                <Tr>
                                    <Th>Id</Th>
                                    <Th>Liên kết gốc</Th>
                                    <Th>Lượt truy cập</Th>
                                    <Th>Mật khẩu</Th>
                                    <Th>Tạo vào</Th>
                                    <Th>Hành động</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {data.map((item, index) => (
                                    <Tr key={index}>
                                        <Td>{item.code}</Td>
                                        <Td>
                                            <Text whiteSpace={"pre-wrap"}>
                                                {item.originalUrl.length > 30
                                                    ? item.originalUrl.slice(0, 30) + "..."
                                                    : item.originalUrl}
                                            </Text>
                                        </Td>
                                        <Td>{item.visits}</Td>
                                        <Td>{item.password?.length > 0 ? item.password : "Không"}</Td>
                                        <Td>{getDiffStr(item.createdAt)}</Td>
                                        <Td>
                                            <Button colorScheme="blue" mr={"2"} size="sm" variant={"outline"}>
                                                Sửa
                                            </Button>
                                            <Button colorScheme="red" size="sm" variant={"outline"}>
                                                Xóa
                                            </Button>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>
            </Center>
        </main>
    );
}

export async function getServerSideProps(context) {
    const protocol = context.req.headers["x-forwarded-proto"] || "http";
    const host = context.req.headers["x-forwarded-host"] || context.req.headers["host"];
    const url = `${protocol}://${host}`;
    try {
        const res = await axios.get(`${url}/api/url-shortener/user`, {
            headers: {
                ...context.req.headers,
            },
        });
        const data = res.data;
        return {
            props: {
                data,
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
