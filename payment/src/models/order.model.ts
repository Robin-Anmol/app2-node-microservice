import { OrderStatus } from "@robinanmol/common";
import mongoose, { Mongoose } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttrs {
  status: OrderStatus;
  totalPrice: number;
  id: string;
  version: number;
  userId: string;
}

interface OrderDoc extends mongoose.Document {
  status: OrderStatus;
  totalPrice: number;
  version: number;
  userId: string;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
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

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);
orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    status: attrs.status,
    version: attrs.version,
    userId: attrs.userId,
    totalPrice: attrs.totalPrice,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>("order", orderSchema);

export { Order };
