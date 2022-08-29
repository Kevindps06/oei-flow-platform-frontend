import { FileItem } from './FileItem';

export interface IJuridicaPliegos {
  Dia?: string;
  NumeroPliego?: string;
  NumeroConvenio?: string;
  FechaConvenio?: string;
  NombreEntidad?: string;
  ObjetoContrato?: string;
  ObjetoGeneral?: string;
  TablaPerfiles?: any[];
  TablaObjetosObligaciones?: any[];
  PliegosFiles?: FileItem[];
}
