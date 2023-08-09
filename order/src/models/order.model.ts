import mongoose from "mongoose";
import { OrderStatus } from "@robinanmol/common";
import { TicketDoc } from "./ticket.model";
interface OrdersAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrdersModel extends mongoose.Model<OrdersDoc> {
  build(attrs: OrdersAttrs): OrdersDoc;
}

interface OrdersDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
  version: number;
  //   createdAt: string;
  //   updatedAt: string;
}

const OrdersSchema = new mongoose.Schema<OrdersAttrs>(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      required: true,
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

OrdersSchema.set("versionKey", "version");
OrdersSchema.statics.build = (attrs: OrdersAttrs) => {
  return new Orders(attrs);
};
const Orders = mongoose.model<OrdersDoc, OrdersModel>("Orders", OrdersSchema);

export { Orders, OrderStatus };
