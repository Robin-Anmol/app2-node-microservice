import { formdataProps } from "@/pages/auth";
import { ticketformdataProps } from "@/pages/tickets";
import React, { SetStateAction } from "react";

interface InputFieldProps<T extends Object> {
  setFormData: React.Dispatch<SetStateAction<T>>;
  value: string | number;
  error?: string;
  label: string;
  name: string;
  placeholder?: string;
  type: "email" | "password" | "text" | "number";
}

const InputField = <T extends Object>({
  setFormData,
  value,
  error,
  label,
  type,
  name,
  placeholder,
}: InputFieldProps<T>) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e);
    setFormData((prev) => {
      return {
        ...prev,
        [e.target.name]: {
          ErrorMessage: "",
          value: e.target.value,
        },
      };
    });
  };
  return (
    <div className="text-lg flex flex-col  ">
      <label htmlFor={label} className="text-xl text-gray-700">
        {label}
      </label>
      <input
        onChange={handleChange}
        name={name}
        value={value}
        id={label}
        placeholder={placeholder}
        className={`border mt-3 placeholder:text-gray-400 ${
          error ? "border-red-500" : "border-black"
        } py-2 px-3 text-xl rounded-lg`}
        type={type}
      />
      <span className="text-red-500 text-sm mt-2">{error}</span>
    </div>
  );
};

export default InputField;
