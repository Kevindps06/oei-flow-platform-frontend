import { HttpEventType } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  isDevMode,
} from '@angular/core';
import { FileItem } from 'src/app/interfaces/FileItem';
import { WaitTask } from 'src/app/interfaces/WaitTask';
import { FormsService } from 'src/app/services/forms.service';
import { Utils } from 'src/app/classes/utils';
import { Convenio } from 'src/app/interfaces/Convenio';
import { FormsFinancieraInvoice } from 'src/app/interfaces/forms-financiera-invoice';
import { ToastMessage } from 'src/app/interfaces/toast-message';
import { SharedService } from 'src/app/services/shared.service';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-forms-financiera-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
})
export class FormsFinancieraInvoiceComponent implements OnInit {
  formIndex: number = 0;

  // 0
  tipoPersona: string = '';
  tipoRelacion: string = '';

  // 1
  identificator: string = '';
  digitoVerificacion: string = '';
  contratistaProveedorInformation: any;
  validacionUsuarioError: boolean = false;

  // 2
  tipoGestion: string = '';

  // 2.1
  tipoLegalizacion: string | undefined;

  // 3
  convenios: Convenio[] = [];
  convenio: string = '';

  // Cuenta de cobro o factura

  cuentaCobroFacturaFiles: FileItem[] = [];

  setCuentaCobroFacturaFiles(cuentaCobroFacturaFiles: FileItem[]) {
    this.cuentaCobroFacturaFiles = cuentaCobroFacturaFiles;
  }

  facturaEquivalenteFiles: FileItem[] = [];

  setFacturaEquivalenteFiles(facturaEquivalenteFiles: FileItem[]) {
    this.facturaEquivalenteFiles = facturaEquivalenteFiles;
  }

  seguridadSocialParafiscalesFiles: FileItem[] = [];

  setSeguridadSocialParafiscalesFiles(
    seguridadSocialParafiscalesFiles: FileItem[]
  ) {
    this.seguridadSocialParafiscalesFiles = seguridadSocialParafiscalesFiles;
  }

  informeActividadesFiles: FileItem[] = [];

  setInformeActividadesFiles(informeActividadesFiles: FileItem[]) {
    this.informeActividadesFiles = informeActividadesFiles;
  }

  polizaAnticipoCumplimientoFiles: FileItem[] = [];

  setPolizaAnticipoCumplimientoFiles(
    polizaAnticipoCumplimientoFiles: FileItem[]
  ) {
    this.polizaAnticipoCumplimientoFiles = polizaAnticipoCumplimientoFiles;
  }

  // Anticipo

  camaraComercioFiles: FileItem[] = [];

  setCamaraDeComercioFiles(camaraComercioFiles: FileItem[]) {
    this.camaraComercioFiles = camaraComercioFiles;
  }

  formatoSolicitudAvancesFiles: FileItem[] = [];

  setFormatoSolicitudAvancesFiles(formatoSolicitudAvancesFiles: FileItem[]) {
    this.formatoSolicitudAvancesFiles = formatoSolicitudAvancesFiles;
  }

  cotizacionesFiles: FileItem[] = [];

  setCotizacionesFiles(cotizacionesFiles: FileItem[]) {
    this.cotizacionesFiles = cotizacionesFiles;
  }

  solicitudesComisionFiles: FileItem[] = [];

  setSolicitudesComisionFiles(solicitudesComisionFiles: FileItem[]) {
    this.solicitudesComisionFiles = solicitudesComisionFiles;
  }

  // Dieta

  formatoSolicitudViajesFiles: FileItem[] = [];

  setFormatoSolicitudViajesFiles(formatoSolicitudViajesFiles: FileItem[]) {
    this.formatoSolicitudViajesFiles = formatoSolicitudViajesFiles;
  }

  // Legalizacion - Desplazamiento

  formatoLegalizacionViajesFiles: FileItem[] = [];

  setFormatoLegalizacionViajesFiles(
    formatoLegalizacionViajesFiles: FileItem[]
  ) {
    this.formatoLegalizacionViajesFiles = formatoLegalizacionViajesFiles;
  }

  soportesFacturasFiles: FileItem[] = [];

  setSoportesFacturasFiles(soportesFacturasFiles: FileItem[]) {
    this.soportesFacturasFiles = soportesFacturasFiles;
  }

  pasabordosTiquetesAereosFiles: FileItem[] = [];

  setPasabordosTiquetesAereosFiles(pasabordosTiquetesAereosFiles: FileItem[]) {
    this.pasabordosTiquetesAereosFiles = pasabordosTiquetesAereosFiles;
  }

  informeActividades2Files: FileItem[] = [];

  setInformeActividades2Files(informeActividades2Files: FileItem[]) {
    this.informeActividades2Files = informeActividades2Files;
  }

  // Legalizacion - Suministro y servicios

  formatoLegalizacionFiles: FileItem[] = [];

  setFormatoLegalizacionFiles(formatoLegalizacionFiles: FileItem[]) {
    this.formatoLegalizacionFiles = formatoLegalizacionFiles;
  }

  infoAdicional: string = '';

  @Output() onWaitTasksChange = new EventEmitter<WaitTask[]>();
  @Output() onToastMessagesChange = new EventEmitter<ToastMessage>();

  constructor(
    private formsService: FormsService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {}

  invalidateFlowUser() {
    this.contratistaProveedorInformation = undefined;
    this.validacionUsuarioError = false;
  }

  btnValidarUsuarioClick() {
    this.invalidateFlowUser();

    let validateFinancieraRegistrationTaskId!: string;
    this.formsService
      .validateFinancieraRegistration(
        this.tipoPersona,
        this.tipoRelacion,
        this.tipoPersona === 'Juridica'
          ? `${this.identificator}-${this.digitoVerificacion}`
          : this.identificator
      )
      .subscribe(
        (httpEvent) => {
          switch (httpEvent.type) {
            case HttpEventType.Sent:
              validateFinancieraRegistrationTaskId =
                this.sharedService.pushWaitTask({
                  description: 'Validando informacion...',
                  progress: 0,
                }) as string;
              break;
            case HttpEventType.DownloadProgress:
              this.sharedService.pushWaitTask({
                id: validateFinancieraRegistrationTaskId,
                progress: Math.round(
                  (httpEvent.loaded * 100) / httpEvent.total
                ),
              });
              break;
            case HttpEventType.Response:
              switch (httpEvent.body.Estado) {
                case 'Esperando verificacion':
                  this.sharedService.pushToastMessage({
                    id: Utils.makeRandomString(4),
                    title: `Registro en espera de aprobacion`,
                    description: `Hola ${httpEvent.body.Nombre_x0020_o_x0020_razon_x0020}, su peticion de registro aun se encuentra siendo procesada, vuelva mas tarde y, recuerde que cuando su peticion de registro sea respondida recibira una notificacion en su Email.`,
                    autohide: 20000,
                  });

                  this.validacionUsuarioError = true;
                  break;
                case 'Verificado':
                  this.sharedService.pushToastMessage({
                    id: Utils.makeRandomString(4),
                    title: `Bienvenido ${httpEvent.body.Nombre_x0020_o_x0020_razon_x0020}`,
                    description: `Hola ${httpEvent.body.Nombre_x0020_o_x0020_razon_x0020}, esperamos tengas la mejor de las estancias.`,
                  });

                  this.contratistaProveedorInformation = httpEvent.body;
                  break;
                case 'Rechazado':
                  this.sharedService.pushToastMessage({
                    id: Utils.makeRandomString(4),
                    title: `Registro rechazado`,
                    description: `Hola ${httpEvent.body.Nombre_x0020_o_x0020_razon_x0020}, la ultima peticion de registro con esta informacion ha sido rechazada, verifiquela y vuelva a intentarlo o registrese <a href="/forms/financiera/registration">aqui</a>.`,
                    autohide: 20000,
                  });

                  this.validacionUsuarioError = true;
                  break;
              }
              break;
          }
        },
        (httpEventError) => {
          switch (httpEventError.status) {
            case 404:
              this.sharedService.pushToastMessage({
                id: Utils.makeRandomString(4),
                title: `Registro no encontrado`,
                description: `No se ha encontrado ningun registro con la informacion ingresada, verifiquela y vuelva a intentarlo o registrese <a href="/forms/financiera/registration">aqui</a>.`,
                autohide: 20000,
              });

              this.validacionUsuarioError = true;
              break;
          }

          this.sharedService.removeWaitTask({
            id: validateFinancieraRegistrationTaskId,
          });
        },
        () => {
          this.sharedService.removeWaitTask({
            id: validateFinancieraRegistrationTaskId,
          });
        }
      );
  }

  btnPreviousClick() {
    switch (this.formIndex) {
      case 1:
        // Reset form index 0 values
        this.tipoPersona = '';
        this.tipoRelacion = '';
        break;
      case 2:
        // Reset form index 1 values
        this.identificator = '';
        this.digitoVerificacion = '';
        //this.email = '';
        this.contratistaProveedorInformation = undefined;
        this.validacionUsuarioError = false;
        break;
      case 2.1:
        // Reset form index 2 values
        this.tipoGestion = '';

        this.formIndex = 2;
        return;
      case 3:
        if (this.tipoGestion === 'Legalizacion') {
          // Reset form index 2.1 values
          this.tipoLegalizacion = '';

          this.formIndex = 2.1;
          return;
        }

        // Reset form index 2 values
        this.tipoGestion = '';
        break;
    }

    // Reduce form index by 1
    this.formIndex--;
  }

  btnNextClick() {
    switch (this.formIndex) {
      case 0:
        // Reset form index 1 values
        this.identificator = '';
        this.digitoVerificacion = '';
        //this.email = '';
        this.contratistaProveedorInformation = undefined;
        this.validacionUsuarioError = false;
        break;
      case 1:
        // Reset form index 2 values
        this.tipoGestion = '';
        break;
      case 2:
        if (this.tipoGestion === 'Legalizacion') {
          // Reset form index 2.1 values
          this.tipoLegalizacion = '';

          this.formIndex = 2.1;
          return;
        }

        // Reset form index 3 values
        this.convenio = '';
        switch (this.tipoGestion) {
          case 'Cuenta de cobro':
            this.cuentaCobroFacturaFiles = [];
            this.facturaEquivalenteFiles = [];
            this.seguridadSocialParafiscalesFiles = [];
            this.informeActividadesFiles = [];
            break;
          case 'Anticipo':
            this.formatoSolicitudAvancesFiles = [];
            break;
          case 'Dieta':
            this.formatoSolicitudViajesFiles = [];
            break;
          case 'Legalizacion':
            break;
          default:
            break;
        }
        // Load form index 3 values
        let getConveniosFinancieraTaskId0!: string;
        this.formsService.getConveniosFinanciera().subscribe(
          (httpEvent) => {
            switch (httpEvent.type) {
              case HttpEventType.Sent:
                getConveniosFinancieraTaskId0 = this.sharedService.pushWaitTask(
                  {
                    description: 'Cargando convenios...',
                    progress: 0,
                  }
                ) as string;
                break;
              case HttpEventType.DownloadProgress:
                this.sharedService.pushWaitTask({
                  id: getConveniosFinancieraTaskId0,
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
              id: getConveniosFinancieraTaskId0,
            });
          },
          () => {
            this.sharedService.removeWaitTask({
              id: getConveniosFinancieraTaskId0,
            });
          }
        );
        break;
      case 2.1:
        // Reset form index 3 values
        this.convenio = '';
        switch (this.tipoGestion) {
          case 'Cuenta de cobro':
            this.cuentaCobroFacturaFiles = [];
            this.facturaEquivalenteFiles = [];
            this.seguridadSocialParafiscalesFiles = [];
            this.informeActividadesFiles = [];
            break;
          case 'Anticipo':
            this.formatoSolicitudAvancesFiles = [];
            break;
          case 'Dieta':
            this.formatoSolicitudViajesFiles = [];
            break;
          case 'Legalizacion':
            switch (this.tipoLegalizacion) {
              case 'Desplazamiento':
                this.formatoLegalizacionViajesFiles = [];
                this.soportesFacturasFiles = [];
                this.pasabordosTiquetesAereosFiles = [];
                this.informeActividades2Files = [];
                break;
            }
            break;
          default:
            break;
        }
        // Load form index 3 values
        let getConveniosFinancieraTaskId1!: string;
        this.formsService.getConveniosFinanciera().subscribe((event) => {
          switch (event.type) {
            case HttpEventType.Sent:
              getConveniosFinancieraTaskId1 = this.sharedService.pushWaitTask({
                description: 'Cargando convenios...',
                progress: 0,
              }) as string;
              break;
            case HttpEventType.DownloadProgress:
              this.sharedService.pushWaitTask({
                id: getConveniosFinancieraTaskId1,
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
                id: getConveniosFinancieraTaskId1,
              });
              break;
          }
        });

        this.formIndex = 3;
        return;
    }

    this.formIndex++;
  }

  validateEmail(email: string): boolean {
    return Utils.validateEmail(email);
  }

  isDevMode() {
    return isDevMode();
  }

  async btnSubmitClick() {
    document.getElementById('firstElement')?.scrollIntoView({
      behavior: 'smooth',
    });

    let formsFinancieraInvoice: FormsFinancieraInvoice = {
      Id: Utils.makeRandomString(32),
      TipoPersona: this.tipoPersona,
      TipoRelacion: this.tipoRelacion,
      Identificator:
        this.tipoPersona === 'Natural'
          ? this.identificator
          : `${this.identificator}-${this.digitoVerificacion}`,
      Email: this.contratistaProveedorInformation.Emaildecontacto,
      TipoGestion: this.tipoGestion,
      TipoLegalizacion: this.tipoLegalizacion,
      Convenio: this.convenio,
      InformacionAdicional: this.infoAdicional.replace('"', "'"),
      Requestor: this.contratistaProveedorInformation,
    };

    if (this.tipoPersona === 'Natural') {
      switch (this.tipoGestion) {
        case 'Cuenta de cobro':
          for (let i = 0; this.cuentaCobroFacturaFiles.length > i; i++) {
            let postUploadFileTaskId!: string;
            await this.formsService
              .postUploadFile(
                this.cuentaCobroFacturaFiles[i].Name,
                this.cuentaCobroFacturaFiles[i].Bytes as ArrayBuffer
              )
              .pipe(
                map((httpEvent) => {
                  switch (httpEvent.type) {
                    case HttpEventType.Sent:
                      postUploadFileTaskId = this.sharedService.pushWaitTask({
                        description: `Subiendo archivos de cuenta de cobro o factura...`,
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
                      delete this.cuentaCobroFacturaFiles[i].Bytes;
                      this.cuentaCobroFacturaFiles[i].ServerPath =
                        httpEvent.body;

                      this.sharedService.removeWaitTask({
                        id: postUploadFileTaskId,
                      });
                      break;
                  }
                }),
                catchError((err) => {
                  this.sharedService.removeWaitTask({
                    id: postUploadFileTaskId,
                  });

                  return throwError(err);
                })
              )
              .toPromise();
          }

          for (let i = 0; this.facturaEquivalenteFiles.length > i; i++) {
            let postUploadFileTaskId: string;
            await this.formsService
              .postUploadFile(
                this.facturaEquivalenteFiles[i].Name,
                this.facturaEquivalenteFiles[i].Bytes as ArrayBuffer
              )
              .pipe(
                map((httpEvent) => {
                  switch (httpEvent.type) {
                    case HttpEventType.Sent:
                      postUploadFileTaskId = this.sharedService.pushWaitTask({
                        description: `Subiendo archivos de factura equivalente...`,
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
                      delete this.facturaEquivalenteFiles[i].Bytes;
                      this.facturaEquivalenteFiles[i].ServerPath =
                        httpEvent.body;

                      this.sharedService.removeWaitTask({
                        id: postUploadFileTaskId,
                      });
                      break;
                  }
                }),
                catchError((err) => {
                  this.sharedService.removeWaitTask({
                    id: postUploadFileTaskId,
                  });

                  return throwError(err);
                })
              )
              .toPromise();
          }

          for (
            let i = 0;
            this.seguridadSocialParafiscalesFiles.length > i;
            i++
          ) {
            let postUploadFileTaskI: string;
            await this.formsService
              .postUploadFile(
                this.seguridadSocialParafiscalesFiles[i].Name,
                this.seguridadSocialParafiscalesFiles[i].Bytes as ArrayBuffer
              )
              .pipe(
                map((httpEvent) => {
                  switch (httpEvent.type) {
                    case HttpEventType.Sent:
                      postUploadFileTaskI = this.sharedService.pushWaitTask({
                        description: `Subiendo archivos de ${
                          this.tipoPersona === 'Natural'
                            ? 'seguridad social'
                            : 'parafiscales'
                        }...`,
                        progress: 0,
                      }) as string;
                      break;
                    case HttpEventType.UploadProgress:
                      this.sharedService.pushWaitTask({
                        id: postUploadFileTaskI,
                        progress: Math.round(
                          (httpEvent.loaded * 100) / httpEvent.total
                        ),
                      });
                      break;
                    case HttpEventType.Response:
                      delete this.seguridadSocialParafiscalesFiles[i].Bytes;
                      this.seguridadSocialParafiscalesFiles[i].ServerPath =
                        httpEvent.body;

                      this.sharedService.removeWaitTask({
                        id: postUploadFileTaskI,
                      });
                      break;
                  }
                }),
                catchError((err) => {
                  this.sharedService.removeWaitTask({
                    id: postUploadFileTaskI,
                  });

                  return throwError(err);
                })
              )
              .toPromise();
          }

          for (let i = 0; this.informeActividadesFiles.length > i; i++) {
            let postUploadFileTaskId: string;
            await this.formsService
              .postUploadFile(
                this.informeActividadesFiles[i].Name,
                this.informeActividadesFiles[i].Bytes as ArrayBuffer
              )
              .pipe(
                map((httpEvent) => {
                  switch (httpEvent.type) {
                    case HttpEventType.Sent:
                      postUploadFileTaskId = this.sharedService.pushWaitTask({
                        description: `Subiendo archivos de informe de actividades...`,
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
                      delete this.informeActividadesFiles[i].Bytes;
                      this.informeActividadesFiles[i].ServerPath =
                        httpEvent.body;

                      this.sharedService.removeWaitTask({
                        id: postUploadFileTaskId,
                      });
                      break;
                  }
                }),
                catchError((err) => {
                  this.sharedService.removeWaitTask({
                    id: postUploadFileTaskId,
                  });

                  return throwError(err);
                })
              )
              .toPromise();
          }

          formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
            CuentaCobroFiles: this.cuentaCobroFacturaFiles,
            FacturaEquivalenteFiles: this.facturaEquivalenteFiles,
            SeguridadSocialFiles: this.seguridadSocialParafiscalesFiles,
            InformeActividadesFiles: this.informeActividadesFiles,
          });
          // Cleaning fields because information has been saved
          this.informeActividadesFiles = [];
          this.seguridadSocialParafiscalesFiles = [];
          this.facturaEquivalenteFiles = [];
          this.cuentaCobroFacturaFiles = [];
          break;
        case 'Anticipo':
          for (let i = 0; this.formatoSolicitudAvancesFiles.length > i; i++) {
            let postUploadFileTaskId: string;
            await this.formsService
              .postUploadFile(
                this.formatoSolicitudAvancesFiles[i].Name,
                this.formatoSolicitudAvancesFiles[i].Bytes as ArrayBuffer
              )
              .pipe(
                map((httpEvent) => {
                  switch (httpEvent.type) {
                    case HttpEventType.Sent:
                      postUploadFileTaskId = this.sharedService.pushWaitTask({
                        description: `Subiendo archivos de formato de solicitud de avances...`,
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
                      delete this.formatoSolicitudAvancesFiles[i].Bytes;
                      this.formatoSolicitudAvancesFiles[i].ServerPath =
                        httpEvent.body;

                      this.sharedService.removeWaitTask({
                        id: postUploadFileTaskId,
                      });
                      break;
                  }
                }),
                catchError((err) => {
                  this.sharedService.removeWaitTask({
                    id: postUploadFileTaskId,
                  });

                  return throwError(err);
                })
              )
              .toPromise();
          }

          for (let i = 0; this.cotizacionesFiles.length > i; i++) {
            let postUploadFileTaskId: string;
            await this.formsService
              .postUploadFile(
                this.cotizacionesFiles[i].Name,
                this.cotizacionesFiles[i].Bytes as ArrayBuffer
              )
              .pipe(
                map((httpEvent) => {
                  switch (httpEvent.type) {
                    case HttpEventType.Sent:
                      postUploadFileTaskId = this.sharedService.pushWaitTask({
                        description: `Subiendo archivos de cotizaciones...`,
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
                      delete this.cotizacionesFiles[i].Bytes;
                      this.cotizacionesFiles[i].ServerPath = httpEvent.body;

                      this.sharedService.removeWaitTask({
                        id: postUploadFileTaskId,
                      });
                      break;
                  }
                }),
                catchError((err) => {
                  this.sharedService.removeWaitTask({
                    id: postUploadFileTaskId,
                  });

                  return throwError(err);
                })
              )
              .toPromise();
          }

          for (let i = 0; this.solicitudesComisionFiles.length > i; i++) {
            let postUploadFileTaskId: string;
            await this.formsService
              .postUploadFile(
                this.solicitudesComisionFiles[i].Name,
                this.solicitudesComisionFiles[i].Bytes as ArrayBuffer
              )
              .pipe(
                map((httpEvent) => {
                  switch (httpEvent.type) {
                    case HttpEventType.Sent:
                      postUploadFileTaskId = this.sharedService.pushWaitTask({
                        description: `Subiendo archivos de solicitudes de comision...`,
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
                      delete this.solicitudesComisionFiles[i].Bytes;
                      this.solicitudesComisionFiles[i].ServerPath =
                        httpEvent.body;

                      this.sharedService.removeWaitTask({
                        id: postUploadFileTaskId,
                      });
                      break;
                  }
                }),
                catchError((err) => {
                  this.sharedService.removeWaitTask({
                    id: postUploadFileTaskId,
                  });

                  return throwError(err);
                })
              )
              .toPromise();
          }

          formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
            FormatoSolicitudAvancesFiles: this.formatoSolicitudAvancesFiles,
            CotizacionesFiles: this.cotizacionesFiles,
            SolicitudesComisionFiles: this.solicitudesComisionFiles,
          });
          // Cleaning fields because information has been saved
          this.solicitudesComisionFiles = [];
          this.cotizacionesFiles = [];
          this.formatoSolicitudAvancesFiles = [];
          break;
        case 'Dieta':
          for (let i = 0; this.formatoSolicitudViajesFiles.length > i; i++) {
            let postUploadFileTaskId: string;
            await this.formsService
              .postUploadFile(
                this.formatoSolicitudViajesFiles[i].Name,
                this.formatoSolicitudViajesFiles[i].Bytes as ArrayBuffer
              )
              .pipe(
                map((httpEvent) => {
                  switch (httpEvent.type) {
                    case HttpEventType.Sent:
                      postUploadFileTaskId = this.sharedService.pushWaitTask({
                        description: `Subiendo archivos de formato de solicitud de viajes...`,
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
                      delete this.formatoSolicitudViajesFiles[i].Bytes;
                      this.formatoSolicitudViajesFiles[i].ServerPath =
                        httpEvent.body;

                      this.sharedService.removeWaitTask({
                        id: postUploadFileTaskId,
                      });
                      break;
                  }
                }),
                catchError((err) => {
                  this.sharedService.removeWaitTask({
                    id: postUploadFileTaskId,
                  });

                  return throwError(err);
                })
              )
              .toPromise();
          }

          formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
            FormatoSolicitudViajesFiles: this.formatoSolicitudViajesFiles,
          });
          // Cleaning fields because information has been saved
          this.formatoSolicitudViajesFiles = [];
          break;
        case 'Legalizacion':
          switch (this.tipoLegalizacion) {
            case 'Desplazamiento':
              for (
                let i = 0;
                this.formatoLegalizacionViajesFiles.length > i;
                i++
              ) {
                let postUploadFileTaskId: string;
                await this.formsService
                  .postUploadFile(
                    this.formatoLegalizacionViajesFiles[i].Name,
                    this.formatoLegalizacionViajesFiles[i].Bytes as ArrayBuffer
                  )
                  .pipe(
                    map((httpEvent) => {
                      switch (httpEvent.type) {
                        case HttpEventType.Sent:
                          postUploadFileTaskId =
                            this.sharedService.pushWaitTask({
                              description: `Subiendo archivos de formato de legalizacion de viajes...`,
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
                          delete this.formatoLegalizacionViajesFiles[i].Bytes;
                          this.formatoLegalizacionViajesFiles[i].ServerPath =
                            httpEvent.body;

                          this.sharedService.removeWaitTask({
                            id: postUploadFileTaskId,
                          });
                          break;
                      }
                    }),
                    catchError((err) => {
                      this.sharedService.removeWaitTask({
                        id: postUploadFileTaskId,
                      });

                      return throwError(err);
                    })
                  )
                  .toPromise();
              }

              for (let i = 0; this.soportesFacturasFiles.length > i; i++) {
                let postUploadFileTaskId: string;
                await this.formsService
                  .postUploadFile(
                    this.soportesFacturasFiles[i].Name,
                    this.soportesFacturasFiles[i].Bytes as ArrayBuffer
                  )
                  .pipe(
                    map((httpEvent) => {
                      switch (httpEvent.type) {
                        case HttpEventType.Sent:
                          postUploadFileTaskId =
                            this.sharedService.pushWaitTask({
                              description: `Subiendo archivos de soportes de facturas...`,
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
                          delete this.soportesFacturasFiles[i].Bytes;
                          this.soportesFacturasFiles[i].ServerPath =
                            httpEvent.body;

                          this.sharedService.removeWaitTask({
                            id: postUploadFileTaskId,
                          });
                          break;
                      }
                    }),
                    catchError((err) => {
                      this.sharedService.removeWaitTask({
                        id: postUploadFileTaskId,
                      });

                      return throwError(err);
                    })
                  )
                  .toPromise();
              }

              for (
                let i = 0;
                this.pasabordosTiquetesAereosFiles.length > i;
                i++
              ) {
                let postUploadFileTaskId: string;
                await this.formsService
                  .postUploadFile(
                    this.pasabordosTiquetesAereosFiles[i].Name,
                    this.pasabordosTiquetesAereosFiles[i].Bytes as ArrayBuffer
                  )
                  .pipe(
                    map((httpEvent) => {
                      switch (httpEvent.type) {
                        case HttpEventType.Sent:
                          postUploadFileTaskId =
                            this.sharedService.pushWaitTask({
                              description: `Subiendo archivos de pasabordos tiquetes aereos...`,
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
                          delete this.pasabordosTiquetesAereosFiles[i].Bytes;
                          this.pasabordosTiquetesAereosFiles[i].ServerPath =
                            httpEvent.body;

                          this.sharedService.removeWaitTask({
                            id: postUploadFileTaskId,
                          });
                          break;
                      }
                    }),
                    catchError((err) => {
                      this.sharedService.removeWaitTask({
                        id: postUploadFileTaskId,
                      });

                      return throwError(err);
                    })
                  )
                  .toPromise();
              }

              for (let i = 0; this.informeActividades2Files.length > i; i++) {
                let postUploadFileTaskId: string;
                await this.formsService
                  .postUploadFile(
                    this.informeActividades2Files[i].Name,
                    this.informeActividades2Files[i].Bytes as ArrayBuffer
                  )
                  .pipe(
                    map((httpEvent) => {
                      switch (httpEvent.type) {
                        case HttpEventType.Sent:
                          postUploadFileTaskId =
                            this.sharedService.pushWaitTask({
                              description: `Subiendo archivos de informe de actividades...`,
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
                          delete this.informeActividades2Files[i].Bytes;
                          this.informeActividades2Files[i].ServerPath =
                            httpEvent.body;

                          this.sharedService.removeWaitTask({
                            id: postUploadFileTaskId,
                          });
                          break;
                      }
                    }),
                    catchError((err) => {
                      this.sharedService.removeWaitTask({
                        id: postUploadFileTaskId,
                      });

                      return throwError(err);
                    })
                  )
                  .toPromise();
              }

              formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
                FormatoLegalizacionViajesFiles:
                  this.formatoLegalizacionViajesFiles,
                SoportesFacturasFiles: this.soportesFacturasFiles,
                PasabordosTiquetesAereosFiles:
                  this.pasabordosTiquetesAereosFiles,
                InformeActividadesFiles: this.informeActividades2Files,
              });
              // Cleaning fields because information has been saved
              this.formatoLegalizacionViajesFiles = [];
              this.soportesFacturasFiles = [];
              this.pasabordosTiquetesAereosFiles = [];
              this.informeActividades2Files = [];
              break;
            case 'Suministro y servicios':
              for (let i = 0; this.formatoLegalizacionFiles.length > i; i++) {
                let postUploadFileTaskId: string;
                await this.formsService
                  .postUploadFile(
                    this.formatoLegalizacionFiles[i].Name,
                    this.formatoLegalizacionFiles[i].Bytes as ArrayBuffer
                  )
                  .pipe(
                    map((httpEvent) => {
                      switch (httpEvent.type) {
                        case HttpEventType.Sent:
                          postUploadFileTaskId =
                            this.sharedService.pushWaitTask({
                              description: `Subiendo archivos de formato de legalizacion...`,
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
                          delete this.formatoLegalizacionFiles[i].Bytes;
                          this.formatoLegalizacionFiles[i].ServerPath =
                            httpEvent.body;

                          this.sharedService.removeWaitTask({
                            id: postUploadFileTaskId,
                          });
                          break;
                      }
                    }),
                    catchError((err) => {
                      this.sharedService.removeWaitTask({
                        id: postUploadFileTaskId,
                      });

                      return throwError(err);
                    })
                  )
                  .toPromise();
              }

              for (let i = 0; this.cuentaCobroFacturaFiles.length > i; i++) {
                let postUploadFileTaskId: string;
                await this.formsService
                  .postUploadFile(
                    this.cuentaCobroFacturaFiles[i].Name,
                    this.cuentaCobroFacturaFiles[i].Bytes as ArrayBuffer
                  )
                  .pipe(
                    map((httpEvent) => {
                      switch (httpEvent.type) {
                        case HttpEventType.Sent:
                          postUploadFileTaskId =
                            this.sharedService.pushWaitTask({
                              description: `Subiendo archivos de cuenta de cobro o factura...`,
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
                          delete this.cuentaCobroFacturaFiles[i].Bytes;
                          this.cuentaCobroFacturaFiles[i].ServerPath =
                            httpEvent.body;

                          this.sharedService.removeWaitTask({
                            id: postUploadFileTaskId,
                          });
                          break;
                      }
                    }),
                    catchError((err) => {
                      this.sharedService.removeWaitTask({
                        id: postUploadFileTaskId,
                      });

                      return throwError(err);
                    })
                  )
                  .toPromise();
              }

              for (let i = 0; this.soportesFacturasFiles.length > i; i++) {
                let postUploadFileTaskId: string;
                await this.formsService
                  .postUploadFile(
                    this.soportesFacturasFiles[i].Name,
                    this.soportesFacturasFiles[i].Bytes as ArrayBuffer
                  )
                  .pipe(
                    map((httpEvent) => {
                      switch (httpEvent.type) {
                        case HttpEventType.Sent:
                          postUploadFileTaskId =
                            this.sharedService.pushWaitTask({
                              description: `Subiendo archivos de soportes facturas...`,
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
                          delete this.soportesFacturasFiles[i].Bytes;
                          this.soportesFacturasFiles[i].ServerPath =
                            httpEvent.body;

                          this.sharedService.removeWaitTask({
                            id: postUploadFileTaskId,
                          });
                          break;
                      }
                    }),
                    catchError((err) => {
                      this.sharedService.removeWaitTask({
                        id: postUploadFileTaskId,
                      });

                      return throwError(err);
                    })
                  )
                  .toPromise();
              }

              formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
                FormatoLegalizacionFiles: this.formatoLegalizacionFiles,
                CuentaCobroFiles: this.cuentaCobroFacturaFiles,
                SoportesFacturasFiles: this.soportesFacturasFiles,
              });
              // Cleaning fields because information has been saved
              this.formatoLegalizacionFiles = [];
              this.cuentaCobroFacturaFiles = [];
              this.soportesFacturasFiles = [];
              break;
          }
          break;
      }
    } else {
      switch (this.tipoGestion) {
        case 'Cuenta de cobro':
          for (let i = 0; this.cuentaCobroFacturaFiles.length > i; i++) {
            let postUploadFileTaskId: string;
            await this.formsService
              .postUploadFile(
                this.cuentaCobroFacturaFiles[i].Name,
                this.cuentaCobroFacturaFiles[i].Bytes as ArrayBuffer
              )
              .pipe(
                map((httpEvent) => {
                  switch (httpEvent.type) {
                    case HttpEventType.Sent:
                      postUploadFileTaskId = this.sharedService.pushWaitTask({
                        description: `Subiendo archivos de cuenta de cobro o factura...`,
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
                      delete this.cuentaCobroFacturaFiles[i].Bytes;
                      this.cuentaCobroFacturaFiles[i].ServerPath =
                        httpEvent.body;

                      this.sharedService.removeWaitTask({
                        id: postUploadFileTaskId,
                      });
                      break;
                  }
                }),
                catchError((err) => {
                  this.sharedService.removeWaitTask({
                    id: postUploadFileTaskId,
                  });

                  return throwError(err);
                })
              )
              .toPromise();
          }

          for (let i = 0; this.facturaEquivalenteFiles.length > i; i++) {
            let postUploadFileTaskId: string;
            await this.formsService
              .postUploadFile(
                this.facturaEquivalenteFiles[i].Name,
                this.facturaEquivalenteFiles[i].Bytes as ArrayBuffer
              )
              .pipe(
                map((httpEvent) => {
                  switch (httpEvent.type) {
                    case HttpEventType.Sent:
                      postUploadFileTaskId = this.sharedService.pushWaitTask({
                        description: `Subiendo archivos de factura equivalente...`,
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
                      delete this.facturaEquivalenteFiles[i].Bytes;
                      this.facturaEquivalenteFiles[i].ServerPath =
                        httpEvent.body;

                      this.sharedService.removeWaitTask({
                        id: postUploadFileTaskId,
                      });
                      break;
                  }
                }),
                catchError((err) => {
                  this.sharedService.removeWaitTask({
                    id: postUploadFileTaskId,
                  });

                  return throwError(err);
                })
              )
              .toPromise();
          }

          for (
            let i = 0;
            this.seguridadSocialParafiscalesFiles.length > i;
            i++
          ) {
            let postUploadFileTaskId: string;
            await this.formsService
              .postUploadFile(
                this.seguridadSocialParafiscalesFiles[i].Name,
                this.seguridadSocialParafiscalesFiles[i].Bytes as ArrayBuffer
              )
              .pipe(
                map((httpEvent) => {
                  switch (httpEvent.type) {
                    case HttpEventType.Sent:
                      postUploadFileTaskId = this.sharedService.pushWaitTask({
                        description: `Subiendo archivos de parafiscales...`,
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
                      delete this.seguridadSocialParafiscalesFiles[i].Bytes;
                      this.seguridadSocialParafiscalesFiles[i].ServerPath =
                        httpEvent.body;

                      this.sharedService.removeWaitTask({
                        id: postUploadFileTaskId,
                      });
                      break;
                  }
                }),
                catchError((err) => {
                  this.sharedService.removeWaitTask({
                    id: postUploadFileTaskId,
                  });

                  return throwError(err);
                })
              )
              .toPromise();
          }

          for (let i = 0; this.informeActividadesFiles.length > i; i++) {
            let postUploadFileTaskId: string;
            await this.formsService
              .postUploadFile(
                this.informeActividadesFiles[i].Name,
                this.informeActividadesFiles[i].Bytes as ArrayBuffer
              )
              .pipe(
                map((httpEvent) => {
                  switch (httpEvent.type) {
                    case HttpEventType.Sent:
                      postUploadFileTaskId = this.sharedService.pushWaitTask({
                        description: `Subiendo archivos de informe de actividades...`,
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
                      delete this.informeActividadesFiles[i].Bytes;
                      this.informeActividadesFiles[i].ServerPath =
                        httpEvent.body;

                      this.sharedService.removeWaitTask({
                        id: postUploadFileTaskId,
                      });
                      break;
                  }
                }),
                catchError((err) => {
                  this.sharedService.removeWaitTask({
                    id: postUploadFileTaskId,
                  });

                  return throwError(err);
                })
              )
              .toPromise();
          }

          formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
            CuentaCobroFiles: this.cuentaCobroFacturaFiles,
            FacturaEquivalenteFiles: this.facturaEquivalenteFiles,
            CertificadoParafiscalesFiles: this.seguridadSocialParafiscalesFiles,
            InformeActividadesFiles: this.informeActividadesFiles,
          });

          if (this.tipoRelacion === 'Contratista') {
            for (
              let i = 0;
              this.polizaAnticipoCumplimientoFiles.length > i;
              i++
            ) {
              let postUploadFileTaskId!: string;

              await this.formsService
                .postUploadFile(
                  this.polizaAnticipoCumplimientoFiles[i].Name,
                  this.polizaAnticipoCumplimientoFiles[i].Bytes as ArrayBuffer
                )
                .pipe(
                  map((httpEvent) => {
                    switch (httpEvent.type) {
                      case HttpEventType.Sent:
                        postUploadFileTaskId = this.sharedService.pushWaitTask({
                          description: `Subiendo archivos de poliza de anticipo de cumplimiento...`,
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
                        delete this.polizaAnticipoCumplimientoFiles[i].Bytes;
                        this.polizaAnticipoCumplimientoFiles[i].ServerPath =
                          httpEvent.body;

                        this.sharedService.removeWaitTask({
                          id: postUploadFileTaskId,
                        });
                        break;
                    }
                  }),
                  catchError((err) => {
                    this.sharedService.removeWaitTask({
                      id: postUploadFileTaskId,
                    });

                    return throwError(err);
                  })
                )
                .toPromise();
            }

            formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
              PolizaAnticipoCumplientoFiles:
                this.polizaAnticipoCumplimientoFiles,
            });

            this.polizaAnticipoCumplimientoFiles = [];
          }

          // Cleaning fields because information has been saved
          this.informeActividadesFiles = [];
          this.seguridadSocialParafiscalesFiles = [];
          this.facturaEquivalenteFiles = [];
          this.cuentaCobroFacturaFiles = [];
          break;
        case 'Anticipo':
          for (let i = 0; this.camaraComercioFiles.length > i; i++) {
            let postUploadFileTaskId: string;
            await this.formsService
              .postUploadFile(
                this.camaraComercioFiles[i].Name,
                this.camaraComercioFiles[i].Bytes as ArrayBuffer
              )
              .pipe(
                map((httpEvent) => {
                  switch (httpEvent.type) {
                    case HttpEventType.Sent:
                      postUploadFileTaskId = this.sharedService.pushWaitTask({
                        description: `Subiendo archivos de camara de comercio...`,
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
                      delete this.camaraComercioFiles[i].Bytes;
                      this.camaraComercioFiles[i].ServerPath = httpEvent.body;

                      this.sharedService.removeWaitTask({
                        id: postUploadFileTaskId,
                      });
                      break;
                  }
                }),
                catchError((err) => {
                  this.sharedService.removeWaitTask({
                    id: postUploadFileTaskId,
                  });

                  return throwError(err);
                })
              )
              .toPromise();
          }

          for (let i = 0; this.formatoSolicitudAvancesFiles.length > i; i++) {
            let postUploadFileTaskId: string;
            await this.formsService
              .postUploadFile(
                this.formatoSolicitudAvancesFiles[i].Name,
                this.formatoSolicitudAvancesFiles[i].Bytes as ArrayBuffer
              )
              .pipe(
                map((httpEvent) => {
                  switch (httpEvent.type) {
                    case HttpEventType.Sent:
                      postUploadFileTaskId = this.sharedService.pushWaitTask({
                        description: `Subiendo archivos de solicitud de avances...`,
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
                      delete this.formatoSolicitudAvancesFiles[i].Bytes;
                      this.formatoSolicitudAvancesFiles[i].ServerPath =
                        httpEvent.body;

                      this.sharedService.removeWaitTask({
                        id: postUploadFileTaskId,
                      });
                      break;
                  }
                }),
                catchError((err) => {
                  this.sharedService.removeWaitTask({
                    id: postUploadFileTaskId,
                  });

                  return throwError(err);
                })
              )
              .toPromise();
          }

          for (let i = 0; this.cotizacionesFiles.length > i; i++) {
            let postUploadFileTaskId: string;
            await this.formsService
              .postUploadFile(
                this.cotizacionesFiles[i].Name,
                this.cotizacionesFiles[i].Bytes as ArrayBuffer
              )
              .pipe(
                map((httpEvent) => {
                  switch (httpEvent.type) {
                    case HttpEventType.Sent:
                      postUploadFileTaskId = this.sharedService.pushWaitTask({
                        description: `Subiendo archivos de cotizaciones...`,
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
                      delete this.cotizacionesFiles[i].Bytes;
                      this.cotizacionesFiles[i].ServerPath = httpEvent.body;

                      this.sharedService.removeWaitTask({
                        id: postUploadFileTaskId,
                      });
                      break;
                  }
                }),
                catchError((err) => {
                  this.sharedService.removeWaitTask({
                    id: postUploadFileTaskId,
                  });

                  return throwError(err);
                })
              )
              .toPromise();
          }

          for (let i = 0; this.solicitudesComisionFiles.length > i; i++) {
            let postUploadFileTaskId: string;
            await this.formsService
              .postUploadFile(
                this.solicitudesComisionFiles[i].Name,
                this.solicitudesComisionFiles[i].Bytes as ArrayBuffer
              )
              .pipe(
                map((httpEvent) => {
                  switch (httpEvent.type) {
                    case HttpEventType.Sent:
                      postUploadFileTaskId = this.sharedService.pushWaitTask({
                        description: `Subiendo archivos de solicitudes de comision...`,
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
                      delete this.solicitudesComisionFiles[i].Bytes;
                      this.solicitudesComisionFiles[i].ServerPath =
                        httpEvent.body;

                      this.sharedService.removeWaitTask({
                        id: postUploadFileTaskId,
                      });
                      break;
                  }
                }),
                catchError((err) => {
                  this.sharedService.removeWaitTask({
                    id: postUploadFileTaskId,
                  });

                  return throwError(err);
                })
              )
              .toPromise();
          }

          formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
            CamaraComercioFiles: this.camaraComercioFiles,
            FormatoSolicitudAvancesFiles: this.formatoSolicitudAvancesFiles,
            CotizacionesFiles: this.cotizacionesFiles,
            SolicitudesComisionFiles: this.solicitudesComisionFiles,
          });
          // Cleaning fields because information has been saved
          this.solicitudesComisionFiles = [];
          this.cotizacionesFiles = [];
          this.camaraComercioFiles = [];
          this.formatoSolicitudAvancesFiles = [];
          break;
        case 'Legalizacion':
          switch (this.tipoLegalizacion) {
            case 'Suministro y servicios':
              for (let i = 0; this.formatoLegalizacionFiles.length > i; i++) {
                let postUploadFileTaskId: string;
                await this.formsService
                  .postUploadFile(
                    this.formatoLegalizacionFiles[i].Name,
                    this.formatoLegalizacionFiles[i].Bytes as ArrayBuffer
                  )
                  .pipe(
                    map((httpEvent) => {
                      switch (httpEvent.type) {
                        case HttpEventType.Sent:
                          postUploadFileTaskId =
                            this.sharedService.pushWaitTask({
                              description: `Subiendo archivos de formato de legalizacion...`,
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
                          delete this.formatoLegalizacionFiles[i].Bytes;
                          this.formatoLegalizacionFiles[i].ServerPath =
                            httpEvent.body;

                          this.sharedService.removeWaitTask({
                            id: postUploadFileTaskId,
                          });
                          break;
                      }
                    }),
                    catchError((err) => {
                      this.sharedService.removeWaitTask({
                        id: postUploadFileTaskId,
                      });

                      return throwError(err);
                    })
                  )
                  .toPromise();
              }

              for (let i = 0; this.cuentaCobroFacturaFiles.length > i; i++) {
                let postUploadFileTaskId: string;
                await this.formsService
                  .postUploadFile(
                    this.cuentaCobroFacturaFiles[i].Name,
                    this.cuentaCobroFacturaFiles[i].Bytes as ArrayBuffer
                  )
                  .pipe(
                    map((httpEvent) => {
                      switch (httpEvent.type) {
                        case HttpEventType.Sent:
                          postUploadFileTaskId =
                            this.sharedService.pushWaitTask({
                              description: `Subiendo archivos de cuenta de cobro o factura...`,
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
                          delete this.cuentaCobroFacturaFiles[i].Bytes;
                          this.cuentaCobroFacturaFiles[i].ServerPath =
                            httpEvent.body;

                          this.sharedService.removeWaitTask({
                            id: postUploadFileTaskId,
                          });
                          break;
                      }
                    }),
                    catchError((err) => {
                      this.sharedService.removeWaitTask({
                        id: postUploadFileTaskId,
                      });

                      return throwError(err);
                    })
                  )
                  .toPromise();
              }

              for (let i = 0; this.soportesFacturasFiles.length > i; i++) {
                let postUploadFileTaskId: string;
                await this.formsService
                  .postUploadFile(
                    this.soportesFacturasFiles[i].Name,
                    this.soportesFacturasFiles[i].Bytes as ArrayBuffer
                  )
                  .pipe(
                    map((httpEvent) => {
                      switch (httpEvent.type) {
                        case HttpEventType.Sent:
                          postUploadFileTaskId =
                            this.sharedService.pushWaitTask({
                              description: `Subiendo archivos de soportes facturas...`,
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
                          delete this.soportesFacturasFiles[i].Bytes;
                          this.soportesFacturasFiles[i].ServerPath =
                            httpEvent.body;

                          this.sharedService.removeWaitTask({
                            id: postUploadFileTaskId,
                          });
                          break;
                      }
                    }),
                    catchError((err) => {
                      this.sharedService.removeWaitTask({
                        id: postUploadFileTaskId,
                      });

                      return throwError(err);
                    })
                  )
                  .toPromise();
              }

              for (
                let i = 0;
                this.seguridadSocialParafiscalesFiles.length > i;
                i++
              ) {
                let postUploadFileTaskId: string;
                await this.formsService
                  .postUploadFile(
                    this.seguridadSocialParafiscalesFiles[i].Name,
                    this.seguridadSocialParafiscalesFiles[i]
                      .Bytes as ArrayBuffer
                  )
                  .pipe(
                    map((httpEvent) => {
                      switch (httpEvent.type) {
                        case HttpEventType.Sent:
                          postUploadFileTaskId =
                            this.sharedService.pushWaitTask({
                              description: `Subiendo archivos de certificado de parafiscales...`,
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
                          delete this.seguridadSocialParafiscalesFiles[i].Bytes;
                          this.seguridadSocialParafiscalesFiles[i].ServerPath =
                            httpEvent.body;

                          this.sharedService.removeWaitTask({
                            id: postUploadFileTaskId,
                          });
                          break;
                      }
                    }),
                    catchError((err) => {
                      this.sharedService.removeWaitTask({
                        id: postUploadFileTaskId,
                      });

                      return throwError(err);
                    })
                  )
                  .toPromise();
              }

              formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
                FormatoLegalizacionFiles: this.formatoLegalizacionFiles,
                CuentaCobroFiles: this.cuentaCobroFacturaFiles,
                SoportesFacturasFiles: this.soportesFacturasFiles,
                CertificadoParafiscalesFiles:
                  this.seguridadSocialParafiscalesFiles,
              });
              // Cleaning fields because information has been saved
              this.formatoLegalizacionFiles = [];
              this.cuentaCobroFacturaFiles = [];
              this.soportesFacturasFiles = [];
              this.seguridadSocialParafiscalesFiles = [];
              break;
          }
          break;
      }
    }

    // Cleaning fields because information has been saved
    this.infoAdicional = '';
    this.convenio = '';
    this.tipoLegalizacion = '';
    this.tipoGestion = '';
    this.digitoVerificacion = '';
    this.invalidateFlowUser();
    this.identificator = '';
    this.tipoRelacion = '';
    this.tipoPersona = '';

    this.formIndex = 0;

    let postFormsFinancieraInvoiceFlowTaskId!: string;
    this.formsService
      .postFormsFinancieraInvoiceFlow(formsFinancieraInvoice)
      .subscribe(
        (httpEvent) => {
          switch (httpEvent.type) {
            case HttpEventType.Sent:
              postFormsFinancieraInvoiceFlowTaskId =
                this.sharedService.pushWaitTask({
                  description: `Enviando ${(formsFinancieraInvoice.TipoGestion ===
                  'Legalizacion'
                    ? `${formsFinancieraInvoice.TipoGestion} de tipo ${formsFinancieraInvoice.TipoLegalizacion}`
                    : formsFinancieraInvoice.TipoGestion
                  ).toLowerCase()}...`,
                  progress: 0,
                }) as string;
              break;
            case HttpEventType.UploadProgress:
              this.sharedService.pushWaitTask({
                id: postFormsFinancieraInvoiceFlowTaskId,
                progress: Math.round(
                  (httpEvent.loaded * 100) / httpEvent.total
                ),
              });
              break;
            case HttpEventType.Response:
              this.sharedService.pushToastMessage({
                id: Utils.makeRandomString(4),
                title: `${
                  formsFinancieraInvoice.TipoGestion === 'Legalizacion'
                    ? `${formsFinancieraInvoice.TipoGestion} de tipo ${formsFinancieraInvoice.TipoLegalizacion}`
                    : formsFinancieraInvoice.TipoGestion
                } enviada satisfactoriamente`,
                description: `Su ${(formsFinancieraInvoice.TipoGestion ===
                'Legalizacion'
                  ? `${formsFinancieraInvoice.TipoGestion} de tipo ${formsFinancieraInvoice.TipoLegalizacion}`
                  : formsFinancieraInvoice.TipoGestion
                ).toLowerCase()} ha sido ingresada correctamente y sera procesada en la mayor brevedad posible, este atento al correo electronico registrado por el cual se le notificara del estado y manera de validacion de la peticion.`,
                autohide: 30000,
              });
              break;
          }
        },
        (httpEventError) => {
          this.sharedService.removeWaitTask({
            id: postFormsFinancieraInvoiceFlowTaskId,
          });
        },
        () => {
          this.sharedService.removeWaitTask({
            id: postFormsFinancieraInvoiceFlowTaskId,
          });
        }
      );
  }

  isValid(formIndex: number = this.formIndex) {
    switch (formIndex) {
      case 0:
        return this.tipoPersona && this.tipoRelacion;
      case 1:
        return this.contratistaProveedorInformation;
      case 2:
        return this.tipoGestion;
      case 2.1:
        return this.tipoLegalizacion;
      case 3:
        if (this.convenio) {
          switch (this.tipoGestion) {
            case 'Cuenta de cobro':
              return (
                Utils.validateFiles(this.cuentaCobroFacturaFiles) &&
                Utils.validateFiles(this.facturaEquivalenteFiles) &&
                Utils.validateFiles(this.seguridadSocialParafiscalesFiles) &&
                Utils.validateFiles(this.informeActividadesFiles) &&
                (this.tipoRelacion === 'Contratista' &&
                this.tipoPersona === 'Juridica'
                  ? Utils.validateFiles(this.polizaAnticipoCumplimientoFiles)
                  : true)
              );
            case 'Anticipo':
              return Utils.validateFiles(this.formatoSolicitudAvancesFiles);
            case 'Dieta':
              return Utils.validateFiles(this.formatoSolicitudViajesFiles);
            case 'Legalizacion':
              switch (this.tipoLegalizacion) {
                case 'Desplazamiento':
                  return (
                    Utils.validateFiles(this.formatoLegalizacionViajesFiles) &&
                    Utils.validateFiles(this.soportesFacturasFiles) &&
                    Utils.validateFiles(this.pasabordosTiquetesAereosFiles) &&
                    Utils.validateFiles(this.informeActividades2Files)
                  );
                case 'Suministro y servicios':
                  return (
                    Utils.validateFiles(this.formatoLegalizacionFiles) &&
                    Utils.validateFiles(this.cuentaCobroFacturaFiles) &&
                    Utils.validateFiles(this.soportesFacturasFiles)
                  );
                default:
                  return false;
              }
            default:
              return false;
          }
        } else {
          return false;
        }
      default:
        return false;
    }
  }
}
