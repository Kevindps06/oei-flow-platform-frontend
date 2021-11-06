const { ObjectId } = require("bson");
const mongoose = require("mongoose");
const fs = require("fs");

const schema = mongoose.Schema({
  _id: ObjectId,
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
    sslValidate: true,
    sslCA: [fs.readFileSync(`${__dirname}/../rds-combined-ca-bundle.pem`)],
  })
  .model("Convenio", schema);
