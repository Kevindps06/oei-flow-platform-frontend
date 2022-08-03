import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Utils } from 'src/app/classes/utils';
import { Convenio } from 'src/app/interfaces/Convenio';
import { FileItem } from 'src/app/interfaces/FileItem';
import { ICompras } from 'src/app/interfaces/forms-compras';
import { FormsService } from 'src/app/services/forms.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-forms-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css'],
})
export class ComprasComponent implements OnInit {
  tipoProceso: string = 'compras';

  convenios: Convenio[] = [];

  convenioResponsable: string = '';
  numeroSolicitud: string = '';
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

  documentosFiles: FileItem[] = [];

  setDocumentosFiles(documentosFiles: FileItem[]) {
    this.documentosFiles = documentosFiles;
  }

  artesFiles: FileItem[] = [];

  setArtesFiles(artesFiles: FileItem[]) {
    this.artesFiles = artesFiles;
  }

  solicitudAdquisicionFiles: FileItem[] = [];

  setSolicitudAdquisicionFiles(solicitudAdquisicionFiles: FileItem[]) {
    this.solicitudAdquisicionFiles = solicitudAdquisicionFiles;
  }

  informacionAdicional: string = '';

  constructor(
    private formsService: FormsService,
    private sharedService: SharedService,
    private router: Router
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

  async btnSubmitClick() {
    document.getElementById('firstElement')?.scrollIntoView({
      behavior: 'smooth',
    });

    let formCompras: ICompras = {
      Id: Utils.makeRandomString(32),
      TipoProceso: 'Compras',
      ConvenioResponsable: this.convenioResponsable,
      NumeroContrato: this.numeroSolicitud
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

    // Documentos
    for (let i = 0; this.documentosFiles.length > i; i++) {
      let postUploadFileTaskId: string;
      await this.formsService
        .postUploadFile(
          this.documentosFiles[i].Name,
          this.documentosFiles[i].Bytes as ArrayBuffer
        )
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
                delete this.documentosFiles[i].Bytes;
                this.documentosFiles[i].ServerPath = httpEvent.body;

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

    // Artes
    for (let i = 0; this.artesFiles.length > i; i++) {
      let postUploadFileTaskId: string;
      await this.formsService
        .postUploadFile(
          this.artesFiles[i].Name,
          this.artesFiles[i].Bytes as ArrayBuffer
        )
        .pipe(
          map((httpEvent) => {
            switch (httpEvent.type) {
              case HttpEventType.Sent:
                postUploadFileTaskId = this.sharedService.pushWaitTask({
                  description: `Subiendo archivos artes...`,
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
                delete this.artesFiles[i].Bytes;
                this.artesFiles[i].ServerPath = httpEvent.body;

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

    // Solicitud de adquisicion
    for (let i = 0; this.solicitudAdquisicionFiles.length > i; i++) {
      let postUploadFileTaskId: string;
      await this.formsService
        .postUploadFile(
          this.solicitudAdquisicionFiles[i].Name,
          this.solicitudAdquisicionFiles[i].Bytes as ArrayBuffer
        )
        .pipe(
          map((httpEvent) => {
            switch (httpEvent.type) {
              case HttpEventType.Sent:
                postUploadFileTaskId = this.sharedService.pushWaitTask({
                  description: `Subiendo archivos solicitud de adquisicion...`,
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
                delete this.solicitudAdquisicionFiles[i].Bytes;
                this.solicitudAdquisicionFiles[i].ServerPath = httpEvent.body;

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

    formCompras = Object.assign(formCompras, {
      documentosFiles: this.documentosFiles,
      artesFiles: this.artesFiles,
      solicitudAdquisicionFiles: this.artesFiles,
    });

    // Cleaning fields because information has been saved
    this.documentosFiles = [];
    this.artesFiles = [];
    this.solicitudAdquisicionFiles = [];

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
    this.numeroSolicitud = '';
    this.convenioResponsable = '';

    let postFormsJuridicaRequestFlowTaskId: string;
    this.formsService.postFormComprasFlow(formCompras).subscribe(
      (event) => {
        switch (event.type) {
          case HttpEventType.Sent:
            postFormsJuridicaRequestFlowTaskId =
              this.sharedService.pushWaitTask({
                description: `Enviando peticion de compra...`,
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
              title: `Peticion compra enviada satisfactoriamente`,
              description: `Su peticion de compra ha sido ingresada correctamente y sera procesada en la mayor brevedad posible, este atento al correo electronico registrado por el cual se le notificara del estado y manera de validacion de la peticion.`,
              autohide: 30000,
            });

            this.router.navigate(['/login']);
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

  numberWithPriceSpaces(number: number | undefined): string {
    if (!number || number === NaN) return 'NaN';

    return Utils.numberWithPriceSpaces(number);
  }

  parseInt(string: string) {
    return parseInt(string.replace(/ /g, ''));
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

  isValid() {
    return (
      this.convenioResponsable &&
      this.numeroSolicitud &&
      this.isValidNumeroSolicitud &&
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
}
