import React, { ReactNode } from "react";
import {
    IconButton,
    Avatar,
    Box,
    CloseButton,
    Flex,
    HStack,
    VStack,
    Icon,
    useColorModeValue,
    Link,
    Drawer,
    DrawerContent,
    Text,
    useDisclosure,
    BoxProps,
    FlexProps,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Button,
    Heading,
} from "@chakra-ui/react";
import { FiHome, FiTrendingUp, FiCompass, FiStar, FiSettings, FiMenu, FiBell, FiChevronDown } from "react-icons/fi";
import { IconType } from "react-icons";
import { ReactText } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import LinkNext from "next/link";
import { useRouter } from "next/router";
const LinkItems = [
    { name: "Home", icon: FiHome },
    { name: "Trending", icon: FiTrendingUp },
    { name: "Explore", icon: FiCompass },
    { name: "Favourites", icon: FiStar },
    { name: "Settings", icon: FiSettings },
];

export default function Layout({ children }) {
    return (
        <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
            <MobileNav />
            <Box ml={{ base: 0, md: 0 }} p="4">
                {children}
            </Box>
        </Box>
    );
}

const NavItem = ({ icon, children, ...rest }) => {
    return (
        <Link href="#" style={{ textDecoration: "none" }} _focus={{ boxShadow: "none" }}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: "cyan.400",
                    color: "white",
                }}
                {...rest}
            >
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: "white",
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};

const MobileNav = ({ ...rest }) => {
    const { data } = useSession();
    const { push } = useRouter();
    const MenuAuth = (
        <Menu>
            <MenuButton cursor={"pointer"} py={2} transition="all 0.3s" _focus={{ boxShadow: "none" }}>
                <HStack>
                    <Avatar
                        size={"sm"}
                        src={
                            data?.user?.image ||
                            "https://media.discordapp.net/attachments/745580405088059442/1132218031796408320/2696ba1f83b1728c8c1c58216070bfb8.png"
                        }
                    />
                    <VStack display={{ base: "none", md: "flex" }} alignItems="flex-start" spacing="1px" ml="2">
                        <Text fontSize="sm">{data?.user?.name}</Text>
                    </VStack>
                    <Box display={{ base: "none", md: "flex" }}>
                        <FiChevronDown />
                    </Box>
                </HStack>
            </MenuButton>
            <MenuList
                bg={useColorModeValue("white", "gray.900")}
                borderColor={useColorModeValue("gray.200", "gray.700")}
            >
                <MenuItem>Profile</MenuItem>
                <MenuItem onClick={() => push("/manage")}>Quản lý liên kết</MenuItem>
                <MenuDivider />
                <MenuItem onClick={signOut}>Đăng xuất</MenuItem>
            </MenuList>
        </Menu>
    );
    return (
        <Flex
            ml={{ base: 0, md: 0 }}
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue("white", "gray.900")}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue("gray.200", "gray.700")}
            justifyContent={{ base: "space-between", md: "space-between" }}
            {...rest}
        >
            <Flex spacing={{ base: "0", md: "6" }}>
                <Heading size="md" fontWeight="semibold" color="cyan.400">
                    <Link href="/">Link Shortener</Link>
                </Heading>
            </Flex>
            <HStack spacing={{ base: "0", md: "6" }}>
                <Flex alignItems={"center"}>
                    {data?.user && MenuAuth}
                    {!data?.user && (
                        <Button colorScheme="teal" variant="solid" onClick={signIn}>
                            Đăng nhập
                        </Button>
                    )}
                </Flex>
            </HStack>
        </Flex>
    );
};
