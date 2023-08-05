import { formdataProps } from "@/pages/auth";
import axios from "axios";

async function signUp(data: { email: string; password: string }) {
  try {
    const response = await axios.post(`/api/users/signup`, data);
    return { response };
  } catch (errors: any) {
    return { errors: errors.response.data.errors };
  }
}
async function signIn(data: { email: string; password: string }) {
  try {
    const response = await axios.post(`/api/users/signin`, data);
    return { response };
  } catch (errors: any) {
    return { errors: errors.response.data.errors };
  }
}
async function getCurrentUser() {
  try {
    const response = await axios.get(`/api/users/currentuser`);
    return { response };
  } catch (errors: any) {
    return { errors: errors.response.data.errors };
  }
}

export const UserService = { signUp, signIn, getCurrentUser };
