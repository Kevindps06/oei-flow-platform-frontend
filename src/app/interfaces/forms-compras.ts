import { FileItem } from './FileItem';

export interface ICompras {
  _id?: string;
  Id: string;
  TipoProceso: string;
  ConvenioResponsable: string;
  NumeroContrato: string;
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
  CategoriaDatosSensibles?: boolean;
  CategoriaDatosIdentificativos?: boolean;
  CategoriaDatosCaracteristicasPersonales?: boolean;
  CategoriaDatosCaracteristicasCircunstanciasSociales?: boolean;
  CategoriaDatosCaracteristicasDetallesEmpleo?: boolean;
  CategoriaDatosEconomicosFinancierosSeguros?: boolean;
  DocumentosFiles?: FileItem[];
  ArtesFiles?: FileItem[];
  SolicitudAdquisicionFiles?: FileItem[];
  InformacionAdicional: string;
  Requestor: any;
  JuridicaPostuladosUploadFiles?: any;
}
