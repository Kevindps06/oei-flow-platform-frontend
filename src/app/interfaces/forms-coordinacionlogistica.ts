import { FileItem } from './FileItem';
import { Tramo } from './tramo';

export interface FormsCoordinacionLogistica {
  Id: string;
  Nombre: string;
  Convenio: string;
  Tramos: Tramo[];
  IdentificatorType: string;
  Identificator: string;
  FechaNacimiento: Date;
  EquipajeAdicional: string;
  Email: string;
  Telefono: string;
  PasaporteFiles: FileItem[];
  ComprobantesFiles: FileItem[];
  InformacionAdicional: string;
  Requestor: any;
  Status: number;
}
