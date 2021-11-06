const mongoose = require("mongoose");

const schema = mongoose.Schema({
  aliado: String,
  numero: String,
  administracion: String,
  gerencia: String,
  direccionAdjunta: String,
  asistenciaContable: String,
  tesoreriaDistribucion: String,
  tesoreria: String,
  tesoreriaConfirmacion: String,
  direccionFinanciera: String,
  enabled: Boolean,
});

module.exports = mongoose
  .createConnection(process.env.MONGODB_INFORMATION_URI, {
    tls: true,
    tlsCAFile: `/home/ubuntu/rds-combined-ca-bundle.pem`,
    replicaSet: "rs0",
    readPreference: "secondaryPreferred",
    retryWrites: false,
  })
  .model("Convenio", schema);
