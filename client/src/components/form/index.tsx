import { Errors, formdataProps } from "@/pages/auth";
import React, { SetStateAction } from "react";
import InputField from "./input";

interface FormProps {
  formdata: formdataProps;
  formType: string;
  setFormData: React.Dispatch<SetStateAction<formdataProps>>;
  SubmitHanlder: React.FormEventHandler<HTMLFormElement>;
  //   errors: Errors[];
}
const Form = ({
  formdata,
  setFormData,
  formType,
  SubmitHanlder,
}: FormProps) => {
  return (
    <form
      onSubmit={SubmitHanlder}
      className="w-[90%] lg:w-[30%] border flex flex-col rounded-md shadow-lg gap-6   p-7  border-black"
    >
      <h1 className="text-3xl text-center font-medium">{formType}</h1>
      <InputField
        setFormData={setFormData}
        label="Email address"
        type="email"
        value={formdata.email.value}
        error={formdata.email.ErrorMessage}
        placeholder="john@example.com"
        name="email"
      />
      <InputField
        setFormData={setFormData}
        label="Password"
        type="password"
        name="password"
        value={formdata.password.value}
        error={formdata.password.ErrorMessage}
      />
      <button
        type="submit"
        className="px-5 text-lg font-medium py-3 hover:bg-purple-700 bg-purple-500 rounded-lg text-white "
      >
        {formType}{" "}
      </button>
    </form>
  );
};

export default Form;
