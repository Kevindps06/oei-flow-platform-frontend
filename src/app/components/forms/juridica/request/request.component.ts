import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
  juridicaRequestMap: Map<string, Map<string, number> | undefined> = new Map([
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
  ]);

  // Preserve original property order
  originalOrder() {
    return 0;
  }

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

  /**************************************/
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
        this.tipoProceso = '';
        break;
    }

    // Reduce form index by 1
    this.formIndex--;
  }

  presupuestoEstimadoMin: number = 0;

  btnNextClick() {
    switch (this.formIndex) {
      case 0:
        // Reset form index 1 values
        this.tipoAdquisicion = '';
        this.tipoAdquisicionOtro = '';
        this.tipoPersona = this.tipoProceso === 'Directa' ? 'Natural' : '';
        this.convenioResponsable = '';
        this.email = '';
        this.justificacionContratacion = '';
        this.objetivoContratacion = '';
        this.especificacionesTecnicasMinimas = '';
        this.perfilRequerido = '';
        this.factoresEvaluacion = '';
        this.objeto = '';
        this.obligacionesEspecificas = '';
        this.productosEntregables = '';
        const presupuestoEstimadoMinString = this.numberWithPriceSpaces(
          this.juridicaRequestMap?.get(this.tipoProceso)?.get('Min')
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
        this.categoriaDatosSensibles = false;
        this.categoriaDatosIdentificativos = false;
        this.categoriaDatosCaracteristicasPersonales = false;
        this.categoriaDatosCaracteristicasCircunstanciasSociales = false;
        this.categoriaDatosCaracteristicasDetallesEmpleo = false;
        this.categoriaDatosEconomicosFinancierosSeguros = false;

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
                  progress: Math.round(
                    (httpEvent.loaded * 100) / httpEvent.total
                  ),
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
    document.getElementById('firstElement')?.scrollIntoView({
      behavior: 'smooth',
    });

    let formsJuridicaRequest: FormsJuridicaRequest = {
      Id: Utils.makeRandomString(32),
      TipoProceso: this.tipoProceso,
      TipoAdquisicion: this.tipoAdquisicion,
      TipoAdquisicionOtro:
        this.tipoAdquisicion === 'Otro' ? this.tipoAdquisicionOtro : undefined,
      TipoPersona: this.tipoPersona,
      ConvenioResponsable: this.convenioResponsable,
      Email: this.email,
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
      CategoriaDatosSensibles:
        this.manejoDatos === 'Si' ? this.categoriaDatosSensibles : undefined,
      CategoriaDatosIdentificativos:
        this.manejoDatos === 'Si'
          ? this.categoriaDatosIdentificativos
          : undefined,
      CategoriaDatosCaracteristicasPersonales:
        this.manejoDatos === 'Si'
          ? this.categoriaDatosCaracteristicasPersonales
          : undefined,
      CategoriaDatosCaracteristicasCircunstanciasSociales:
        this.manejoDatos === 'Si'
          ? this.categoriaDatosCaracteristicasCircunstanciasSociales
          : undefined,
      CategoriaDatosCaracteristicasDetallesEmpleo:
        this.manejoDatos === 'Si'
          ? this.categoriaDatosCaracteristicasDetallesEmpleo
          : undefined,
      CategoriaDatosEconomicosFinancierosSeguros:
        this.manejoDatos === 'Si'
          ? this.categoriaDatosEconomicosFinancierosSeguros
          : undefined,
      InformacionAdicional: Utils.replaceAll(
        this.informacionAdicional,
        '"',
        "'"
      ),
      Requestor: {},
    };

    for (let i = 0; this.Files.length > i; i++) {
      let postUploadFileTaskId: string;
      await this.formsService
        .postUploadFile(this.Files[i].Name, this.Files[i].Bytes as ArrayBuffer)
        .pipe(
          map((httpEvent) => {
            switch (httpEvent.type) {
              case HttpEventType.Sent:
                postUploadFileTaskId = this.sharedService.pushWaitTask({
                  description: `Subiendo archivos...`,
                  progress: 0,
                }) as string;
                break;
              case HttpEventType.UploadProgress:
                this.sharedService.pushWaitTask({
                  id: postUploadFileTaskId,
                  progress: Math.round(
                    (httpEvent.loaded * 100) / httpEvent.total
                  ),
                });
                break;
              case HttpEventType.Response:
                delete this.Files[i].Bytes;
                this.Files[i].ServerPath = httpEvent.body;

                this.sharedService.removeWaitTask({
                  id: postUploadFileTaskId,
                });
                break;
            }
          }),
          catchError((httpEventError) => {
            this.sharedService.removeWaitTask({
              id: postUploadFileTaskId,
            });

            return throwError(httpEventError);
          })
        )
        .toPromise();
    }

    formsJuridicaRequest = Object.assign(formsJuridicaRequest, {
      Files: this.Files,
    });

    // Cleaning fields because information has been saved
    this.Files = [];

    // Cleaning fields because information has been saved
    this.informacionAdicional = '';
    this.categoriaDatosIdentificativos = false;
    this.categoriaDatosCaracteristicasPersonales = false;
    this.categoriaDatosCaracteristicasCircunstanciasSociales = false;
    this.categoriaDatosCaracteristicasDetallesEmpleo = false;
    this.categoriaDatosEconomicosFinancierosSeguros = false;
    this.categoriaDatosSensibles = false;
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
    this.email = '';
    this.convenioResponsable = '';
    this.tipoPersona = '';
    this.tipoAdquisicionOtro = '';
    this.tipoAdquisicion = '';
    this.tipoProceso = '';

    this.formIndex = 0;

    let postFormsJuridicaRequestFlowTaskId: string;
    this.formsService
      .postFormsJuridicaRequestFlow(formsJuridicaRequest)
      .subscribe(
        (event) => {
          switch (event.type) {
            case HttpEventType.Sent:
              postFormsJuridicaRequestFlowTaskId =
                this.sharedService.pushWaitTask({
                  description: `Enviando peticion juricia...`,
                  progress: 0,
                }) as string;
              break;
            case HttpEventType.UploadProgress:
              this.sharedService.pushWaitTask({
                id: postFormsJuridicaRequestFlowTaskId,
                progress: Math.round((event.loaded * 100) / event.total),
              });
              break;
            case HttpEventType.Response:
              this.sharedService.pushToastMessage({
                id: Utils.makeRandomString(4),
                title: `Peticion juridica enviada satisfactoriamente`,
                description: `Su peticion juridica ha sido ingresada correctamente y sera procesada en la mayor brevedad posible, este atento al correo electronico registrado por el cual se le notificara del estado y manera de validacion de la peticion.`,
                autohide: 30000,
              });
              break;
          }
        },
        (httpEventError) => {
          this.sharedService.removeWaitTask({
            id: postFormsJuridicaRequestFlowTaskId,
          });
        },
        () => {
          this.sharedService.removeWaitTask({
            id: postFormsJuridicaRequestFlowTaskId,
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

  isValid() {
    switch (this.formIndex) {
      case 0:
        return this.tipoProceso;
      case 1:
        return (
          this.tipoAdquisicion &&
          (this.tipoAdquisicion === 'Otro' ? this.tipoAdquisicionOtro : true) &&
          this.tipoPersona &&
          this.convenioResponsable &&
          Utils.validateEmail(this.email) &&
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
            ? this.categoriaInteresado && this.isValidCategoriaDatos()
            : true)
        );
    }

    return false;
  }
}
