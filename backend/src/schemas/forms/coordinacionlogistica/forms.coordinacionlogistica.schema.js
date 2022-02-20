import mongoose from "mongoose";

const schema = mongoose.Schema({
  Id: String,
  Nombre: String,
  Convenio: String,
  Tramos: [],
  IdentificatorType: String,
  Identificator: String,
  FechaNacimiento: String,
  EquipajeAdicional: String,
  Email: String,
  Telefono: String,
  InformacionAdicional: String,
  Requestor: Object,
  Status: Number,
  ConvenioInformation: Object,
  Configuration: Object,
  CoordinacionLogisticaPath: String,
  SharePointFiles: [],
  Keys: [],
  TicketNumber: String,
  Quotations: [],
  SelectedQuotation: Object,
});

export default mongoose
  .createConnection(process.env.MONGODB_FORMS_URI, {
    tls: true,
    tlsCAFile: process.env.MONGODB_TLSCAFILE_PATH,
    replicaSet: "rs0",
    readPreference: "secondaryPreferred",
    retryWrites: false,
  })
  .model("CoordinacionLogistica", schema, "CoordinacionesLogisticas");
