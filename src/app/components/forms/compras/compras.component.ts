import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/classes/utils';
import { Convenio } from 'src/app/interfaces/Convenio';
import { FileItem } from 'src/app/interfaces/FileItem';
import { FormsService } from 'src/app/services/forms.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-forms-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css'],
})
export class ComprasComponent implements OnInit {
  formIndex: number = 0;

  // 0
  tipoProceso: string = '';

  // 1
  tipoAdquisicion: string = '';
  tipoAdquisicionOtro: string = '';
  tipoPersona: string = '';

  convenios: Convenio[] = [];

  convenioResponsable: string = '';
  email: string = '';
  justificacionContratacion: string = '';
  objetivoContratacion: string = '';
  especificacionesTecnicasMinimas: string = '';
  perfilRequerido: string = '';
  factoresEvaluacion: string = '';

  objeto: string = '';
  obligacionesEspecificas: string = '';
  productosEntregables: string = '';
  presupuestoEstimado: string = '';
  formaPago: string = '';
  plazo: string = '';
  manejoDatos: string = '';
  categoriaInteresado: string = '';
  categoriaDatosSensibles: boolean = false;
  categoriaDatosIdentificativos: boolean = false;
  categoriaDatosCaracteristicasPersonales: boolean = false;
  categoriaDatosCaracteristicasCircunstanciasSociales: boolean = false;
  categoriaDatosCaracteristicasDetallesEmpleo: boolean = false;
  categoriaDatosEconomicosFinancierosSeguros: boolean = false;

  Files: FileItem[] = [];

  setFiles(Files: FileItem[]) {
    this.Files = Files;
  }

  informacionAdicional: string = '';

  constructor(
    private formsService: FormsService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    let getConveniosJuridicaTaskId: string;
    this.formsService.getConveniosJuridica().subscribe(
      (httpEvent) => {
        switch (httpEvent.type) {
          case HttpEventType.Sent:
            getConveniosJuridicaTaskId = this.sharedService.pushWaitTask({
              description: 'Cargando convenios...',
              progress: 0,
            }) as string;
            break;
          case HttpEventType.DownloadProgress:
            this.sharedService.pushWaitTask({
              id: getConveniosJuridicaTaskId,
              progress: Math.round((httpEvent.loaded * 100) / httpEvent.total),
            });
            break;
          case HttpEventType.Response:
            this.convenios = [];

            httpEvent.body.value.forEach((convenio: any) => {
              this.convenios.push({
                Id: convenio.id,
                Aliado: convenio.fields.Aliado,
                Numero: convenio.fields.Numero,
                Mostrar: convenio.fields.Mostrar,
              });
            });
            break;
        }
      },
      (httpEventError) => {
        this.sharedService.removeWaitTask({
          id: getConveniosJuridicaTaskId,
        });
      },
      () => {
        this.sharedService.removeWaitTask({
          id: getConveniosJuridicaTaskId,
        });
      }
    );
  }

  validateEmail(email: string): boolean {
    return Utils.validateEmail(email);
  }

  isValidCategoriaDatos(): boolean {
    return (
      this.categoriaDatosSensibles ||
      this.categoriaDatosIdentificativos ||
      this.categoriaDatosCaracteristicasPersonales ||
      this.categoriaDatosCaracteristicasCircunstanciasSociales ||
      this.categoriaDatosCaracteristicasDetallesEmpleo ||
      this.categoriaDatosEconomicosFinancierosSeguros
    );
  }

  numberWithPriceSpaces(number: number | undefined): string {
    if (!number || number === NaN) return 'NaN';

    return Utils.numberWithPriceSpaces(number);
  }

  parseInt(string: string) {
    return parseInt(string.replace(/ /g, ''));
  }
}
