import axios, { AxiosHeaders } from "axios";
import { NextPageContext } from "next";
function buildClient({ req }: NextPageContext) {
  if (typeof window === "undefined") {
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req?.headers as unknown as AxiosHeaders,
    });
  } else {
    return axios.create({
      baseURL: "/",
    });
  }
}

export { buildClient };
