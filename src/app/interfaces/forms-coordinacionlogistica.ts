import { FileItem } from './FileItem';

export interface FormsCoordinacionLogistica {
  Id: string;
  Nombre: string;
  Convenio: string;
  Ida: Date;
  HorarioIda: String;
  Vuelta?: Date;
  HorarioVuelta?: String;
  Identificator: string;
  FechaNacimiento: Date;
  EquipajeAdicional: boolean;
  Email: string;
  Telefono: string;
  PasaporteFiles: FileItem[];
  CedulaFiles: FileItem[];
  InformacionAdicional: string;
  Requestor: any;
}
