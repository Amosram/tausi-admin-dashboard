import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { FaChevronDown, FaChevronLeft } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SidebarTrigger } from "../ui/sidebar";
import { auth } from "@/app/firebase";
import { DoorOpen, Moon, Search, SearchIcon, Settings, Sun } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";
import { MdChat, MdNotifications } from "react-icons/md";
import { useAppDispatch } from "@/redux/hooks";
import { clearLocalState, signOutUser } from "@/redux/reducers/userSlice";

interface RouteDetails {
  title: string;
  backLink?: string;
}

const routeMappings: Record<string, RouteDetails> = {
  "/": { title: "Dashboard" },
  "/orders": { title: "Orders" },
  "/revenue": { title: "Revenue" },
  "/users": { title: "Users" },
  "/users/list": { title: "Users List", backLink: "/users" },
  "/users/:id": { title: "User Details", backLink: "/users/list" },
  "/users/create-user": { title: "Create User", backLink: "/users/list" },
  "/professionals": { title: "Beauticians List" },
  "/professionals/:id": {
    title: "Professional Details",
    backLink: "/professionals",
  },
  "/dashboard/verifications": { title: "Applications" },
  "/messaging": { title: "Messaging" },
  "/settings": { title: "Settings" },
  "/booths": { title: "Booths" },
  "/booths/list": { title: "Booth List", backLink: "/booths" },
  "/booths/create-booth": { title: "Create Booth", backLink: "/booths/list" },
  "/booths/:id": { title: "Booth Details", backLink: "/booths/list" },
  "/booths/:id/logs": { title: "Booth Logs" },
  "/booths/:id/assignments": { title: "Booth Assignments" },
  "/booths/:id/edit": { title: "Edit Booth" },
  "/booths/:id/orders": { title: "Booth Orders" },
  "/orders/:id": { title: "Order Details", backLink: "/orders" },
  "/ledgers/create-loan": { title: "Create Loan" },
  "/ledgers": { title: "Businesses" },
  "/ledgers/:ownerId": { title: "Business Details", backLink: "/ledgers" },
  "/dashboard/verifications/:id": {
    title: "Applications Details",
    backLink: "/dashboard/verifications",
  },
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
  const location = useLocation();
  const dispatch = useAppDispatch();

  const titles: { [key: string]: string } = {
    "/": "Dashboard",
    "/orders": "Orders",
    "/revenue": "Revenue",
    "/users": "Users",
    "/professionals": "Beauticians List",
    "/dashboard/verifications": "Applications",
    "/ledgers": "Businesses",
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
      return "Verified Beautician Details";
    }

    if (path.startsWith("/dashboard/verifications/") && path.split("/").length > 2) {
      return "Applications Details";
    }


    if (path.startsWith("/users/") && path.split("/").length > 2) {
      if (path === "/users/create-user") {
        return "Create User";
      }
      return "User Details";
    }

    if (path.startsWith("/ledgers") && path.split("/").length > 2) {
      return "Business Details";
    }
    

    return titles[path] || "Dashboard";
  };

  const { title: dynamicTitle, backLink } = getDynamicRouteDetails(location.pathname);

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(signOutUser());
    dispatch(clearLocalState());
    navigate("/auth/login");
  };

  const {theme, setTheme} = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };



  return (
    <header className="sticky top-0 border-b z-30 flex justify-between w-full shadow-sm px-4 py-6 bg-card text-card-foreground transition-colors duration-300">
      <div className="w-full flex items-center justify-between ">
        <div className="flex items-center space-x-4">
          {/* Sidebar trigger */}
          <div className="relative">
            <SidebarTrigger/>
          </div>

          <div className="relative flex gap-2 flex-col items-center">
            {/* Main title and optional back link */}
            {backLink ? (
              <Link
                to={backLink}
                className="font-semibold flex items-center space-x-2 hover:text-primary transition-colors dark:text-gray-300"
              >
                <FaChevronLeft className="text-lg dark:text-gray-300" />
                <span className="text-lg">{dynamicTitle}</span>
              </Link>
            ) : (
              <div className="text-gray-700 font-semibold text-lg dark:text-gray-300">{dynamicTitle}</div>
            )}

            {/* Additional back link (for browser history) */}
            {/* {backLink && (
              <button
                onClick={() => window.history.back()}
                className="text-blue-600 font-medium text-xs flex items-center space-x-2 hover:text-primary hover:underline"
              >
                <span>Back to previous</span>
              </button>
            )} */}
          </div>
        </div>

        <div className="flex items-center space-x-4"></div>
        {/* Search Bar */}
        <div className="relative max-w-xs w-full mr-4">
          <input
            type="text"
            className="border rounded-full p-2 w-full bg-gray-100 dark:bg-gray-700 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </span>
        </div>
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            {/* notification code = <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 absolute top-0 right-0">2</span>*/}
            <MdChat size={26} fill="orange"/>
          </div>
          <div className="relative">
            {/*<span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 absolute top-0 right-0">2</span>*/}
            <MdNotifications size={26} />
          </div>
          {/* Avatar */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-md cursor-pointer">
              <img
                src="/placeholder.png"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-gray-700 dark:text-gray-300">{auth.currentUser?.displayName}</span>
              <span className="text-gray-500 text-sm dark:text-gray-300">Admin</span>
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
                mt-10
                mr-5
                rounded-md
                bg-card
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
                  onClick={toggleTheme}
                  className="flex items-center justify-between p-2 cursor-pointer">
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  {theme === "dark" ? (
                  <Sun className="mr-2 text-yellow-500" />
                  ): (
                  <Moon className="mr-2 text-gray-600" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center justify-between p-2 cursor-pointer">
                  <Link to="/settings">
                    Settings
                  </Link>
                  <Settings className="mr-2 text-blue-500" />
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center justify-between p-2 cursor-pointer"
                >
                  Logout
                  <DoorOpen className="mr-2 text-red-500" />
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