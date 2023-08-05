import { CurrentUser } from "@/pages/_app";
import { formTypeData, formTypes } from "@/pages/auth";
import { UserService } from "@/services";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

interface headerProps {
  currentUser: CurrentUser;
}

const Header = ({ currentUser }: headerProps) => {
  const router = useRouter();
  async function logouthandler() {
    await UserService.logout();
    router.push("/auth");
  }

  console.log(currentUser);
  return (
    <div className="w-full px-[10%] mx-auto h-16 flex py-3 border-b shadow-lg border-grey-500 ">
      <Link href={"/"}>
        <div className="border-2  border-purple-500 p-2">Booking App</div>
      </Link>

      <div className="flex ml-auto gap-4 h-full  ">
        {currentUser?.email && (
          <button
            onClick={() => router.push("/auth")}
            className={`px-5 h-full    
                      transition-colors text-black border border-black
                rounded-lg  shadow-sm`}
          >
            {currentUser.email}
          </button>
        )}
        {currentUser?.email && !router.pathname.includes("/auth") ? (
          <button
            onClick={logouthandler}
            className={`px-5 h-full    
                       hover:bg-purple-700 transition-colors text-white bg-purple-500
                rounded-lg  shadow-sm`}
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => router.push("/auth")}
            className={`px-5 h-full    
                       hover:bg-purple-700 transition-colors text-white bg-purple-500
                rounded-lg  shadow-sm`}
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
