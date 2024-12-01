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

interface RouteDetails {
  title: string;
  backLink?: string;
}

const routeMappings: Record<string, RouteDetails> = {
  "/": { title: "Dashboard" },
  "/orders": { title: "Orders" },
  "/revenue": { title: "Revenue" },
  "/users": { title: "Users" },
  "/users/:id": { title: "User Details", backLink: "/users" },
  "/professionals": { title: "Beauticians List" },
  "/professionals/:id": { title: "Professional Details", backLink: "/professionals" },
  "/dashboard/verifications": { title: "Verified Beauticians" },
  "/messaging": { title: "Messaging" },
  "/settings": { title: "Settings" },
  "/users/create-user": { title: "Create User", backLink: "/users" },
  "/booths": { title: "Booths" },
  "/booths/create-booth": { title: "Create Booth", backLink: "/booths" },
  "/booths/:id": { title: "Booth Details", backLink: "/booths" },
  "/orders/:id": { title: "Order Details", backLink: "/orders" },
  "/ledgers/create-loan": { title: "Create Loan" },
  "/ledgers/books": { title: "Books" },
  "/ledgers/books/:id": { title: "Books Details", backLink: "/ledgers/books" },
  "/dashboard/verifications/:id": { title: "Verified Beauticians Details", backLink: "/dashboard/verifications" }
};

const getDynamicRouteDetails = (pathname: string): RouteDetails => {
  for (const [route, details] of Object.entries(routeMappings)) {
    const dynamicRouteMatch = route.includes(":")
      ? new RegExp(`^${route.replace(/:\w+/g, "[^/]+")}$`).test(pathname)
      : route === pathname;

    if (dynamicRouteMatch) return details;
  }
  return { title: "Dashboard" };
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { title, backLink } = getDynamicRouteDetails(location.pathname);

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
            {backLink ? (
              <Link
                to={backLink}
                className="text-gray-600 font-bold flex items-center space-x-2 hover:underline"
              >
                <FaChevronLeft />
                <span>{title}</span>
              </Link>
            ) : (
              <div className="text-gray-600 font-bold">{title}</div>
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
