import mongoose from "mongoose";

const schema = mongoose.Schema({
  Id: String,
  TipoPeticion: String,
  TipoCompraContratacion: String,
  TipoAdquisicion: String,
  TipoAdquisicionOtro: String,
  ConvenioResponsable: String,
  JustificacionContratacion: String,
  ObjetivoContratacion: String,
  EspecificacionesTecnicasMinimas: String,
  PerfilRequerido: String,
  FactoresEvaluacion: String,
  Objeto: String,
  ObligacionesEspecificas: String,
  ProductosEntregables: String,
  PresupuestoEstimado: String,
  FormaPago: String,
  Plazo: String,
  ManejoDatos: String,
  CategoriaInteresado: String,
  CategoriaDatos: String,
  InformacionAdicional: String,
  Requestor: Object,
  ConvenioInformation: Object,
  Configuration: [],
  GestionPath: String,
  SharePointFiles: [],
  Keys: [],
  Eula: Object,
});

export default mongoose
  .createConnection(process.env.MONGODB_FORMS_URI, {
    tls: true,
    tlsCAFile: process.env.MONGODB_TLSCAFILE_PATH,
    replicaSet: "rs0",
    readPreference: "secondaryPreferred",
    retryWrites: false,
  })
  .model("JuridicaRequest", schema, "JuridicaRequest");
