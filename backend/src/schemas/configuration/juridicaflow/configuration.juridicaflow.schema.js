import mongoose from "mongoose";

const schema = mongoose.Schema({
  tipo: String,
  steps: [],
});

module.exports = mongoose
  .createConnection(process.env.MONGODB_CONFIGURATIONS_URI, {
    tls: true,
    tlsCAFile: process.env.MONGODB_TLSCAFILE_PATH,
    replicaSet: "rs0",
    readPreference: "secondaryPreferred",
    retryWrites: false,
  })
  .model("JuridicaFlow", schema, "JuridicaFlow");
