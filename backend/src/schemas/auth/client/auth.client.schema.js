import mongoose from "mongoose";

const schema = mongoose.Schema({
  secret: String,
});

export default mongoose
  .createConnection(process.env.MONGODB_AUTH_URI, {
    tls: true,
    tlsCAFile: process.env.MONGODB_TLSCAFILE_PATH,
    replicaSet: "rs0",
    readPreference: "secondaryPreferred",
    retryWrites: false,
  })
  .model("Client", schema, "Client");
