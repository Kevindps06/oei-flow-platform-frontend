const mongoose = require("mongoose");

const schema = mongoose.Schema({
  TipoPersona: String,
  relacion: String,
  gestion: String,
  legalizacion: String,
  steps: [],
});

module.exports = mongoose
  .createConnection(process.env.MONGODB_CONFIGURATIONS_URI, {
    ssl: true,
    sslCA: fs.readFileSync(`/home/ubuntu/rds-combined-ca-bundle.pem`, "utf8"),
    replicaSet: "rs0",
    readPreference: "secondaryPreferred",
    retryWrites: false,
  })
  .model("FinancieraFlow", schema);
