import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Utils } from 'src/app/classes/utils';
import { Convenio } from 'src/app/interfaces/Convenio';
import { FileItem } from 'src/app/interfaces/FileItem';
import { IJuridica } from 'src/app/interfaces/forms-juridica';
import { ToastMessage } from 'src/app/interfaces/toast-message';
import { WaitTask } from 'src/app/interfaces/WaitTask';
import { FormsService } from 'src/app/services/forms.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-forms-juridica',
  templateUrl: './juridica.component.html',
  styleUrls: ['./juridica.component.css'],
})
export class FormsJuridicaComponent implements OnInit {
  juridicaMap: Map<string, Map<string, number> | undefined> = new Map([
    [
      'Pago directo',
      new Map([
        ['Min', 10000000],
        ['Max', 40000001],
      ]),
    ],
    [
      'Directa',
      new Map([
        ['Min', 10000000],
        ['Max', 40000001],
      ]),
    ],
    ['Directa por excepcion', undefined],
    [
      'Comparativa de precios',
      new Map([
        ['Min', 40000000],
        ['Max', 80000001],
      ]),
    ],
    [
      'Procedimiento super simplificado',
      new Map([
        ['Min', 40000000],
        ['Max', 80000001],
      ]),
    ],
    [
      'Procedimiento simplificado',
      new Map([
        ['Min', 80000000],
        ['Max', 400000001],
      ]),
    ],
    [
      'Contrato marco',
      new Map([
        ['Min', 0],
        ['Max', 5000000001],
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
  numeroSolicitud: string = '';
  numeroContrato: string = '';
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
  categoriaDatosSensibles: boolean = false;
  categoriaDatosIdentificativos: boolean = false;
  categoriaDatosCaracteristicasPersonales: boolean = false;
  categoriaDatosCaracteristicasCircunstanciasSociales: boolean = false;
  categoriaDatosCaracteristicasDetallesEmpleo: boolean = false;
  categoriaDatosEconomicosFinancierosSeguros: boolean = false;

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

  constanciaArlFiles: FileItem[] = [];

  setConstanciaArlFiles(constanciaArlFiles: FileItem[]) {
    this.constanciaArlFiles = constanciaArlFiles;
  }

  tarjetaProfesionalFiles: FileItem[] = [];

  setTarjetaProfesionalFiles(tarjetaProfesionalFiles: FileItem[]) {
    this.tarjetaProfesionalFiles = tarjetaProfesionalFiles;
  }

  hojaVidaFiles: FileItem[] = [];

  setHojaVidaFiles(hojaVidaFiles: FileItem[]) {
    this.hojaVidaFiles = hojaVidaFiles;
  }

  soportesHojaVidaFiles: FileItem[] = [];

  setSoportesHojaVidaFiles(soportesHojaVidaFiles: FileItem[]) {
    this.soportesHojaVidaFiles = soportesHojaVidaFiles;
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

  informeTecnicoFiles: FileItem[] = [];

  setInformeTecnicoFiles(informeTecnicoFiles: FileItem[]) {
    this.informeTecnicoFiles = informeTecnicoFiles;
  }

  cuadroComparativoFiles: FileItem[] = [];

  setCuadroComparativoFiles(cuadroComparativoFiles: FileItem[]) {
    this.cuadroComparativoFiles = cuadroComparativoFiles;
  }

  informacionAdicional: string = '';

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
        this.tipoPersona = '';
        this.convenioResponsable = '';
        this.email = '';
        this.numeroSolicitud = '';
        this.numeroContrato = '';
        this.justificacionContratacion = '';
        this.objetivoContratacion = '';
        this.especificacionesTecnicasMinimas = '';
        this.perfilRequerido = '';
        this.factoresEvaluacion = '';
        this.objeto = '';
        this.obligacionesEspecificas = '';
        this.productosEntregables = '';
        const presupuestoEstimadoMinString = this.numberWithPriceSpaces(
          this.juridicaMap?.get(this.tipoProceso)?.get('Min')
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

    let formJuridica: IJuridica = {
      Id: Utils.makeRandomString(32),
      TipoProceso: this.tipoProceso,
      TipoAdquisicion: this.tipoAdquisicion,
      TipoAdquisicionOtro:
        this.tipoAdquisicion === 'Otro' ? this.tipoAdquisicionOtro : undefined,
      TipoPersona: this.tipoPersona,
      ConvenioResponsable: this.convenioResponsable,
      Email: this.email,
      NumeroSolicitud: this.numeroSolicitud
        .replace('/', '-')
        .trimStart()
        .trimEnd(),
      NumeroContrato: this.numeroContrato
        .replace('/', '-')
        .trimStart()
        .trimEnd(),
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

    // Cedula de ciudadania
    for (let i = 0; this.cedulaCiudadaniaFiles.length > i; i++) {
      let postUploadFileTaskId: string;
      await this.formsService
        .postUploadFile(
          this.cedulaCiudadaniaFiles[i].Name,
          this.cedulaCiudadaniaFiles[i].Bytes as ArrayBuffer
        )
        .pipe(
          map((httpEvent) => {
            switch (httpEvent.type) {
              case HttpEventType.Sent:
                postUploadFileTaskId = this.sharedService.pushWaitTask({
                  description: `Subiendo archivos cedula de ciudadania...`,
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
                delete this.cedulaCiudadaniaFiles[i].Bytes;
                this.cedulaCiudadaniaFiles[i].ServerPath = httpEvent.body;

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

    // rut
    for (let i = 0; this.RUTFiles.length > i; i++) {
      let postUploadFileTaskId: string;
      await this.formsService
        .postUploadFile(
          this.RUTFiles[i].Name,
          this.RUTFiles[i].Bytes as ArrayBuffer
        )
        .pipe(
          map((httpEvent) => {
            switch (httpEvent.type) {
              case HttpEventType.Sent:
                postUploadFileTaskId = this.sharedService.pushWaitTask({
                  description: `Subiendo archivos rut...`,
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
                delete this.RUTFiles[i].Bytes;
                this.RUTFiles[i].ServerPath = httpEvent.body;

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

    // certificacion bancaria
    for (let i = 0; this.certificacionBancariaFiles.length > i; i++) {
      let postUploadFileTaskId: string;
      await this.formsService
        .postUploadFile(
          this.certificacionBancariaFiles[i].Name,
          this.certificacionBancariaFiles[i].Bytes as ArrayBuffer
        )
        .pipe(
          map((httpEvent) => {
            switch (httpEvent.type) {
              case HttpEventType.Sent:
                postUploadFileTaskId = this.sharedService.pushWaitTask({
                  description: `Subiendo archivos certificacion bancaria...`,
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
                delete this.certificacionBancariaFiles[i].Bytes;
                this.certificacionBancariaFiles[i].ServerPath = httpEvent.body;

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

    //constancia de afiliacion a salud
    for (let i = 0; this.constanciaAfiliacionSaludFiles.length > i; i++) {
      let postUploadFileTaskId: string;
      await this.formsService
        .postUploadFile(
          this.constanciaAfiliacionSaludFiles[i].Name,
          this.constanciaAfiliacionSaludFiles[i].Bytes as ArrayBuffer
        )
        .pipe(
          map((httpEvent) => {
            switch (httpEvent.type) {
              case HttpEventType.Sent:
                postUploadFileTaskId = this.sharedService.pushWaitTask({
                  description: `Subiendo archivos constancia de afiliacion a salud...`,
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
                delete this.constanciaAfiliacionSaludFiles[i].Bytes;
                this.constanciaAfiliacionSaludFiles[i].ServerPath =
                  httpEvent.body;

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

    // constancia de afiliacion a pension
    for (let i = 0; this.constanciaAfiliacionPensionFiles.length > i; i++) {
      let postUploadFileTaskId: string;
      await this.formsService
        .postUploadFile(
          this.constanciaAfiliacionPensionFiles[i].Name,
          this.constanciaAfiliacionPensionFiles[i].Bytes as ArrayBuffer
        )
        .pipe(
          map((httpEvent) => {
            switch (httpEvent.type) {
              case HttpEventType.Sent:
                postUploadFileTaskId = this.sharedService.pushWaitTask({
                  description: `Subiendo archivos constancia de afiliacion a pension...`,
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
                delete this.constanciaAfiliacionPensionFiles[i].Bytes;
                this.constanciaAfiliacionPensionFiles[i].ServerPath =
                  httpEvent.body;

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

    // constancia de afiliacion a arl
    for (let i = 0; this.constanciaArlFiles.length > i; i++) {
      let postUploadFileTaskId: string;
      await this.formsService
        .postUploadFile(
          this.constanciaArlFiles[i].Name,
          this.constanciaArlFiles[i].Bytes as ArrayBuffer
        )
        .pipe(
          map((httpEvent) => {
            switch (httpEvent.type) {
              case HttpEventType.Sent:
                postUploadFileTaskId = this.sharedService.pushWaitTask({
                  description: `Subiendo archivos constancia de afiliacion a arl...`,
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
                delete this.constanciaArlFiles[i].Bytes;
                this.constanciaArlFiles[i].ServerPath = httpEvent.body;

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

    // tarjeta profesional
    for (let i = 0; this.tarjetaProfesionalFiles.length > i; i++) {
      let postUploadFileTaskId: string;
      await this.formsService
        .postUploadFile(
          this.tarjetaProfesionalFiles[i].Name,
          this.tarjetaProfesionalFiles[i].Bytes as ArrayBuffer
        )
        .pipe(
          map((httpEvent) => {
            switch (httpEvent.type) {
              case HttpEventType.Sent:
                postUploadFileTaskId = this.sharedService.pushWaitTask({
                  description: `Subiendo archivos tarjeta profesional...`,
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
                delete this.tarjetaProfesionalFiles[i].Bytes;
                this.tarjetaProfesionalFiles[i].ServerPath = httpEvent.body;

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

    // hoja de vida
    for (let i = 0; this.hojaVidaFiles.length > i; i++) {
      let postUploadFileTaskId: string;
      await this.formsService
        .postUploadFile(
          this.hojaVidaFiles[i].Name,
          this.hojaVidaFiles[i].Bytes as ArrayBuffer
        )
        .pipe(
          map((httpEvent) => {
            switch (httpEvent.type) {
              case HttpEventType.Sent:
                postUploadFileTaskId = this.sharedService.pushWaitTask({
                  description: `Subiendo archivos hoja de vida...`,
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
                delete this.hojaVidaFiles[i].Bytes;
                this.hojaVidaFiles[i].ServerPath = httpEvent.body;

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

    // soportes hoja de vida
    for (let i = 0; this.soportesHojaVidaFiles.length > i; i++) {
      let postUploadFileTaskId: string;
      await this.formsService
        .postUploadFile(
          this.soportesHojaVidaFiles[i].Name,
          this.soportesHojaVidaFiles[i].Bytes as ArrayBuffer
        )
        .pipe(
          map((httpEvent) => {
            switch (httpEvent.type) {
              case HttpEventType.Sent:
                postUploadFileTaskId = this.sharedService.pushWaitTask({
                  description: `Subiendo archivos soportes de la hoja de vida...`,
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
                delete this.soportesHojaVidaFiles[i].Bytes;
                this.soportesHojaVidaFiles[i].ServerPath = httpEvent.body;

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

    // justificacion contratacion
    for (let i = 0; this.justificacionContratacionFiles.length > i; i++) {
      let postUploadFileTaskId: string;
      await this.formsService
        .postUploadFile(
          this.justificacionContratacionFiles[i].Name,
          this.justificacionContratacionFiles[i].Bytes as ArrayBuffer
        )
        .pipe(
          map((httpEvent) => {
            switch (httpEvent.type) {
              case HttpEventType.Sent:
                postUploadFileTaskId = this.sharedService.pushWaitTask({
                  description: `Subiendo archivos justificacion contratacion...`,
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
                delete this.justificacionContratacionFiles[i].Bytes;
                this.justificacionContratacionFiles[i].ServerPath =
                  httpEvent.body;

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

    // cotizacion oferta
    for (let i = 0; this.cotizacionOfertaFiles.length > i; i++) {
      let postUploadFileTaskId: string;
      await this.formsService
        .postUploadFile(
          this.cotizacionOfertaFiles[i].Name,
          this.cotizacionOfertaFiles[i].Bytes as ArrayBuffer
        )
        .pipe(
          map((httpEvent) => {
            switch (httpEvent.type) {
              case HttpEventType.Sent:
                postUploadFileTaskId = this.sharedService.pushWaitTask({
                  description: `Subiendo archivos cotizacion u oferta...`,
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
                delete this.cotizacionOfertaFiles[i].Bytes;
                this.cotizacionOfertaFiles[i].ServerPath = httpEvent.body;

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

    // informe tecnico
    for (let i = 0; this.informeTecnicoFiles.length > i; i++) {
      let postUploadFileTaskId: string;
      await this.formsService
        .postUploadFile(
          this.informeTecnicoFiles[i].Name,
          this.informeTecnicoFiles[i].Bytes as ArrayBuffer
        )
        .pipe(
          map((httpEvent) => {
            switch (httpEvent.type) {
              case HttpEventType.Sent:
                postUploadFileTaskId = this.sharedService.pushWaitTask({
                  description: `Subiendo archivos informe tecnico...`,
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
                delete this.informeTecnicoFiles[i].Bytes;
                this.informeTecnicoFiles[i].ServerPath = httpEvent.body;

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

    // cuadro comparativo
    for (let i = 0; this.cuadroComparativoFiles.length > i; i++) {
      let postUploadFileTaskId: string;
      await this.formsService
        .postUploadFile(
          this.cuadroComparativoFiles[i].Name,
          this.cuadroComparativoFiles[i].Bytes as ArrayBuffer
        )
        .pipe(
          map((httpEvent) => {
            switch (httpEvent.type) {
              case HttpEventType.Sent:
                postUploadFileTaskId = this.sharedService.pushWaitTask({
                  description: `Subiendo archivos cuadro comparativo...`,
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
                delete this.cuadroComparativoFiles[i].Bytes;
                this.cuadroComparativoFiles[i].ServerPath = httpEvent.body;

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

    formJuridica = Object.assign(formJuridica, {
      cedulaCiudadaniaFiles: this.cedulaCiudadaniaFiles,
      RUTFiles: this.RUTFiles,
      certificacionBancariaFiles: this.certificacionBancariaFiles,
      constanciaAfiliacionSaludFiles: this.constanciaAfiliacionSaludFiles,
      constanciaAfiliacionPensionFiles: this.constanciaAfiliacionPensionFiles,
      constanciaArlFiles: this.constanciaArlFiles,
      tarjetaProfesionalFiles: this.tarjetaProfesionalFiles,
      hojaVidaFiles: this.hojaVidaFiles,
      soportesHojaVidaFiles: this.soportesHojaVidaFiles,
      justificacionContratacionFiles: this.justificacionContratacionFiles,
      cotizacionOfertaFiles: this.cotizacionOfertaFiles,
      informeTecnicoFiles: this.informeTecnicoFiles,
      cuadroComparativoFiles: this.cuadroComparativoFiles,
    });

    // Cleaning fields because information has been saved
    this.cedulaCiudadaniaFiles = [];
    this.RUTFiles = [];
    this.certificacionBancariaFiles = [];
    this.constanciaAfiliacionSaludFiles = [];
    this.constanciaAfiliacionPensionFiles = [];
    this.constanciaArlFiles = [];
    this.tarjetaProfesionalFiles = [];
    this.hojaVidaFiles = [];
    this.soportesHojaVidaFiles = [];
    this.justificacionContratacionFiles = [];
    this.cotizacionOfertaFiles = [];
    this.informeTecnicoFiles = [];
    this.cuadroComparativoFiles = [];

    // Cleaning fields because information has been saved
    this.informacionAdicional = '';
    this.categoriaDatosIdentificativos = false;
    this.categoriaDatosCaracteristicasPersonales = false;
    this.categoriaDatosCaracteristicasCircunstanciasSociales = false;
    this.categoriaDatosCaracteristicasDetallesEmpleo = false;
    this.categoriaDatosEconomicosFinancierosSeguros = false;
    this.categoriaDatosSensibles = false;
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
    this.numeroContrato = '';
    this.numeroSolicitud = '';
    this.email = '';
    this.convenioResponsable = '';
    this.tipoPersona = '';
    this.tipoAdquisicionOtro = '';
    this.tipoAdquisicion = '';
    this.tipoProceso = '';

    this.formIndex = 0;

    let postFormsJuridicaRequestFlowTaskId: string;
    this.formsService.postFormJuridicaFlow(formJuridica).subscribe(
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

  isConvocatorias(): boolean {
    return (
      this.tipoProceso === 'Procedimiento super simplificado' ||
      this.tipoProceso === 'Procedimiento simplificado' ||
      this.tipoProceso === 'Contrato marco' ||
      this.tipoProceso === 'Licitacion'
    );
  }

  isValidNumeroSolicitud: boolean = false;

  numeroSolicitudAlreadyExist: boolean = false;

  validateNumeroSolicitud() {
    if (!this.numeroSolicitud) {
      return;
    }

    this.formsService
      .getJuridicaValidateNumeroSolicitud(this.numeroSolicitud)
      .subscribe(
        (event) => {},
        (httpEventError: HttpErrorResponse) => {
          if (httpEventError.status === 404) {
            this.numeroSolicitudAlreadyExist = false;

            this.isValidNumeroSolicitud = true;
          } else {
            this.numeroSolicitudAlreadyExist = false;

            this.isValidNumeroSolicitud = false;
          }
        },
        () => {
          this.numeroSolicitudAlreadyExist = true;

          this.isValidNumeroSolicitud = false;
        }
      );
  }

  isValidNumeroContrato: boolean = false;

  numeroContratoAlreadyExist: boolean = false;

  validateNumeroContrato() {
    if (!this.numeroContrato) {
      return;
    }

    this.formsService
      .getJuridicaValidateNumeroContrato(this.numeroContrato)
      .subscribe(
        (event) => {},
        (httpEventError: HttpErrorResponse) => {
          if (httpEventError.status === 404) {
            this.numeroContratoAlreadyExist = false;

            this.isValidNumeroContrato = true;
          } else {
            this.numeroContratoAlreadyExist = false;

            this.isValidNumeroContrato = false;
          }
        },
        () => {
          this.numeroContratoAlreadyExist = true;

          this.isValidNumeroContrato = false;
        }
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
          this.numeroSolicitud &&
          this.isValidNumeroSolicitud &&
          (this.isConvocatorias()
            ? true
            : Utils.validateEmail(this.email) && this.numeroContrato) &&
          this.isValidNumeroContrato &&
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
            : true) &&
          (this.manejoDatos === 'Si'
            ? this.categoriaDatos && this.isValidCategoriaDatos()
            : true)
        );
    }

    return false;
  }
}
