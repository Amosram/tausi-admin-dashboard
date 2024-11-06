import React, { useState } from 'react'
import { BsArrowLeftShort } from "react-icons/bs";
import { IoIosWallet } from "react-icons/io";
import { GoHomeFill } from "react-icons/go";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarTrigger
} from '../ui/sidebar';


const SideBar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useLocation();
    const routName = router.pathname;


    const menuItems = [
        {
            title: 'Dashboard',
            icon: <GoHomeFill />,
            link: '/',
            submenu: false,
            submenuItems: []
        },
        {
            title: 'Orders',
            icon: <FaShoppingCart />,
            link: '/orders',
            submenu: false
        },
        {
            title: 'Revenue',
            icon: <IoIosWallet />,
            link: '/revenue'
        }
    ]

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarTrigger />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroupLabel>Menu</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {menuItems.map((menuItem, index) => (
                            <SidebarMenuItem>
                                <Link to={menuItem.link} className="flex gap-6 items-center my-2 font-semibold px-4 py-5" key={index}>
                                    <span className={`text-3xl ${routName === menuItem.link ? 'text-primary' : 'text-black'}`}>
                                        {menuItem.icon}
                                    </span>

                                    <p className={`font-semibold text-lg ${sidebarOpen ? 'block' : 'hidden'} ${routName === menuItem.link ? 'text-primary' : 'text-black'} transition-all duration-300`}>{menuItem.title}</p>
                                </Link>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
                <h1>Side Bar Content</h1>
            </SidebarContent>
            <SidebarFooter>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="text-white bg-primary-500 p-2 rounded-full fixed bottom-5 right-5"
                >
                    <BsArrowLeftShort />
                </button>
            </SidebarFooter>
        </Sidebar>
    )
}

export default SideBar
