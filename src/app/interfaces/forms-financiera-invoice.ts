import { FileItem } from "./FileItem";

export interface FormsFinancieraInvoice {
  Id: string;
  TipoPersona: string;
  TipoRelacion: string;
  Identificador: string;
  TipoSoporteContable: string;
  TipoLegalizacion?: string;
  Convenio: string;
  0?: FileItem[];
  1?: FileItem[];
  2?: FileItem[];
  3?: FileItem[];
  InformacionAdicional: string;
}
