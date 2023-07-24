import { getDiffField, getDiffStr, randomUniqueId } from "@/utils";
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
    Link as ChakraLink,
    Tr,
    useColorModeValue,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    FormControl,
    FormLabel,
    ModalFooter,
    useDisclosure,
    Input,
    InputRightAddon,
    InputGroup,
} from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";

export default function LinkManage({ data: rawData, appDomain, headers }) {
    const toast = useToast();
    const [data, setData] = React.useState(rawData);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const { setValue, register, handleSubmit } = useForm({
        defaultValues: {
            originalUrl: "",
            code: "",
            password: "",
        },
    });
    const onEdit = (item) => {
        const option = {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        };
        setValue("originalUrl", item.originalUrl, option);
        setValue("code", item.code, option);
        setValue("password", item.password, option);
        onOpen();
    };
    const onSubmit = (formData) => {
        const oldData = data.find((item) => item.originalUrl === formData.originalUrl);
        setIsLoading(true);
        axios
            .patch(
                `/api/url-shortener/${oldData.code}`,
                {
                    oldCode: oldData.code,
                    newCode: formData.code,
                    password: formData.password,
                },
                {
                    headers,
                }
            )
            .then((res) => {
                if (res.data) {
                    setData(
                        data.map((item) => {
                            if (item.code === oldData.code) {
                                return res.data;
                            }
                            return item;
                        })
                    );
                    onClose();
                    toast({
                        title: "Thành công",
                        description: "Cập nhật thành công",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                } else {
                    toast({
                        title: "Thất bại",
                        description: "Cập nhật thất bại",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };
    const onDel = async (code) => {
        const res = await axios.delete(`/api/url-shortener/${code}`, {
            headers,
        });
        if (res.data.isDeleted) {
            toast({
                title: "Xóa thành công",
                description: "Liên kết đã được xóa",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            setData(data.filter((item) => item.code !== code));
        } else {
            toast({
                title: "thất bại",
                description: "Xóa thất bại",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <main className="min-h-[80vh] w-full">
            <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent as={"form"} onSubmit={handleSubmit(onSubmit)}>
                    <ModalHeader>
                        <Heading fontSize={"2xl"} fontFamily={"body"}>
                            Sửa liên kết
                        </Heading>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl isReadOnly isRequired>
                            <FormLabel>Liên kết gốc</FormLabel>
                            <Input ref={initialRef} placeholder="Liên kết gốc" {...register("originalUrl")} />
                        </FormControl>

                        <FormControl mt={4} isRequired>
                            <FormLabel>Id</FormLabel>
                            <InputGroup>
                                <Input placeholder="Id" {...register("code")} />
                                <InputRightAddon
                                    onClick={() => {
                                        setValue("code", randomUniqueId(), {
                                            shouldDirty: true,
                                            shouldTouch: true,
                                            shouldValidate: true,
                                        });
                                    }}
                                >
                                    Random
                                </InputRightAddon>
                            </InputGroup>
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Mật khẩu (tuỳ chọn)</FormLabel>
                            <Input placeholder="Mật khẩu" {...register("password")} />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} type="submit" isLoading={isLoading}>
                            Lưu
                        </Button>
                        <Button onClick={onClose}>Hủy</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
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
                                        <Td>
                                            <ChakraLink color={"blue.500"} as={Link} href={`/go/${item.code}`}>
                                                {item.code}
                                            </ChakraLink>
                                        </Td>
                                        <Td>
                                            <ChakraLink as={Link} whiteSpace={"pre-wrap"} href={item.originalUrl}>
                                                {item.originalUrl.length > 30
                                                    ? item.originalUrl.slice(0, 30) + "..."
                                                    : item.originalUrl}
                                            </ChakraLink>
                                        </Td>
                                        <Td>{item.visits}</Td>
                                        <Td>{item.password?.length > 0 ? item.password : "Không"}</Td>
                                        <Td>{getDiffStr(item.createdAt)}</Td>
                                        <Td>
                                            <Button
                                                colorScheme="blue"
                                                mr={"2"}
                                                size="sm"
                                                variant={"outline"}
                                                onClick={() => onEdit(item)}
                                            >
                                                Sửa
                                            </Button>
                                            <Button
                                                colorScheme="red"
                                                size="sm"
                                                variant={"outline"}
                                                onClick={() => onDel(item.code)}
                                            >
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
    try {
        const res = await axios.get(`${process.env.APP_DOMAIN}/api/url-shortener/user`, {
            headers: {
                ...context.req.headers,
            },
        });
        const data = res.data;
        return {
            props: {
                data,
                appDomain: process.env.APP_DOMAIN,
                headers: context.req.headers,
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
