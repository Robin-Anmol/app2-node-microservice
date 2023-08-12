import { Errors, formdataProps } from "@/pages/auth";
import React, { SetStateAction } from "react";
import InputField from "../form/input";
import { ticketformdataProps } from "@/pages/tickets";

interface FormProps {
  formdata: ticketformdataProps;
  setFormData: React.Dispatch<SetStateAction<ticketformdataProps>>;
  SubmitHanlder: React.FormEventHandler<HTMLFormElement>;
  //   errors: Errors[];
}
const TicketForm = ({ formdata, setFormData, SubmitHanlder }: FormProps) => {
  return (
    <form
      onSubmit={SubmitHanlder}
      className="w-[90%] lg:w-[30%] border flex flex-col rounded-lg shadow-xl gap-6   p-7  border-grey-500 "
    >
      <InputField
        setFormData={setFormData}
        label="Ticket Name"
        type="text"
        value={formdata.title.value}
        error={formdata.title.ErrorMessage}
        placeholder="enter title for the ticket"
        name="title"
      />
      <InputField
        setFormData={setFormData}
        label="Price for Ticket"
        type="number"
        name="price"
        placeholder="ex: 300"
        value={formdata.price.value}
        error={formdata.price.ErrorMessage}
      />
      <button
        type="submit"
        className="px-5 text-lg font-medium py-3 hover:bg-purple-700 bg-purple-500 rounded-lg text-white "
      >
        Create
      </button>
    </form>
  );
};

export default TicketForm;
