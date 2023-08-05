import React, { useEffect } from "react";
import Form from "@/components/form";
import { useState } from "react";
import { loginService } from "@/services";
export interface formdataProps {
  email: {
    value: string;
    ErrorMessage?: string;
  };
  password: {
    value: string;
    ErrorMessage?: string;
  };
}
enum formTypes {
  SignIn = "Sign In",
  SignUp = "Sign Up",
}
const formTypeData = [formTypes.SignIn, formTypes.SignUp];

export interface Errors {
  message: string;
  field: string;
}

const AuthPage = () => {
  const [formdata, setFormData] = useState<formdataProps>({
    email: {
      value: "",
    },
    password: {
      value: "",
    },
  });
  const [formType, setFormType] = useState(formTypes.SignIn);
  const [errors, setErrors] = useState<Errors[]>([]);

  const SubmitHanlder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formdata);

    switch (formType) {
      case formTypes.SignIn:
        signin();
        break;
      case formTypes.SignUp:
        signup();
        break;
    }
  };

  async function signin() {
    const { response, errors } = await loginService.signIn({
      email: formdata.email.value,
      password: formdata.password.value,
    });

    if (errors) {
      updateErrorState(errors);
    }

    if (response) {
      clearState();
    }
  }

  
  async function signup() {
    const { response, errors } = await loginService.signUp({
      email: formdata.email.value,
      password: formdata.password.value,
    });

    if (errors) {
      updateErrorState(errors);
    }

    if (response) {
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
            ...prev[err.field as keyof formdataProps],
            ErrorMessage: err.message,
          },
        };
      });
    });
  }, [errors]);

  function updateErrorState(errors: Errors[]) {
    setErrors([]);
    errors.map((err: Errors) => {
      if (!err.field) {
        return setErrors((prev) => {
          return [
            ...prev,
            {
              field: "email",
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
      email: {
        value: "",
      },
      password: {
        value: "",
      },
    });
  }
  return (
    <main
      className={`flex min-h-screen w-full   items-center justify-center  `}
    >
      <div className="h-full w-full flex flex-col gap-5  items-center justify-center ">
        <div className="w-[90%] flex gap-2  lg:w-[30%]">
          {formTypeData.map((type) => {
            return (
              <button
                key={type}
                onClick={() => setFormType(type)}
                className={`px-5 py-2 w-full text-lg  ${
                  formType === type
                    ? "hover:bg-purple-700 transition-colors text-white bg-purple-500"
                    : "border border-black text-black"
                }  rounded-lg  shadow-sm`}
              >
                {type}
              </button>
            );
          })}
        </div>
        <Form
          SubmitHanlder={SubmitHanlder}
          formdata={formdata}
          setFormData={setFormData}
          formType={formType}
        />
      </div>
    </main>
  );
};

export default AuthPage;
