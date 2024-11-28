import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { FaChevronDown, FaChevronLeft } from "react-icons/fa";
import { IoExitOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SidebarTrigger } from "../ui/sidebar";

const Header = () => {
  const location = useLocation();

  const titles: { [key: string]: string } = {
    "/": "Dashboard",
    "/orders": "Orders",
    "/revenue": "Revenue",
    "/users": "Users",
    "/professionals": "Beauticians List",
    "/dashboard/verifications": "Verified Beauticians",
    "/ledgers": "Ledger",
    "/messaging": "Messaging",
    "/settings": "Settings",
    "/users/create-user": "Create User",
    "/ledgers/create-loan":"Create Loan"
  };

  const getTitle = () => {
    const path = location.pathname;

    if (path.startsWith("/orders/") && path.split("/").length > 2) {
      return "Order Details";
    }

    if (path.startsWith("/professionals/") && path.split("/").length > 2) {
      return "Professional Details";
    }

    if (path.startsWith("/dashboard/verifications/") && path.split("/").length > 2) {
      return "Verified Beauticians Details";
    }


    if (path.startsWith("/users/") && path.split("/").length > 2) {
      if (path === "/users/create-user") {
        return "Create User";
      }
      return "User Details";
    }

    if (path.startsWith("/ledgers/") && path.split("/").length > 2) {
      return "Ledger Details";
    }
    

    return titles[path] || "Dashboard";
  };

  const dynamicTitle = getTitle();

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/auth/login");
  };

  return (
    <header className="sticky top-0 bg-white border-b border-slate-200 z-30 flex justify-between w-full shadow-sm px-4 py-6">
      <div className="w-full bg-white hadow-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <SidebarTrigger />
          </div>
          <div className="relative">
            {["Order Details", "Professional Details", "Verified Beauticians Details", "User Details", "Create User", "Create Loan", "Ledger Details"].includes(
              dynamicTitle
            ) ? (
                <Link
                  to={dynamicTitle === "Order Details" ? "/orders" : dynamicTitle === "Ledger Details" ? "/ledgers" : dynamicTitle === "Professional Details" ? "/professionals" : dynamicTitle === "Verified Beauticians Details" ? "/dashboard/verifications" : "/users"}
                  className="text-gray-600 font-bold flex items-center space-x-2 hover:underline"
                >
                  <FaChevronLeft />
                  <span>{dynamicTitle}</span>
                </Link>
              ) : (
                <div className="text-gray-600 font-bold">{dynamicTitle}</div>
              )}
          </div>
        </div>
        <div className="flex items-center space-x-4"></div>
        {/* Search Bar */}
        <div className="relative max-w-xs w-full mr-4">
          <input
            type="text"
            className="border rounded-full p-2 w-full bg-gray-100 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <img
              src="/searchIcon.png"
              alt="Search Icon"
              className="w-5 h-5 text-gray-500"
            />
          </span>
        </div>
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            {/* notification code = <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 absolute top-0 right-0">2</span>*/}
            <img
              src="/messagingNotificationIcon.png"
              alt="Notification Icon"
              className="w-6 h-6 cursor-pointer"
            />
          </div>
          <div className="relative">
            {/*<span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 absolute top-0 right-0">2</span>*/}
            <img
              src="/bellIcon.png"
              alt="Bell Icon"
              className="w-6 h-6 cursor-pointer"
            />
          </div>
          {/* Avatar */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-md cursor-pointer"></div>
            <div className="flex flex-col">
              <span className="text-gray-700">Franklin</span>
              <span className="text-gray-500 text-sm">Admin</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex gap-4 items-center ml-5 mr-5 pr-5 cursor-pointer">
                  <FaChevronDown className="text-gray-400 text-sm" size={12} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="
                min-w-[200px]
                mt-8
                mr-5
                rounded-md
              bg-white
                p-[5px]
                shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]
                will-change-[opacity,transform]
                data-[side=bottom]:animate-slideUpAndFade
                data-[side=left]:animate-slideRightAndFade
                data-[side=right]:animate-slideLeftAndFade
                data-[side=top]:animate-slideDownAndFade
                "
                sideOffset={5}
              >
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center justify-between p-2 cursor-pointer"
                >
                  Logout
                  <IoExitOutline className="mr-2 text-red-500" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
