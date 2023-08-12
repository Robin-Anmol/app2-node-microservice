import { CurrentUser } from "@/pages/_app";
import Link from "next/link";
import React from "react";
import { FiExternalLink } from "react-icons/fi";
interface TicketCardProps {
  title: string;
  price: number;
  id: string;
  userId: string;
  currentUser: CurrentUser;
}

const TicketCard = ({
  title,
  price,
  id,
  userId,
  currentUser,
}: TicketCardProps) => {
  return (
    <Link
      href={`/tickets/${id}`}
      className="cursor-pointer relative w-full justify-around  flex flex-col  border rounded-lg  shadow-xl drop-shadow-lg border-gray-500"
    >
      <div
        className={`flex items-center ${
          userId !== currentUser?.id
            ? "p-3 absolute top-1 mb-4 right-1 "
            : " px-3 py-1 justify-between"
        }  `}
      >
        <span className="text-md text-red-500 self-start  rounded-sm">
          {userId === currentUser?.id ? "Create By you" : ""}
        </span>
        <span
          className={`text-lg  ${
            userId !== currentUser?.id ? "absolute top-3 right-3 " : ""
          }`}
        >
          <FiExternalLink className="text-lg text-gray-500" />
        </span>
      </div>
      <div className="p-3  flex flex-col gap-2">
        <h2 className="text-gray-700 break-words whitespace-pre-wrap   max-w-prose  flex flex-col drop-shadow-lg text-2xl">
          {title}
        </h2>
        <h3 className=" font-semibold text-green-500 text-lg">
          price: &#8377;{price}
        </h3>
      </div>
    </Link>
  );
};

export default TicketCard;
