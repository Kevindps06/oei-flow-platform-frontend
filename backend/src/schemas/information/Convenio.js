const { ObjectId } = require("bson");
const mongoose = require("mongoose");

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
  enabled: Boolean
});

console.log(`${__dirname}/../rds-combined-ca-bundle.pem`);

module.exports = mongoose
  .createConnection(process.env.MONGODB_INFORMATION_URI, {
    ssl: true,
    sslValidate: true,
    sslCA: `${__dirname}/../rds-combined-ca-bundle.pem`,
  })
  .model("Convenio", schema);
