import Header from "@/components/header";
import { buildClient } from "@/helper/build-request";
import "@/styles/globals.css";
import type { AppContext, AppProps } from "next/app";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useRouter } from "next/router";

export interface CurrentUser {
  email: string;
  iat: number;
  id: string;
}

interface AppPageProps extends AppProps {
  currentUser: CurrentUser;
  errors?: {
    status: number;
    message: string;
  };
}

export default function App({
  Component,
  pageProps,
  currentUser,
  errors,
}: AppPageProps) {
  return (
    <div className="w-full h-full">
      <Header currentUser={currentUser} />
      <Component currentUser={currentUser} {...pageProps} />
    </div>
  );
}

App.getInitialProps = async (appContext: AppContext) => {
  let pageProps = {};
  let currentUser = null;
  let errors = null;

  try {
    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }
    const client = buildClient(appContext.ctx);
    const response = await client.get("/api/users/currentuser");
    currentUser = { ...response.data.currentUser };
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    errors = {
      status: axiosError.response?.status || 500,
      message: axiosError.message,
    };
  }

  return {
    pageProps,
    currentUser,
    errors,
  };
};
