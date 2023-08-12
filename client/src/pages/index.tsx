import { useEffect } from "react"; // Import useEffect if used in this component
import { buildClient } from "@/helper/build-request";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { NextPageContext } from "next";

interface CurrentUser {
  email: string;
  iat: number;
  id: string;
}

interface LandingPageProps {
  currentUser: CurrentUser;
  errors?: {
    status: number;
    message: string;
  };
}

export default function LandingPage({ currentUser, errors }: LandingPageProps) {
  return (
    <main className={`flex min-h-screen w-full items-center justify-center`}>
      <h1 className="text-3xl text-black">{currentUser?.email}</h1>
    </main>
  );
}

LandingPage.getInitialProps = async () => {

  
};
