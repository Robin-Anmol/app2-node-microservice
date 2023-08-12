import { buildClient } from "@/helper/build-request";
import { AxiosError } from "axios";
import { NextPageContext } from "next";
import React from "react";
import { CurrentUser } from "../_app";
import { ticket } from "..";

interface orderProps {
  userId: string;
  status: string;
  expiresAt: string;
  ticket: Omit<ticket, "userId">;
  version: number;
  id: string;
}
interface OrderByIdProps {
  currentUser: CurrentUser;
  order: orderProps;
  error?: {
    status: number;
    message: string;
  };
}

const OrderById = ({ currentUser, order, error }: OrderByIdProps) => {
  console.log(order);
  const date = new Date(order.expiresAt);
  console.log(date);
  return (
    <div>{`Ticket id${order.ticket?.id}->orderId ${order?.id},${order.status}  `}</div>
  );
};

export default OrderById;

OrderById.getInitialProps = async (ctx: NextPageContext) => {
  let order = {};
  let error = null;
  try {
    console.log(ctx);
    const client = buildClient(ctx);
    const response = await client.get(`/api/orders/${ctx.query.orderId}`);

    order = response.data;
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    error = {
      status: axiosError.response?.status || 500,
      message: axiosError.message,
    };
  }
  return {
    order,
    error,
  };
};
