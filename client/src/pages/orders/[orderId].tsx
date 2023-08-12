import { buildClient } from "@/helper/build-request";
import { AxiosError } from "axios";
import { NextPageContext } from "next";
import React, { useEffect, useCallback, useState } from "react";
import { CurrentUser } from "../_app";
import { ticket } from "..";
import { setInterval } from "timers";
import { useRouter } from "next/router";

export interface orderProps {
  userId: string;
  status: string;
  expiresAt: string;
  createdAt: string;
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
  const [hydrated, setHydrated] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ min: 0, sec: 0 });
  const router = useRouter();
  useEffect(() => {
    setHydrated(true);
  }, []);
  const PaymentHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/payments?orderId=${order.id}`);
  };

  useEffect(() => {
    const calculateTimeLeft = () => {
      const timeDifference =
        new Date(order.expiresAt).getTime() - new Date().getTime();

      const secondsLeft = Math.max(Math.round(timeDifference / 1000), 0);
      const minutes = Math.floor(secondsLeft / 60);
      const seconds = secondsLeft % 60;
      setTimeLeft({ min: minutes, sec: seconds });
    };
    let timer: string | number | NodeJS.Timer | undefined;
    calculateTimeLeft();
    timer = setInterval(calculateTimeLeft, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  if (!hydrated) {
    return null;
  }
  return (
    <div className="flex min-h-screen w-full   items-center justify-center">
      <div className="h-full w-full flex flex-col gap-7   items-center justify-center">
        <form
          onSubmit={PaymentHandler}
          className="w-[90%] lg:w-[30%]  relative border flex flex-col rounded-lg shadow-xl gap-4   p-7  border-grey-500 "
        >
          <h1 className="text-3xl  w-[90%] text-gray-700 font-semibold drop-shadow-xl">
            Your Order Details
          </h1>
          <h1 className="text-3xl mt-2 w-[90%] text-gray-700 font-semibold drop-shadow-xl ">
            {order.ticket.title}
          </h1>
          <div className=" gap-4 flex flex-col">
            <h3 className="text-green-600 font-semibold text-xl">
              price - &#8377; {order.ticket.price}
            </h3>
            {order.status === "created" && (
              <h3 className="text-red-500 font-semibold text-xl">
                {timeLeft.min > 0 || timeLeft.sec > 0
                  ? ` Time left to pay - ${timeLeft.min}min ${timeLeft.sec}sec`
                  : `order ${order.status}`}{" "}
              </h3>
            )}
            {order.status !== "created" && (
              <h3 className="text-red-500 font-semibold text-xl">
                order {order.status}
              </h3>
            )}
          </div>
          {order.status === "created" && (
            <button
              type="submit"
              className="px-5  text-lg font-medium py-3 hover:bg-purple-700 bg-purple-500 rounded-lg text-white "
            >
              Start Payment
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default OrderById;

OrderById.getInitialProps = async (ctx: NextPageContext) => {
  let order = {};
  let error = null;
  try {
    // console.log(ctx);
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
