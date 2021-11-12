import { FileItem } from './FileItem';

export interface FormsCoordinacionLogistica {
  Id: string;
  Nombre: string;
  Convenio: string;
  Ida: Date;
  Vuelta?: Date;
  Identificator: string;
  EquipajeAdicional: boolean;
  Email: string;
  Telefono: string;
  PasaporteFiles: FileItem[];
  InformacionAdicional: string;
  Requestor: any
}
