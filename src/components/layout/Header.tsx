import React from 'react';
import { GiHamburgerMenu } from "react-icons/gi";

const Header = () => {
  return (
    <header className="sticky top-0 bg-white border-b border-slate-200 z-30 flex justify-between w-full shadow-sm px-4 py-6">
        <div>
            <GiHamburgerMenu className="text-black text-xl"/>
            <h1>Dashboard</h1>

        </div>
        <h1>Header 3</h1>
    </header>
  )
}

export default Header
