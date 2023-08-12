import axios from "axios";

async function createPayment(data: {
  orderId: string;
  payment_method_id: string;
}) {
  try {
    const response = await axios.post(`/api/payments`, data);
    return { response };
  } catch (errors: any) {
    return { errors: errors.response.data.errors };
  }
}
async function confirmPayment(data: {
  orderId: string;
  payment_intent_id: string;
}) {
  try {
    const response = await axios.post(`/api/payments`, data);
    return { response };
  } catch (errors: any) {
    return { errors: errors.response.data.errors };
  }
}

export const PaymentService = { createPayment, confirmPayment };
