import axios from "axios";

async function create(data: { title: string; price: number }) {
  try {
    const response = await axios.post(`/api/tickets`, data);
    return { response };
  } catch (errors: any) {
    return { errors: errors.response.data.errors };
  }
}

export const TicketService = {
  create,
};
