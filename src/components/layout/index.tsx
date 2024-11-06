import React from 'react'
import SideBar from './SideBar'
import Header from './Header';
import { Outlet } from 'react-router-dom'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="bg-background">
            <div className="flex">
                <SideBar />
                <div className="flex flex-col flex-1">
                    <Header />
                   {children}
                </div>
            </div>


        </div>
    )
}

export default Layout;