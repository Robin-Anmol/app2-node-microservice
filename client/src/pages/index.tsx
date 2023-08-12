import { useEffect } from "react"; // Import useEffect if used in this component
import { buildClient } from "@/helper/build-request";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { NextPageContext } from "next";
import { AppContext } from "next/app";
import TicketCard from "@/components/ticketCard";
import { CurrentUser } from "./_app";

export interface ticket {
  title: string;
  price: number;
  userId: string;
  version: number;
  id: string;
}

interface LandingPageProps {
  tickets: ticket[];
  currentUser: CurrentUser;
  errors?: {
    status: number;
    message: string;
  };
}

export default function LandingPage({
  tickets,
  currentUser,
  errors,
}: LandingPageProps) {
  const router = useRouter();
  console.log(currentUser);
  if (errors?.status === 500) {
    console.log(errors.message);
    return;
  }

  return (
    <main className="flex h-full w-full mt-10  justify-center">
      <div className="h-full w-[90%]  gap-7 flex flex-col    ">
        <div className="flex justify-between">
          <h1 className="text-3xl  text-gray-700 font-semibold drop-shadow-2xl  ">
            Ticket for Events
          </h1>
          <button
            onClick={() => router.push("/tickets")}
            className={`px-5 h-full   py-2  
                       hover:bg-purple-700 transition-colors text-white bg-purple-500
                rounded-lg  shadow-sm`}
          >
            Create Tickets
          </button>
        </div>
        <div className="w-full grid gap-4 justify-between grid-col-1 md:grid-cols-3 lg:grid-cols-4">
          {tickets.map((ticket, index) => {
            return (
              <TicketCard
                currentUser={currentUser}
                key={ticket.id}
                {...ticket}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}

LandingPage.getInitialProps = async (ctx: NextPageContext) => {
  let tickets: ticket[] = [];
  let errors = null;
  try {
    const client = buildClient(ctx);
    const response = await client.get("/api/tickets");

    tickets = [...response.data];
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    errors = {
      status: axiosError.response?.status || 500,
      message: axiosError.message,
    };
  }
  return {
    tickets,
    errors,
  };
};
