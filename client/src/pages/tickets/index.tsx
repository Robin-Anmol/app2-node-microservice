import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Form from "@/components/form";
import TicketForm from "@/components/ticketForm/form";
import { TicketService } from "@/services";
import { CurrentUser } from "@/pages/_app";
import { Errors } from "@/pages/auth";

export interface ticketformdataProps {
  title: {
    value: string;
    ErrorMessage?: string;
  };
  price: {
    value: number;
    ErrorMessage?: string;
  };
}

interface CreateTicketPageProps {
  currentUser: CurrentUser;
}
const CreateTicketPage = ({ currentUser }: CreateTicketPageProps) => {
  const router = useRouter();

  const [formdata, setFormData] = useState<ticketformdataProps>({
    title: {
      value: "",
    },
    price: {
      value: 0,
    },
  });

  const [errors, setErrors] = useState<Errors[]>([]);

  const SubmitHanlder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formdata);
    createNewTicket();
  };

  async function createNewTicket() {
    const { response, errors } = await TicketService.create({
      title: formdata.title.value,
      price: formdata.price.value,
    });

    if (errors) {
      updateErrorState(errors);
    }

    if (response) {
      router.push("/");
      clearState();
    }
  }

  useEffect(() => {
    errors.map((err: Errors) => {
      setFormData((prev) => {
        console.log(prev);
        console.log(err);
        return {
          ...prev,
          [err.field]: {
            ...prev[err.field as keyof ticketformdataProps],
            ErrorMessage: err.message,
          },
        };
      });
    });
  }, [errors]);

  useEffect(() => {
    if (!currentUser) {
      router.replace("/auth?redirect=tickets");
    }
  }, [currentUser, router]);
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
      <div className="h-full w-full flex flex-col gap-7   items-center justify-center">
        <h1 className="text-3xl text-gray-700 font-semibold drop-shadow-xl ">
          Create New Ticket for Events
        </h1>
        <TicketForm
          btnText={"Create"}
          formdata={formdata}
          setFormData={setFormData}
          SubmitHanlder={SubmitHanlder}
        />
      </div>
    </div>
  );
};

export default CreateTicketPage;
