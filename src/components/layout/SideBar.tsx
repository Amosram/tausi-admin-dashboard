import React, { useState } from 'react'
import { BsArrowLeftShort } from "react-icons/bs";
import { IoIosWallet } from "react-icons/io";
import { GoHomeFill } from "react-icons/go";
import { FaShoppingCart } from "react-icons/fa";

const SideBar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
        <div className={`bg-white shadow-md h-screen pt-8 relative ${sidebarOpen ? 'w-72' : 'w-20'} transition-all duration-300`}>
            <BsArrowLeftShort
                className="text-3xl bg-white text-black rounded-full absolute -right-3 top-9 cursor-pointer"
                onClick={() => setSidebarOpen(!sidebarOpen)} />

            <div className="mt-16">
                {menuItems.map((menuItem, index)  => (
                    <div className="flex gap-6 items-center my-2 font-semibold px-4 py-5" key={index}>
                        <span className="text-3xl">
                        {menuItem.icon}
                        </span>

                        <p className={`font-semibold text-lg ${sidebarOpen ? 'block' : 'hidden'} transition-all duration-300`}>{menuItem.title}</p>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default SideBar
