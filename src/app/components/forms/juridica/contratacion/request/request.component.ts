import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Utils } from 'src/app/classes/utils';
import { Convenio } from 'src/app/interfaces/Convenio';
import { FileItem } from 'src/app/interfaces/FileItem';
import { ToastMessage } from 'src/app/interfaces/toast-message';
import { WaitTask } from 'src/app/interfaces/WaitTask';
import { FormsService } from 'src/app/services/forms.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-forms-juridica-contratacion-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css'],
})
export class FormsJuridicaContratacionRequestComponent implements OnInit {
  formIndex: number = 0;

  // 0
  tipoContratacion: string = '';

  // 1
  tipoAdquisicion: string = '';
  tipoAdquisicionOtro: string = '';

  convenios: Convenio[] = [];

  convenioResponsable: string = '';
  justificacionContratacion: string = '';
  objetivoContratacion: string = '';
  especificacionesTecnicasMinimas: string = '';
  perfilRequerido: string = '';
  factoresEvaluacion: string = '';

  objeto: string = '';
  obligacionesEspecificas: string = '';
  productosEntregables: string = '';
  presupuestoEstimado: number = 0;
  formaPago: string = '';
  plazo: string = '';
  manejoDatos: string = '';
  categoriaInteresado: string = '';
  categoriaDatos: string = ''

  tipoPersona: string = '';
  tipoRelacion: string = '';

  identificator: string = '';
  digitoVerificacion: string = '';

  ocupacion: string = '';
  valorContrato: string = '';
  nombresApellidos: string = '';
  direccion: string = '';
  telefono: string = '';

  cedulaCiudadaniaFiles: FileItem[] = [];

  setCedulaCiudadaniaFiles(cedulaCiudadaniaFiles: FileItem[]) {
    this.cedulaCiudadaniaFiles = cedulaCiudadaniaFiles;
  }

  RUTFiles: FileItem[] = [];

  setRUTFiles(RUTFiles: FileItem[]) {
    this.RUTFiles = RUTFiles;
  }

  certificacionBancariaFiles: FileItem[] = [];

  setCertificacionBancariaFiles(certificacionBancariaFiles: FileItem[]) {
    this.certificacionBancariaFiles = certificacionBancariaFiles;
  }

  constanciaAfiliacionSaludFiles: FileItem[] = [];

  setConstanciaAfiliacionSaludFiles(
    constanciaAfiliacionSaludFiles: FileItem[]
  ) {
    this.constanciaAfiliacionSaludFiles = constanciaAfiliacionSaludFiles;
  }

  constanciaAfiliacionPensionFiles: FileItem[] = [];

  setConstanciaAfiliacionPensionFiles(
    constanciaAfiliacionPensionFiles: FileItem[]
  ) {
    this.constanciaAfiliacionPensionFiles = constanciaAfiliacionPensionFiles;
  }

  tarjetaProfesionalFiles: FileItem[] = [];

  setTarjetaProfesionalFiles(tarjetaProfesionalFiles: FileItem[]) {
    this.tarjetaProfesionalFiles = tarjetaProfesionalFiles;
  }

  examenSaludOcupacionalFiles: FileItem[] = [];

  setExamenSaludOcupacionalFiles(examenSaludOcupacionalFiles: FileItem[]) {
    this.examenSaludOcupacionalFiles = examenSaludOcupacionalFiles;
  }

  formatoActaCumplimientoConocimientoFiles: FileItem[] = [];

  setFormatoActaCumplimientoConocimientoFiles(
    formatoActaCumplimientoConocimientoFiles: FileItem[]
  ) {
    this.formatoActaCumplimientoConocimientoFiles =
      formatoActaCumplimientoConocimientoFiles;
  }

  experienciaLaboralFiles: FileItem[] = [];

  setExperienciaLaboralFiles(experienciaLaboralFiles: FileItem[]) {
    this.experienciaLaboralFiles = experienciaLaboralFiles;
  }

  hojaVidaFiles: FileItem[] = [];

  setHojaVidaFiles(hojaVidaFiles: FileItem[]) {
    this.hojaVidaFiles = hojaVidaFiles;
  }

  certificadoARLFiles: FileItem[] = [];

  setCertificadoARLFiles(certificadoARLFiles: FileItem[]) {
    this.certificadoARLFiles = certificadoARLFiles;
  }

  camaraComercioFiles: FileItem[] = [];

  setCamaraComercioFiles(camaraComercioFiles: FileItem[]) {
    this.camaraComercioFiles = camaraComercioFiles;
  }

  cedulaCiudadaniaRepresentanteLegalFiles: FileItem[] = [];

  setCedulaCiudadaniaRepresentanteLegalFiles(
    cedulaCiudadaniaRepresentanteLegalFiles: FileItem[]
  ) {
    this.cedulaCiudadaniaRepresentanteLegalFiles =
      cedulaCiudadaniaRepresentanteLegalFiles;
  }

  seguridadSocialParafiscalesFiles: FileItem[] = [];

  setSeguridadSocialParafiscalesFiles(
    seguridadSocialParafiscalesFiles: FileItem[]
  ) {
    this.seguridadSocialParafiscalesFiles = seguridadSocialParafiscalesFiles;
  }

  solicitudContratacionFiles: FileItem[] = [];

  setSolicitudContratacionFiles(solicitudContratacionFiles: FileItem[]) {
    this.solicitudContratacionFiles = solicitudContratacionFiles;
  }

  justificacionContratacionFiles: FileItem[] = [];

  setJustificacionContratacionFiles(
    justificacionContratacionFiles: FileItem[]
  ) {
    this.justificacionContratacionFiles = justificacionContratacionFiles;
  }

  cotizacionOfertaFiles: FileItem[] = [];

  setCotizacionOfertaFiles(cotizacionOfertaFiles: FileItem[]) {
    this.cotizacionOfertaFiles = cotizacionOfertaFiles;
  }

  @Output() onWaitTasksChange = new EventEmitter<WaitTask[]>();
  @Output() onToastMessagesChange = new EventEmitter<ToastMessage>();

  constructor(
    private formsService: FormsService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {}

  btnPreviousClick() {
    switch (this.formIndex) {
      case 1:
        // Reset form index 0 values
        this.tipoContratacion = '';
        break;
    }

    // Reduce form index by 1
    this.formIndex--;
  }

  btnNextClick() {
    const taskId: string = Utils.makeRandomString(4);

    switch (this.formIndex) {
      case 0:
        // Reset form index 1 values
        this.tipoAdquisicion = '';
        this.tipoAdquisicionOtro = '';

        this.formsService.getConvenios().subscribe((event) => {
          switch (event.type) {
            case HttpEventType.Sent:
              this.sharedService.pushWaitTask({
                id: taskId,
                description: 'Cargando convenios...',
                progress: 0,
              });
              break;
            case HttpEventType.DownloadProgress:
              this.sharedService.pushWaitTask({
                id: taskId,
                progress: Math.round((event.loaded * 100) / event.total),
              });
              break;
            case HttpEventType.Response:
              this.convenios = [];

              event.body.value.forEach((convenio: any) => {
                this.convenios.push({
                  Id: convenio.id,
                  Aliado: convenio.fields.Aliado,
                  Numero: convenio.fields.Numero,
                  Mostrar: convenio.fields.Mostrar,
                });
              });

              this.sharedService.removeWaitTask({
                id: taskId,
              });
              break;
          }
        });
        break;
    }

    // Increment form index by 1
    this.formIndex++;
  }

  btnSubmitClick() {}

  isValid(): boolean {
    return true;
  }
}
