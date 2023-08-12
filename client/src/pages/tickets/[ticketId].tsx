import { useRouter } from "next/router";
import React from "react";
const TicketById = () => {
  const router = useRouter();
  //   console.log(router);
  const { ticketId } = router.query;
  return <div>{` ${ticketId}`}</div>;
};

export default TicketById;
