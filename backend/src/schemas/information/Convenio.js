const mongoose = require("mongoose");
const fs = require("fs");

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
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    sslCA: [fs.readFileSync(`${__dirname}/../rds-combined-ca-bundle.pem`)],
  })
  .model("Convenio", schema);
