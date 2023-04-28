import { signOut } from "next-auth/react";
import { BiLogOut } from "react-icons/bi";
import { BsHouseFill, BsBellFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { GrMail } from "react-icons/gr";

import useCurrentUser from "@/hooks/useCurrentUser";

import SidebarItem from "./SidebarItem";
import SidebarLogo from "./SidebarLogo";
import SidebarTweetButton from "./SidebarTweetButton";

const Sidebar = () => {
  const { data: currentUser } = useCurrentUser();

  const items = [
    {
      label: "Home",
      href: "/",
      icon: BsHouseFill,
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: BsBellFill,
      auth: true,
      alert: currentUser?.hasNotification,
    },
    {
      label: "Messages",
      href: "/messages",
      icon: GrMail,
      auth: true,
    },
    {
      label: "Profile",
      href: `/users/${currentUser?.id}`,
      icon: FaUser,
      auth: true,
    },
  ];

  return (
    <div
      className="
          fixed
          md:relative
          bottom-0
          inset-x-0
          bg-black 
          order-last 
          md:order-first 
          h-fit
          md:h-full 
          md:w-auto 
          px-4 
          md:px-3 
          z-10"
    >
      {/* <div className="flex flex-col items-end"> */}
      <div
        className="
                flex 
                flex-row 
                md:flex-col 
                justify-around 

                space-y-1 
                md:space-y-2 
                w-full 
                md:w-fit
                "
      >
        <div className="hidden md:flex">
          <SidebarLogo />
        </div>
        {items.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            auth={item.auth}
            alert={item.alert}
          />
        ))}
        {currentUser && (
          <SidebarItem
            onClick={() => signOut()}
            icon={BiLogOut}
            label="Logout"
          />
        )}
        <SidebarTweetButton />
      </div>
      {/* </div> */}
    </div>
  );
};

export default Sidebar;
