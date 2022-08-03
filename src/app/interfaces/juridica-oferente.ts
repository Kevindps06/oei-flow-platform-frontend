import { FileItem } from './FileItem';

export interface IJuridicaOferente {
  Email: string;
  DocumentosTecnicosFiles?: FileItem[];
  DocumentosFinancierosFiles?: FileItem[];
  DocumentosJuridicosFiles?: FileItem[];
  PropuestaEconomicaFiles?: FileItem[];
  Juridica: string;
}
