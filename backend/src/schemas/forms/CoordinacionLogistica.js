const mongoose = require("mongoose");

const schema = mongoose.Schema({
  Id: String,
  Nombre: String,
  Convenio: String,
  Tramos: [],
  IdentificatorType: String,
  Identificator: String,
  FechaNacimiento: String,
  EquipajeAdicional: Boolean,
  Email: String,
  Telefono: String,
  InformacionAdicional: String,
  Requestor: Object,
  ConvenioInformation: Object,
  Configuration: Object,
  CoordinacionLogisticaPath: String,
  SharePointFiles: [],
  Keys: [],
  TicketNumber: String,
  Quotations: [],
  SelectedQuotation: Object,
});

module.exports = mongoose
  .createConnection(process.env.MONGODB_FORMS_URI, {
    tls: true,
    tlsCAFile: `/home/ubuntu/rds-combined-ca-bundle.pem`,
    replicaSet: "rs0",
    readPreference: "secondaryPreferred",
    retryWrites: false,
  })
  .model("CoordinacionLogistica", schema, "CoordinacionesLogisticas");
