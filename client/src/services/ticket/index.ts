import axios from "axios";

async function create(data: { title: string; price: number }) {
  try {
    const response = await axios.post(`/api/tickets`, data);
    return { response };
  } catch (errors: any) {
    return { errors: errors.response.data.errors };
  }
}
async function updateTicketById(
  ticketId: string,
  data: { title: string; price: number }
) {
  try {
    const response = await axios.patch(`/api/tickets/${ticketId}`, data);
    return { response };
  } catch (errors: any) {
    return { errors: errors.response.data.errors };
  }
}

async function deleteTicketById(ticketId: string) {
  try {
    const response = await axios.delete(`/api/tickets/${ticketId}`);
    return { response };
  } catch (errors: any) {
    return { errors: errors.response.data.errors };
  }
}

export const TicketService = {
  create,
  updateTicketById,
  deleteTicketById,
};
