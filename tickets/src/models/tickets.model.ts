import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketsAttrs {
  title: string;
  price: number;
  userId: string;
  orderId?: string;
}

interface TicketsModel extends mongoose.Model<TicketsDoc> {
  build(attrs: TicketsAttrs): TicketsDoc;
}

interface TicketsDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
  //   createdAt: string;
  //   updatedAt: string;
}
const TicketsSchema = new mongoose.Schema<TicketsAttrs>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
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

TicketsSchema.set("versionKey", "version");
TicketsSchema.plugin(updateIfCurrentPlugin);

TicketsSchema.statics.build = (attrs: TicketsAttrs) => {
  return new Tickets(attrs);
};
const Tickets = mongoose.model<TicketsDoc, TicketsModel>(
  "Tickets",
  TicketsSchema
);

export { Tickets };
