import mongoose from "mongoose";

const schema = mongoose.Schema({
  Id: String,
  TipoPersona: String,
  TipoRelacion: String,
  Identificator: String,
  Email: String,
  TipoGestion: String,
  TipoLegalizacion: String,
  Convenio: String,
  InformacionAdicional: String,
  ConvenioInformation: Object,
  Configuration: [],
  GestionPath: String,
  SharePointFiles: [],
  Keys: [],
});

export default mongoose
  .createConnection(process.env.MONGODB_FORMS_URI, {
    tls: true,
    tlsCAFile: process.env.MONGODB_TLSCAFILE_PATH,
    replicaSet: "rs0",
    readPreference: "secondaryPreferred",
    retryWrites: false,
  })
  .model("FinancieraInvoice", schema, "FinancieraInvoices");
