import { buildClient } from "@/helper/build-request";
import { AxiosError } from "axios";
import { NextPageContext } from "next";
import React from "react";
import { orderProps } from "./[orderId]";
import { CurrentUser } from "../_app";
import MyOrdersTable from "@/components/MyOrdersTable";
interface OrderByIdProps {
  currentUser: CurrentUser;
  orders: orderProps[];
  error?: {
    status: number;
    message: string;
  };
}
const OrderListsPage = ({ orders, currentUser, error }: OrderByIdProps) => {
  return (
    <main className="flex h-full w-full mt-10  justify-center">
      <div className="h-full w-[90%]  gap-7 flex flex-col    ">
        <h1 className="text-3xl  text-gray-700 font-semibold drop-shadow-2xl  ">
          My Orders
        </h1>
        <div className="w-full h-full mb-10">
          <MyOrdersTable currentUser={currentUser} orders={orders} />
        </div>
      </div>
    </main>
  );
};

export default OrderListsPage;

OrderListsPage.getInitialProps = async (ctx: NextPageContext) => {
  let orders: orderProps[] = [];
  let errors = null;
  try {
    const client = buildClient(ctx);
    const response = await client.get("/api/orders");

    orders = [...response.data];
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    errors = {
      status: axiosError.response?.status || 500,
      message: axiosError.message,
    };
  }
  return {
    orders,
    errors,
  };
};
