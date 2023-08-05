import { formdataProps } from "@/pages/auth";
import React, { SetStateAction } from "react";

interface InputFieldProps {
  setFormData: React.Dispatch<SetStateAction<formdataProps>>;
  value: string;
  error?: string;
  label: string;
  name: string;
  placeholder?: string;
  type: "email" | "password" | "text";
}

const InputField = ({
  setFormData,
  value,
  error,
  label,
  type,
  name,
  placeholder,
}: InputFieldProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
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
      <label htmlFor={label} className="text-xl">
        {label}
      </label>
      <input
        onChange={handleChange}
        name={name}
        value={value}
        id={label}
        placeholder={placeholder}
        className={`border mt-3 ${
          error ? "border-red-500" : "border-black"
        } py-2 px-3 text-xl rounded-lg`}
        type={type}
      />
      <span className="text-red-500 text-sm mt-2">{error}</span>
    </div>
  );
};

export default InputField;
