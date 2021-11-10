const mongoose = require("mongoose");

const schema = mongoose.Schema({
  steps: [],
});

module.exports = mongoose
  .createConnection(process.env.MONGODB_CONFIGURATIONS_URI, {
    tls: true,
    tlsCAFile: `/home/ubuntu/rds-combined-ca-bundle.pem`,
    replicaSet: "rs0",
    readPreference: "secondaryPreferred",
    retryWrites: false,
  })
  .model("CoordinacionLogisticaFlow", schema, "CoordinacionLogisticaFlow");
