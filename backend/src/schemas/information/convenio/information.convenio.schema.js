import mongoose from "mongoose";

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

export default mongoose
  .createConnection(process.env.MONGODB_INFORMATION_URI, {
    tls: true,
    tlsCAFile: process.env.MONGODB_TLSCAFILE_PATH,
    replicaSet: "rs0",
    readPreference: "secondaryPreferred",
    retryWrites: false,
  })
  .model("convenio", schema, "convenio");
