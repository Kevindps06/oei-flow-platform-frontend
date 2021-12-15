import { FileItem } from './FileItem';
import { Tramo } from './tramo';

export interface FormsCoordinacionLogistica {
  Id: string;
  Nombre: string;
  Convenio: string;
  Tramos: Tramo[];
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
