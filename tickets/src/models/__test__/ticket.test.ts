import { Tickets } from "../tickets.model";

it("version controls in updating the document", async () => {
  const ticket = Tickets.build({
    userId: "robin",
    title: "initial ticket",
    price: 300,
  });

  await ticket.save();

  const firstInstance = await Tickets.findById(ticket.id);
  const secondInstance = await Tickets.findById(ticket.id);

  firstInstance!.set({
    price: 700,
  });
  await firstInstance!.save();

  secondInstance!.set({
    price: 500,
  });

  console.log(firstInstance, "first instance");
  console.log(secondInstance, "second instance");
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }
  throw new Error("does not exist");
});

it("version no incremented on multiple save", async () => {
  const ticket = Tickets.build({
    userId: "robin",
    title: "initial ticket",
    price: 300,
  });

  await ticket.save();

  expect(ticket.version).toEqual(0);

  await ticket.save();

  expect(ticket.version).toEqual(1);

  await ticket.save();

  expect(ticket.version).toEqual(2);
});
