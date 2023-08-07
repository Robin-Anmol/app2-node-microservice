import mongoose from "mongoose";
import nats, { Stan } from "node-nats-streaming";

class NatsClient {
  readonly instanceId = new mongoose.Types.ObjectId().toHexString();
  private _client?: Stan;
  get client() {
    if (!this._client) {
      throw new Error("cannot connect to nats client");
    }
    return this._client;
  }

  connect(clusterId: string, url: string) {
    this._client = nats.connect(clusterId, this.instanceId, {
      url,
    });
    return new Promise<void>((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("connected to NATS");
        resolve();
      });
      this.client.on("error", (err) => {
        console.log("connected to NATS");
        reject(err);
      });
    });
  }

  close() {
    this.client.on("close", () => {
      console.log("nats connection closed");
      process.exit();
    });
  }
}

export const natsClient = new NatsClient();
