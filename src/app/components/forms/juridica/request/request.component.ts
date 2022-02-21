import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Utils } from 'src/app/classes/utils';
import { Convenio } from 'src/app/interfaces/Convenio';
import { FileItem } from 'src/app/interfaces/FileItem';
import { FormsJuridicaRequest } from 'src/app/interfaces/forms-juridica-request';
import { ToastMessage } from 'src/app/interfaces/toast-message';
import { WaitTask } from 'src/app/interfaces/WaitTask';
import { FormsService } from 'src/app/services/forms.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-forms-juridica-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css'],
})
export class FormsJuridicaRequestComponent implements OnInit {
  juridicaRequestMap: Map<
    string,
    Map<string, Map<string, number> | undefined>
  > = new Map([
    [
      'Compra',
      new Map([
        [
          'Directa',
          new Map([
            ['Min', 0],
            ['Max', 10000000],
          ]),
        ],
        ['Directa por extencion', undefined],
        [
          'Comparativa de precios',
          new Map([
            ['Min', 0],
            ['Max', 80000000],
          ]),
        ],
        [
          'Procedimiento super simplificado',
          new Map([
            ['Min', 40000000],
            ['Max', 80000000],
          ]),
        ],
        [
          'Procedimiento simplificado',
          new Map([
            ['Min', 80000000],
            ['Max', 400000000],
          ]),
        ],
        ['Contrato marco', undefined],
        [
          'Licitacion',
          new Map([
            ['Min', 400000000],
            ['Max', NaN],
          ]),
        ],
      ]),
    ],
    [
      'Contratacion',
      new Map([
        [
          'Directa',
          new Map([
            ['Min', 0],
            ['Max', 40000000],
          ]),
        ],
        ['Directa por extencion', undefined],
        ['Comparativa de precios', undefined],
        [
          'Procedimiento super simplificado',
          new Map([
            ['Min', 40000000],
            ['Max', 80000000],
          ]),
        ],
        [
          'Procedimiento simplificado',
          new Map([
            ['Min', 80000000],
            ['Max', 400000000],
          ]),
        ],
        [
          'Contrato marco',
          new Map([
            ['Min', 0],
            ['Max', 5000000000],
          ]),
        ],
        [
          'Licitacion',
          new Map([
            ['Min', 400000000],
            ['Max', NaN],
          ]),
        ],
      ]),
    ],
  ]);

  // Preserve original property order
  originalOrder() {
    return 0;
  }

  formIndex: number = 0;

  // 0
  tipoPeticion: string = '';

  // 1
  tipoCompraContratacion: string = '';

  // 2
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
  presupuestoEstimado: string = '';
  formaPago: string = '';
  plazo: string = '';
  manejoDatos: string = '';
  categoriaInteresado: string = '';
  categoriaDatos: string = '';
  informacionAdicional: string = '';

  tipoPersona: string = '';
  tipoRelacion: string = '';

  identificator: string = '';
  digitoVerificacion: string = '';

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
        this.tipoPeticion = '';
        break;
      case 2:
        // Reset form index 1 values
        this.tipoCompraContratacion = '';
        break;
    }

    // Reduce form index by 1
    this.formIndex--;
  }

  presupuestoEstimadoMin: number = 0;

  btnNextClick() {
    const taskId: string = Utils.makeRandomString(4);

    switch (this.formIndex) {
      case 0:
        // Reset form index 1 values
        this.tipoCompraContratacion = '';
        break;
      case 1:
        // Reset form index 2 values
        this.tipoAdquisicion = '';
        this.tipoAdquisicionOtro = '';
        this.convenioResponsable = '';
        this.justificacionContratacion = '';
        this.objetivoContratacion = '';
        this.especificacionesTecnicasMinimas = '';
        this.perfilRequerido = '';
        this.factoresEvaluacion = '';
        this.objeto = '';
        this.obligacionesEspecificas = '';
        this.productosEntregables = '';
        const presupuestoEstimadoMinString = this.numberWithPriceSpaces(
          this.juridicaRequestMap
            ?.get(this.tipoPeticion)
            ?.get(this.tipoCompraContratacion)
            ?.get('Min')
        );

        this.presupuestoEstimadoMin =
          presupuestoEstimadoMinString !== 'NaN'
            ? parseInt(presupuestoEstimadoMinString.replace(/ /g, ''))
            : 1;

        this.presupuestoEstimado =
          presupuestoEstimadoMinString !== 'NaN'
            ? presupuestoEstimadoMinString
            : '';
        this.formaPago = '';
        this.plazo = '';
        this.manejoDatos = '';
        this.categoriaInteresado = '';
        this.categoriaDatos = '';

        this.formsService.getConveniosJuridica().subscribe((event) => {
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

  numberWithPriceSpaces(number: number | undefined): string {
    if (!number || number === NaN) return 'NaN';

    return Utils.numberWithPriceSpaces(number);
  }

  parseInt(string: string) {
    return parseInt(string.replace(/ /g, ''));
  }

  async btnSubmitClick() {
    const taskId: string = Utils.makeRandomString(4);

    document.getElementById('firstElement')?.scrollIntoView({
      behavior: 'smooth',
    });

    let formsJuridicaRequest: FormsJuridicaRequest = {
      Id: Utils.makeRandomString(32),
      TipoPeticion: this.tipoPeticion,
      TipoCompraContratacion: this.tipoCompraContratacion,
      TipoAdquisicion: this.tipoAdquisicion,
      TipoAdquisicionOtro:
        this.tipoAdquisicion === 'Otro' ? this.tipoAdquisicionOtro : undefined,
      ConvenioResponsable: this.convenioResponsable,
      JustificacionContratacion: this.justificacionContratacion,
      ObjetivoContratacion: this.objetivoContratacion,
      EspecificacionesTecnicasMinimas: this.especificacionesTecnicasMinimas,
      PerfilRequerido: this.perfilRequerido,
      FactoresEvaluacion: this.factoresEvaluacion,
      Objeto: this.objeto,
      ObligacionesEspecificas: this.obligacionesEspecificas,
      ProductosEntregables: this.productosEntregables,
      PresupuestoEstimado: this.presupuestoEstimado,
      FormaPago: this.formaPago,
      Plazo: this.plazo,
      ManejoDatos: this.manejoDatos,
      CategoriaInteresado:
        this.manejoDatos === 'Si' ? this.categoriaInteresado : undefined,
      CategoriaDatos:
        this.manejoDatos === 'Si' ? this.categoriaDatos : undefined,
      InformacionAdicional: this.informacionAdicional,
      Requestor: {},
    };

    // Cleaning fields because information has been saved
    this.informacionAdicional = '';
    this.categoriaDatos = '';
    this.categoriaInteresado = '';
    this.manejoDatos = '';
    this.plazo = '';
    this.formaPago = '';
    this.presupuestoEstimado = '';
    this.productosEntregables = '';
    this.obligacionesEspecificas = '';
    this.objeto = '';
    this.factoresEvaluacion = '';
    this.perfilRequerido = '';
    this.especificacionesTecnicasMinimas = '';
    this.objetivoContratacion = '';
    this.justificacionContratacion = '';
    this.convenioResponsable = '';
    this.tipoAdquisicionOtro = '';
    this.tipoAdquisicion = '';
    this.tipoCompraContratacion = '';
    this.tipoPeticion = '';

    this.formIndex = 0;

    this.formsService
      .postFormsJuridicaRequestFlow(formsJuridicaRequest)
      .subscribe(
        (event) => {
          switch (event.type) {
            case HttpEventType.Sent:
              this.sharedService.pushWaitTask({
                id: taskId,
                description: `Enviando peticion juricia...`,
                progress: 0,
              });
              break;
            case HttpEventType.UploadProgress:
              this.sharedService.pushWaitTask({
                id: taskId,
                progress: Math.round((event.loaded * 100) / event.total),
              });
              break;
          }
        },
        (err) => {
          this.sharedService.removeWaitTask({
            id: taskId,
          });

          this.sharedService.pushToastMessage({
            id: Utils.makeRandomString(4),
            title: `Ha ocurrido un problema`,
            description: `No se ha podido enviar su peticion juridica debido a algun inconveniente mientras se enviaba la peticion, vuelva a intentarlo.`,
            autohide: 30000,
          });
        },
        () => {
          this.sharedService.removeWaitTask({
            id: taskId,
          });

          this.sharedService.pushToastMessage({
            id: Utils.makeRandomString(4),
            title: `Peticion juridica enviada satisfactoriamente`,
            description: `Su peticion juridica ha sido ingresada correctamente y sera procesada en la mayor brevedad posible, este atento al correo electronico registrado por el cual se le notificara del estado y manera de validacion de la peticion.`,
            autohide: 30000,
          });
        }
      );
  }

  isValid() {
    switch (this.formIndex) {
      case 0:
        return this.tipoPeticion;
      case 1:
        return this.tipoCompraContratacion;
      case 2:
        return (
          this.tipoAdquisicion &&
          (this.tipoAdquisicion === 'Otro' ? this.tipoAdquisicionOtro : true) &&
          this.convenioResponsable &&
          this.justificacionContratacion &&
          this.objetivoContratacion &&
          this.objeto &&
          this.obligacionesEspecificas &&
          this.productosEntregables &&
          this.presupuestoEstimado &&
          this.formaPago &&
          this.plazo &&
          this.manejoDatos &&
          (this.manejoDatos === 'Si'
            ? this.categoriaInteresado && this.categoriaDatos
            : true)
        );
    }

    return false;
  }
}
