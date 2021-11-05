import { FileItem } from "./FileItem";

export interface FormsFinancieraInvoice {
  Id: string;
  TipoPersona: string;
  TipoRelacion: string;
  Identificator: string;
  Email: string;
  TipoGestion: string;
  TipoLegalizacion?: string;
  Convenio: string;
  // Cuenta de cobro
  CuentaCobroFiles?: FileItem[];
  FacturaEquivalenteFiles?: FileItem[];
  SeguridadSocialFiles?: FileItem[];
  CertificadoParafiscales?: FileItem[];
  InformeActividadesFiles?: FileItem[];
  // Anticipo
  CamaraComercioFiles?: FileItem[];
  FormatoSolicitudAvancesFiles?: FileItem[];
  CotizacionesFiles?: FileItem[];
  SolicitudesComisionFiles?: FileItem[];
  // Dieta
  FormatoSolicitudViajesFiles?: FileItem[];
  //
  InformacionAdicional: string;
}
