import { FileItem } from './FileItem';

export interface FormsJuridicaRequest {
  Id: string;
  TipoProceso: string;
  TipoAdquisicion: string;
  TipoAdquisicionOtro?: string;
  TipoPersona: string;
  ConvenioResponsable: string;
  Email: string;
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
  CategoriaDatosSensibles?: boolean;
  CategoriaDatosIdentificativos?: boolean;
  CategoriaDatosCaracteristicasPersonales?: boolean;
  CategoriaDatosCaracteristicasCircunstanciasSociales?: boolean;
  CategoriaDatosCaracteristicasDetallesEmpleo?: boolean;
  CategoriaDatosEconomicosFinancierosSeguros?: boolean;
  Files?: FileItem[];
  InformacionAdicional: string;
  Requestor: any;
}
