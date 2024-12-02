import { IoIosWallet, IoMdSettings } from "react-icons/io";
import { IoLogoWechat } from "react-icons/io5";
import { GoHomeFill } from "react-icons/go";
import { FaShoppingCart, FaUserAlt, } from "react-icons/fa";
import { RiBookletFill, RiFile4Fill } from "react-icons/ri";
import { FaUserCheck } from "react-icons/fa6";
import { MdSpa, MdStore } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const SidebarAccordion = ({ title, icon, children, isOpen, onLinkClick  }) => {
  const { pathname } = useLocation();
  const isActive = children.some((child) => pathname.startsWith(child.link));

  if (!isOpen) {
    // Render children as standalone menu items when sidebar is collapsed
    return (
      <>
        {children.map(({ title, icon, link }) => (
          <SidebarMenuItem key={title}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to={link}
                    className={`flex items-center justify-center font-semibold px-2 py-5 hover:bg-primary-extralight ${
                      pathname === link
                        ? "bg-primary-extralight border-r-8 border-primary dark:border-[#ef3e23] text-primary dark:text-[#ef3e23]"
                        : "text-black dark:text-primary hover:dark:text-black"
                    }`}
                  >
                    <span className="text-2xl">{icon}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </SidebarMenuItem>
        ))}
      </>
    );
  }

  // Render as an accordion when sidebar is open
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={isActive ? "accordion" : undefined}
    >
      <AccordionItem value="accordion">
        <AccordionTrigger
          className={`flex items-center gap-6 px-5 py-5 font-semibold hover:bg-primary-extralight text-gray-500 border-t`}
        >
          <span className="text-2xl">{icon}</span>
          <p className="text-lg">{title}</p>
        </AccordionTrigger>
        <AccordionContent className="space-y-2">
          {children.map(({ title, icon, link }) => (
            <Link
              onClick={onLinkClick}
              key={title}
              to={link}
              className={`flex items-center gap-4 pl-14 pr-5 py-5 font-medium rounded-md hover:bg-primary-extralight ${
                pathname === link
                  ? "bg-primary-extralight text-primary border-r-8 border-primary dark:text-secondary"
                  : "text-gray-500 hover:text-primary dark:text-primary hover:dark:text-black"
              }`}
            >
              <span className="text-xl">{icon}</span>
              <p className="text-lg">{title}</p>
            </Link>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const menuItems = [
  { title: "Dashboard", icon: <GoHomeFill />, link: "/" },
  { title: "Orders", icon: <FaShoppingCart />, link: "/orders" },
  { title: "Revenue", icon: <IoIosWallet />, link: "/revenue" },
  { title: "Users", icon: <FaUserAlt />, link: "/users" },
  {
    title: "Beauticians",
    icon: <MdSpa />,
    type: "accordion",
    children: [
      { title: "Applications", icon: <RiFile4Fill />, link: "/dashboard/verifications" },
      { title: "Beautician List", icon: <FaUserCheck />, link: "/professionals" },
    ],
  },
  { title: "Ledger", icon: <RiBookletFill />, link: "/ledgers/books" },
  { title: "Booths", icon: <MdStore />, link: "/booths" },
  { title: "Messaging", icon: <IoLogoWechat />, link: "/messaging" },
  { title: "Settings", icon: <IoMdSettings />, link: "/settings" },
];

const SideBar = () => {
  const { open, setOpenMobile } = useSidebar();
  const { pathname } = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <img
          src="/tausi_logo-2.png"
          alt="Logo"
          className="w-32 mx-auto py-2 dark:hidden"
        />
        <img
          src="/tausi_logo.png"
          alt="Logo"
          className="w-32 mx-auto py-2 dark:block hidden"
        />
      </SidebarHeader>
      <SidebarContent className="mt-2 overflow-y-auto custom-scrollbar">
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.map((item) => {
              if (item.type === "accordion") {
                return (
                  <SidebarAccordion
                    key={item.title}
                    title={item.title}
                    icon={item.icon}
                    children={item.children}
                    isOpen={open}
                    onLinkClick={() => setOpenMobile(false)}
                  />
                );
              }
              return (
                <SidebarMenuItem key={item.title}>
                  {open ? (
                    <Link
                      onClick={() => setOpenMobile(false)}
                      to={item.link}
                      className={`flex gap-6 items-center font-semibold px-5 py-5 hover:bg-primary-extralight ${
                        pathname === item.link
                          ? "bg-primary-extralight border-r-8 border-primary dark:border-secondary text-primary dark:text-secondary"
                          : "text-gray-500 dark:text-primary hover:dark:text-black"
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <p className="font-semibold text-lg">{item.title}</p>
                    </Link>
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            to={item.link}
                            className={`flex items-center justify-center font-semibold px-2 py-5 hover:bg-primary-extralight ${
                              pathname === item.link
                                ? "bg-primary-extralight border-r-8 border-primary dark:border-[#ef3e23] text-primary dark:text-[#ef3e23]"
                                : "text-black dark:text-primary hover:dark:text-black"
                            }`}
                          >
                            <span className="text-2xl">{item.icon}</span>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{item.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      {open ? (
        <SidebarFooter className="flex items-center border-t border-gray-300 dark:text-black">
          <div className="px-3 py-2 bg-primary-superlight flex gap-2 items-center">
            <img src="/tausi-logo.png" alt="Footer Logo" className="w-8 h-8" />
            <div className="flex flex-col gap-1 text-sm">
              <p>tausi admin dashboard</p>
              <p className="font-semibold">
                &copy; {new Date().getFullYear()} All Rights Reserved
              </p>
            </div>
          </div>
        </SidebarFooter>
      ) : (
        <SidebarFooter className="border-t border-gray-300 dark:text-black">
          <div className="flex flex-col items-center ">
            <img src="/tausi-logo.png" alt="Footer Logo" className="w-6 h-6" />
            <p className="text-[12px] text-center font-semibold dark:hidden">
              &copy; 2022
            </p>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};

export default SideBar;
