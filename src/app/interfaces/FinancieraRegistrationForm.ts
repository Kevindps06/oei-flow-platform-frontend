import { FileItem } from './FileItem';

export interface FinancieraRegistrationForm {
  ID?: string;
  'Tipo de persona': string;
  'Tipo de relacion': string;
  'CC/NIT': string;
  Convenio: string;
  'Nombre o razon social': string;
  RUT: FileItem[];
  Cedula: FileItem[];
  'Certificacion bancaria': FileItem[];
  'Email de contacto': string;
  'Informacion adicional': string;
  'Manejo de datos': string;
}
