import { FileItem } from './FileItem';

export interface FormsFinancieraRegistration {
  Id: string;
  TipoPersona: string;
  TipoRelacion: string;
  Identificator: string;
  Email: string;
  Convenio: string;
  Nombre: String;
  RutFiles: FileItem[];
  CedulaFiles: FileItem[];
  CertificacionBancariaFiles: FileItem[];
  InformacionAdicional: string;
}
