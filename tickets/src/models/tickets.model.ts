import mongoose from "mongoose";
interface TicketsAttrs {
  title: string;
  price: number;
  userId: string;
}

interface TicketsModel extends mongoose.Model<TicketsDoc> {
  build(attrs: TicketsAttrs): TicketsDoc;
}

interface TicketsDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
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

TicketsSchema.statics.build = (attrs: TicketsAttrs) => {
  return new Tickets(attrs);
};
const Tickets = mongoose.model<TicketsDoc, TicketsModel>(
  "Tickets",
  TicketsSchema
);

export { Tickets };
