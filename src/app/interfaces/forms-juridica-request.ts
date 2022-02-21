export interface FormsJuridicaRequest {
  Id: string;
  TipoPeticion: string;
  TipoCompraContratacion: string;
  TipoAdquisicion: string;
  TipoAdquisicionOtro?: string;
  ConvenioResponsable: string;
  JustificacionContratacion: string;
  ObjetivoContratacion: string;
  EspecificacionesTecnicasMinimas?: string;
  PerfilRequerido?: string;
  FactoresEvaluacion?: string;
  Objeto: string;
  ObligacionesEspecificas: string;
  ProductosEntregables: string;
  PresupuestoEstimado: string;
  FormaPago: string;
  Plazo: string;
  ManejoDatos: string;
  CategoriaInteresado?: string;
  CategoriaDatos?: string;
  InformacionAdicional: string;
  Requestor: any;
}
