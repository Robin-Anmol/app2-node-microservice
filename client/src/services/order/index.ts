import axios from "axios";

async function createOrder(data: { ticketId: string }) {
  try {
    const response = await axios.post(`/api/orders`, data);
    return { response };
  } catch (errors: any) {
    return { errors: errors.response.data.errors };
  }
}

export const OrderService = {
  createOrder,
};
