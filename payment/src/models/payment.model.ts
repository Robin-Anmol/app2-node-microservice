import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import Stripe from "stripe";

interface PaymentAttrs {
  orderId: string;
  stripeId: string;
  payment_status: Stripe.PaymentIntent.Status;
  userId: string;
}

interface PaymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
  payment_status: Stripe.PaymentIntent.Status;
  version: number;
  userId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const PaymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    payment_status: {
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

PaymentSchema.plugin(updateIfCurrentPlugin);
PaymentSchema.set("versionKey", "version");

PaymentSchema.index({ orderId: 1 }, { unique: true });
PaymentSchema.index({ stripeId: 1 }, { unique: true });
PaymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment({
    orderId: attrs.orderId,
    userId: attrs.userId,
    stripeId: attrs.stripeId,
    payment_status: attrs.payment_status,
  });
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  "payment",
  PaymentSchema
);

export { Payment };
