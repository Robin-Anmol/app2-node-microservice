import { CurrentUser } from "@/pages/_app";
import { orderProps } from "@/pages/orders/[orderId]";
import React, { useState, useEffect } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
interface OrderTableProps {
  currentUser: CurrentUser;
  orders: orderProps[];
}

type sortByType =
  | "status"
  | "createdAt"
  | "expiresAt"
  | "ticketId"
  | "id"
  | "price"
  | "#";
const MyOrdersTable = ({ currentUser, orders }: OrderTableProps) => {
  const [hydrated, setHydrated] = useState(false);
  // console.log(orders);
  React.useEffect(() => {
    setHydrated(true);
  }, []);
  const [sortBy, setSortBy] = useState<sortByType>("#");
  const [sortDirection, setsortDirection] = useState<"asc" | "des">("des");

  const handleSort = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
    const targetElement = e.target as HTMLTableRowElement;

    if (!targetElement.dataset.label) {
      return;
    }
    if (sortBy === targetElement.dataset.label) {
      console.log(targetElement.dataset.label);
      setsortDirection((prev) => (prev === "asc" ? "des" : "asc"));
    } else {
      console.log(targetElement.dataset.label);
      const type = targetElement.dataset.label as sortByType;
      setSortBy(type);
      setsortDirection("asc");
    }
  };

  const sortedOrders: orderProps[] = [...orders].sort(
    (a: orderProps, b: orderProps) => {
      if (sortBy === "ticketId") {
        const comparison = a.ticket["id"]
          .toString()
          .localeCompare(b.ticket["id"].toString());
        return sortDirection === "asc" ? comparison : -comparison;
      }
      if (sortBy === "price") {
        const comparison = a.ticket["price"] - b.ticket["price"];
        return sortDirection === "asc" ? comparison : -comparison;
      }
      if (sortBy === "#") {
        return sortDirection === "asc" ? 1 : -1;
      }

      const comparison = a[sortBy]
        .toString()
        .localeCompare(b[sortBy].toString());
      return sortDirection === "asc" ? comparison : -comparison;
    }
  );

  if (!hydrated) {
    return null;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-auto bg-white shadow-md">
        <thead className="bg-gray-100 w-full  ">
          <tr className=" " onClick={handleSort}>
            <th
              className="px-4 cursor-pointer hover:bg-purple-200 transition-all duration-300 border py-2"
              data-label="#"
            >
              <div data-label="#" className="flex  items-center">
                <span data-label="#" className="mr-1">
                  #
                </span>
                <span data-label="#">
                  {sortBy === "#" && sortDirection === "asc" ? (
                    <IoMdArrowDropup />
                  ) : (
                    <IoMdArrowDropdown />
                  )}
                </span>
              </div>
            </th>
            <th
              className="px-4 cursor-pointer  hover:bg-purple-200 transition-all duration-300  border py-2"
              data-label="id"
            >
              <div data-label="id" className="flex  items-center">
                <span data-label="id" className="mr-1">
                  Order ID
                </span>
                <span data-label="id" className="w-4 h-4">
                  {sortBy === "id" && sortDirection === "asc" ? (
                    <IoMdArrowDropup className="w-full h-full" />
                  ) : (
                    <IoMdArrowDropdown />
                  )}
                </span>
              </div>
            </th>
            <th
              className="px-4 cursor-pointer hover:bg-purple-200 transition-all duration-300 border py-2"
              data-label="status"
            >
              <div data-label="status" className="flex  items-center">
                <span data-label="status" className="mr-1">
                  {" "}
                  Status
                </span>
                <span data-label="status">
                  {sortBy === "status" && sortDirection === "asc" ? (
                    <IoMdArrowDropup />
                  ) : (
                    <IoMdArrowDropdown />
                  )}
                </span>
              </div>
            </th>
            <th
              className="px-4 cursor-pointer hover:bg-purple-200 transition-all duration-300 border py-2"
              data-label="createdAt"
            >
              <div data-label="createdAt" className="flex  items-center">
                <span data-label="createdAt" className="mr-1">
                  {" "}
                  CreatedAt
                </span>
                <span data-label="createdAt">
                  {sortBy === "createdAt" && sortDirection === "asc" ? (
                    <IoMdArrowDropup />
                  ) : (
                    <IoMdArrowDropdown />
                  )}
                </span>
              </div>
            </th>
            <th
              className="px-4 cursor-pointer hover:bg-purple-200 transition-all duration-300 border py-2"
              data-label="expiresAt"
            >
              <div data-label="expiresAt" className="flex  items-center">
                <span data-label="expiresAt" className="mr-1">
                  {" "}
                  Expires At
                </span>
                <span data-label="expiresAt">
                  {sortBy === "expiresAt" && sortDirection === "asc" ? (
                    <IoMdArrowDropup />
                  ) : (
                    <IoMdArrowDropdown />
                  )}
                </span>
              </div>
            </th>
            <th
              className="px-4 cursor-pointer hover:bg-purple-200 transition-all duration-300 border py-2"
              data-label="ticketId"
            >
              <div data-label="ticketId" className="flex  items-center">
                <span data-label="ticketId" className="mr-1">
                  Ticket ID
                </span>
                <span data-label="ticketId">
                  {sortBy === "ticketId" && sortDirection === "asc" ? (
                    <IoMdArrowDropup />
                  ) : (
                    <IoMdArrowDropdown />
                  )}
                </span>
              </div>
            </th>
            <th
              className="px-4  cursor-pointer hover:bg-purple-200 transition-all duration-300 border py-2"
              data-label="price"
            >
              <div data-label="price" className="flex  items-center">
                <span data-label="price" className="mr-1">
                  Price
                </span>
                <span data-label="price">
                  {sortBy === "price" && sortDirection === "asc" ? (
                    <IoMdArrowDropup />
                  ) : (
                    <IoMdArrowDropdown />
                  )}
                </span>
              </div>
            </th>
            <th className="px-4 cursor-pointer hover:bg-purple-200 transition-all duration-300 border  py-2">
              Details
            </th>
          </tr>
        </thead>
        <tbody className="">
          {sortedOrders.map((order, index) => {
            const adjustedIndex =
              sortDirection === "des" ? index + 1 : sortedOrders.length - index;
            return (
              <tr
                key={order.id}
                className={index % 2 === 0 ? "bg-purple-100" : "bg-white"}
              >
                <td className="border border-gray-300 px-4 py-2">{adjustedIndex}</td>

                <td className="border border-gray-300 px-4 py-2">{order.id}</td>
                <td className="border border-gray-300 px-4 py-2 capitalize">{order.status}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {typeof window !== "undefined" &&
                    new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {typeof window !== "undefined" &&
                    new Date(order.expiresAt).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">{order.ticket.id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  &#8377; {order.ticket.price}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <a
                    href={`/orders/${order.id}?details=true`}
                    className="text-blue-500 hover:underline"
                  >
                    View Details
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MyOrdersTable;
