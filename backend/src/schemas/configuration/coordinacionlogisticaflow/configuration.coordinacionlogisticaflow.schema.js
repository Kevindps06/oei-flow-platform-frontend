const mongoose = require("mongoose");

const schema = mongoose.Schema({
  steps: [],
});

export default mongoose
  .createConnection(process.env.MONGODB_CONFIGURATIONS_URI, {
    tls: true,
    tlsCAFile: process.env.MONGODB_TLSCAFILE_PATH,
    replicaSet: "rs0",
    readPreference: "secondaryPreferred",
    retryWrites: false,
  })
  .model("CoordinacionLogisticaFlow", schema, "CoordinacionLogisticaFlow");
