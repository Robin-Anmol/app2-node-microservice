import { buildClient } from "@/helper/build-request";
import { NextPageContext } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { ticket } from "..";
import { AxiosError } from "axios";
import { FiEdit } from "react-icons/fi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { CurrentUser } from "../_app";
import { TicketService } from "@/services";
import TicketForm from "@/components/ticketForm/form";
import { Errors } from "../auth";
import { ticketformdataProps } from ".";
import { OrderService } from "@/services/order";
interface TicketByIdProps {
  currentUser: CurrentUser;
  tickets: {
    orderId?: string;
  } & ticket;
  error?: {
    status: number;
    message: string;
  };
}

const TicketById = ({ tickets, error, currentUser }: TicketByIdProps) => {
  const router = useRouter();

  const [formdata, setFormData] = useState<ticketformdataProps>({
    title: {
      value: tickets.title,
    },
    price: {
      value: tickets.price - 0,
    },
  });

  const [errors, setErrors] = useState<Errors[]>([]);

  const OrderCreatedHanlder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(`Create Order`);
    CreateOrder();
  };

  async function CreateOrder() {
    const { response, errors } = await OrderService.createOrder({
      ticketId: tickets.id,
    });
    // console.log(response?.data.id);
    if (response && response.data.id) {
      return router.replace(`/orders/${response?.data.id}`);
    }

    if (errors) {
      router.push(`/auth?redirect=\/tickets/${tickets.id}`);
      alert(`${errors[0].message}\nredirecting to login page`);
    }
  }

  const ticketDeleteHanlder = async () => {
    const { errors } = await TicketService.deleteTicketById(tickets.id);

    if (errors) {
      alert(errors[0].message);
    } else {
      return router.push("/");
    }
  };

  const ticketEditHanlder = () => {
    router.replace(`/tickets/${tickets.id}?edit=true`);
  };

  const SubmitHanlder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(formdata);
    updateTicketById();
  };

  async function updateTicketById() {
    const { response, errors } = await TicketService.updateTicketById(
      tickets.id,
      {
        title: formdata.title.value,
        price: formdata.price.value,
      }
    );

    if (errors) {
      updateErrorState(errors);
    }

    if (response) {
      router.push("/");
      clearState();
    }
  }

  function updateErrorState(errors: Errors[]) {
    setErrors([]);
    errors.map((err: Errors) => {
      if (!err.field) {
        return setErrors((prev) => {
          return [
            ...prev,
            {
              field: "title",
              message: err.message,
            },
          ];
        });
      } else {
        return setErrors((prev) => {
          return [...prev, err];
        });
      }
    });
  }

  function clearState() {
    setFormData({
      title: {
        value: "",
      },
      price: {
        value: 0,
      },
    });
  }

  return (
    <div className="flex min-h-screen w-full   items-center justify-center">
      {router.query.edit ? (
        <div className="h-full w-full flex flex-col gap-7   items-center justify-center">
          <h1 className="text-3xl text-gray-700 font-semibold drop-shadow-xl ">
            Edit Ticket Details
          </h1>
          <TicketForm
            btnText={"Save Ticket"}
            formdata={formdata}
            setFormData={setFormData}
            SubmitHanlder={SubmitHanlder}
          />
        </div>
      ) : (
        <div className="h-full w-full flex flex-col gap-7   items-center justify-center">
          <form
            onSubmit={OrderCreatedHanlder}
            className="w-[90%] lg:w-[30%]  relative border flex flex-col rounded-lg shadow-xl gap-4   p-7  border-grey-500 "
          >
            {tickets.userId === currentUser?.id && !tickets.orderId && (
              <div className="flex gap-2 p-2 items-center absolute top-1 right-1 ">
                <FiEdit
                  onClick={ticketEditHanlder}
                  className="text-2xl  cursor-pointer font-bold text-purple-500"
                />
                <MdOutlineDeleteOutline
                  onClick={ticketDeleteHanlder}
                  className="active:scale-75 cursor-pointer text-3xl font-bold text-red-500"
                />
              </div>
            )}
            <h1 className="text-3xl mt-4 w-[90%] text-gray-700 font-semibold drop-shadow-xl ">
              {tickets.title}
            </h1>
            <div className="mt-4 gap-4 flex flex-col">
              <h3 className="text-green-600 font-semibold text-xl">
                price - &#8377; {tickets.price}
              </h3>
              <h3 className="text-red-500 font-semibold text-xl">
                status - {tickets.orderId ? "reserved" : "available"}
              </h3>
            </div>
            <button
              disabled={tickets.orderId ? true : false}
              type="submit"
              className={`"px-5  text-lg font-medium py-3 ${
                tickets.orderId
                  ? "bg-gray-500  cursor-not-allowed"
                  : "hover:bg-purple-700 bg-purple-500"
              } rounded-lg text-white "`}
            >
              {tickets.orderId ? "Reserved" : "Purchase"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TicketById;

TicketById.getInitialProps = async (ctx: NextPageContext) => {
  let tickets = {};
  let error = null;
  try {
    // console.log(ctx);
    const client = buildClient(ctx);
    const response = await client.get(`/api/tickets/${ctx.query.ticketId}`);

    tickets = response.data;
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    error = {
      status: axiosError.response?.status || 500,
      message: axiosError.message,
    };
  }
  return {
    tickets,
    error,
  };
};
