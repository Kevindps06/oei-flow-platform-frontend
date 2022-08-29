import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from 'src/app/classes/utils';
import { IJuridica } from 'src/app/interfaces/forms-juridica';
import { FormsService } from 'src/app/services/forms.service';
import { LoginService } from 'src/app/services/login.service';
import { SharedService } from 'src/app/services/shared.service';
import { FileItem } from 'src/app/interfaces/FileItem';
import { IJuridicaPliegos } from 'src/app/interfaces/juridica-pliegos';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-forms-juridica-pliegos',
  templateUrl: './pliegos.component.html',
  styleUrls: ['./pliegos.component.css'],
})
export class FormsJuridicaPliegosComponent implements OnInit {
  juridicaId: string = '';
  juridica!: IJuridica;

  dia: string = '';
  numeroPliego: string = '';
  numeroConvenio: string = '';
  fechaConvenio: string = '';
  nombreEntidad: string = '';
  objetoContrato: string = '';
  objetoGeneral: string = '';
  tablaPerfiles: any[] = [];
  tablaPerfilesNombrePerfil: string = '';
  tablaPerfilesNumeroVacantes: string = '';
  tablaPerfilesRequisitosPerfil: string = '';
  tablaObjetosObligaciones: any[] = [];
  tablaObjetosObligacionesNombrePerfil: string = '';
  tablaObjetosObligacionesObjetoContratacion: string = '';
  tablaObjetosObligacionesObligaciones: string = '';

  pliegos: any;

  docxBlobPliegos!: Blob;
  pdfUint8ArrayPliegos?: Uint8Array;
  pdfBlobPliegos!: Blob;

  files: FileItem[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private formsService: FormsService,
    private sharedService: SharedService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.loginService.activeAccoount()) {
      this.router.navigate(['/login']);

      this.sharedService.pushToastMessage({
        id: Utils.makeRandomString(4),
        title: `Inautorizado`,
        description: `El contenido al que esta intentando ingresar es de uso restringido, autentifiquese y vuelva a intentar ingresar.`,
      });

      return;
    }

    this.juridicaId = this.activatedRoute.snapshot.params.id;

    let getFormJuridicaPliegosAvailabilityTaskId: string;
    this.formsService
      .getFormJuridicaPliegosAvailability(this.juridicaId)
      .subscribe(
        (httpEvent) => {
          switch (httpEvent.type) {
            case HttpEventType.Sent:
              getFormJuridicaPliegosAvailabilityTaskId =
                this.sharedService.pushWaitTask({
                  description: 'Verificando disponibilidad...',
                  progress: 0,
                }) as string;
              break;
            case HttpEventType.DownloadProgress:
              this.sharedService.pushWaitTask({
                id: getFormJuridicaPliegosAvailabilityTaskId,
                progress: Math.round(
                  (httpEvent.loaded * 100) / httpEvent.total
                ),
              });
              break;
          }
        },
        (httpEventError) => {
          this.router.navigate(['/']);

          switch (httpEventError.status) {
            case 406:
              this.sharedService.pushToastMessage({
                id: Utils.makeRandomString(4),
                title: `Contenido no disponible`,
                description: `El contenido al que esta intentando ingresar no se encuentra disponible, intentelo despues.`,
              });
              break;
            case 423:
              this.sharedService.pushToastMessage({
                id: Utils.makeRandomString(4),
                title: `Componente ya utilizado`,
                description: `Ya se ha utilizado el componente al que intenta ingresar para su respectiva tarea.`,
              });
              break;
          }

          this.sharedService.removeWaitTask({
            id: getFormJuridicaPliegosAvailabilityTaskId,
          });
        },
        () => {
          let getFormsJuridicaPliegosVerifyEncargadoTaskId: string;
          this.formsService
            .getFormJuridicaPliegosVerifyEncargado(
              this.juridicaId,
              this.loginService.activeAccoount()?.username as string
            )
            .subscribe(
              (httpEvent) => {
                switch (httpEvent.type) {
                  case HttpEventType.Sent:
                    getFormsJuridicaPliegosVerifyEncargadoTaskId =
                      this.sharedService.pushWaitTask({
                        description: 'Verificando autorizacion...',
                        progress: 0,
                      }) as string;
                    break;
                  case HttpEventType.DownloadProgress:
                    this.sharedService.pushWaitTask({
                      id: getFormsJuridicaPliegosVerifyEncargadoTaskId,
                      progress: Math.round(
                        (httpEvent.loaded * 100) / httpEvent.total
                      ),
                    });
                    break;
                }
              },
              (httpEventError) => {
                if (httpEventError.status === 403) {
                  this.router.navigate(['/']);

                  this.sharedService.pushToastMessage({
                    id: Utils.makeRandomString(4),
                    title: `Inautorizado`,
                    description: `Usted no cuenta con autorizacion para el contenido que esta intentando ingresar, no intente ingresar.`,
                  });
                }

                this.sharedService.removeWaitTask({
                  id: getFormsJuridicaPliegosVerifyEncargadoTaskId,
                });
              },
              () => {
                let getFormJuridicaTaskId: string;
                this.formsService.getFormJuridica(this.juridicaId).subscribe(
                  (httpEvent) => {
                    switch (httpEvent.type) {
                      case HttpEventType.Sent:
                        getFormJuridicaTaskId = this.sharedService.pushWaitTask(
                          {
                            description:
                              'Obteniendo informacion de la peticion...',
                            progress: 0,
                          }
                        ) as string;
                        break;
                      case HttpEventType.DownloadProgress:
                        this.sharedService.pushWaitTask({
                          id: getFormJuridicaTaskId,
                          progress: Math.round(
                            (httpEvent.loaded * 100) / httpEvent.total
                          ),
                        });
                        break;
                      case HttpEventType.Response:
                        this.juridica = httpEvent.body[0];
                        break;
                    }
                  },
                  (httpEventError) => {
                    this.sharedService.removeWaitTask({
                      id: getFormJuridicaTaskId,
                    });
                  },
                  () => {
                    this.sharedService.removeWaitTask({
                      id: getFormJuridicaTaskId,
                    });
                  }
                );

                this.sharedService.removeWaitTask({
                  id: getFormsJuridicaPliegosVerifyEncargadoTaskId,
                });
              }
            );

          this.sharedService.removeWaitTask({
            id: getFormJuridicaPliegosAvailabilityTaskId,
          });
        }
      );
  }

  removePerfil(numeroPerfil: string) {
    this.tablaPerfiles.splice(
      this.tablaPerfiles.findIndex(
        (tablaPerfil) => tablaPerfil.numeroPerfil == numeroPerfil
      ),
      1
    );

    for (let i = 0; this.tablaPerfiles.length > i; i++) {
      this.tablaPerfiles[i].numeroPerfil = i + 1;
    }
  }

  addPerfil() {
    this.tablaPerfiles.push({
      numeroPerfil: this.tablaPerfiles.length + 1,
      nombrePerfil: this.tablaPerfilesNombrePerfil,
      numeroVacantes: this.tablaPerfilesNumeroVacantes,
      requisitosPerfil: this.tablaPerfilesRequisitosPerfil,
    });
  }

  removeObjetoObligacion(numeroObjetoObligacion: string) {
    this.tablaObjetosObligaciones.splice(
      this.tablaObjetosObligaciones.findIndex(
        (tablaObjetoObligacion) =>
          tablaObjetoObligacion.numeroObjetoObligacion == numeroObjetoObligacion
      ),
      1
    );

    for (let i = 0; this.tablaObjetosObligaciones.length > i; i++) {
      this.tablaObjetosObligaciones[i].numeroObjetoObligacion = i + 1;
    }
  }

  addObjetoObligacion() {
    this.tablaObjetosObligaciones.push({
      numeroObjetoObligacion: this.tablaObjetosObligaciones.length + 1,
      nombrePerfil: this.tablaObjetosObligacionesNombrePerfil,
      objetoContratacion: this.tablaObjetosObligacionesObjetoContratacion,
      obligaciones: this.tablaObjetosObligacionesObligaciones,
    });
  }

  invalidatePreview() {
    this.pdfUint8ArrayPliegos = undefined;
    this.files = [];
  }

  btnPreviewClick() {
    switch (this.juridica.TipoPersona) {
      case 'Natural':
        this.pliegos = {
          dia: this.dia,
          numeroPliego: this.numeroPliego,
          numeroConvenio: this.numeroConvenio,
          fechaConvenio: this.fechaConvenio,
          nombreEntidad: this.nombreEntidad,
          objetoContrato: this.objetoContrato,
          objetoGeneral: this.objetoGeneral,
        };
        break;
      case 'Juridica':
        this.pliegos = {
          dia: this.dia,
          numeroPliego: this.numeroPliego,
          numeroConvenio: this.numeroConvenio,
          fechaConvenio: this.fechaConvenio,
          nombreEntidad: this.nombreEntidad,
          objetoContrato: this.objetoContrato,
          objetoGeneral: this.objetoGeneral,
        };
        break;
    }

    this.pliegos = Object.assign(this.pliegos, {
      perfiles: this.tablaPerfiles,
      objetosObligaciones: this.tablaObjetosObligaciones,
    });

    this.files = [];

    let postFormsJuridicaPliegosGenerateTaskId!: string;
    this.formsService
      .postFormJuridicaPliegosGenerate(this.juridica.TipoPersona, this.pliegos)
      .subscribe(
        async (httpEvent) => {
          switch (httpEvent.type) {
            case HttpEventType.Sent:
              postFormsJuridicaPliegosGenerateTaskId =
                this.sharedService.pushWaitTask({
                  description: 'Generando pre visualizacion...',
                  progress: 0,
                }) as string;
              break;
            case HttpEventType.DownloadProgress:
              this.sharedService.pushWaitTask({
                id: postFormsJuridicaPliegosGenerateTaskId,
                progress: Math.round(
                  (httpEvent.loaded * 100) / httpEvent.total
                ),
              });
              break;
            case HttpEventType.Response:
              this.docxBlobPliegos = new Blob([
                new Uint8Array(httpEvent.body.docxBuf.data),
              ]);

              this.pdfUint8ArrayPliegos = new Uint8Array(
                httpEvent.body.pdfBuf.data
              );

              this.pdfBlobPliegos = new Blob([this.pdfUint8ArrayPliegos]);

              this.files.push({
                Index: 0,
                Name: `pliegos.docx`,
                Size: this.docxBlobPliegos.size,
                Type: this.docxBlobPliegos.type,
                Bytes: await this.docxBlobPliegos.arrayBuffer(),
                Uploaded: true,
              });

              this.files.push({
                Index: 1,
                Name: `pliegos.pdf`,
                Size: this.pdfBlobPliegos.size,
                Type: this.pdfBlobPliegos.type,
                Bytes: await this.pdfBlobPliegos.arrayBuffer(),
                Uploaded: true,
              });
              break;
          }
        },
        (httpEventError) => {
          this.sharedService.removeWaitTask({
            id: postFormsJuridicaPliegosGenerateTaskId,
          });
        },
        () => {
          this.sharedService.removeWaitTask({
            id: postFormsJuridicaPliegosGenerateTaskId,
          });
        }
      );
  }

  async btnSubmitClick() {
    let juridicaPliegos!: IJuridicaPliegos;

    switch (this.juridica.TipoPersona) {
      case 'Natural':
        juridicaPliegos = {
          Dia: this.dia,
          NumeroPliego: this.numeroPliego,
          NumeroConvenio: this.numeroConvenio,
          FechaConvenio: this.fechaConvenio,
          NombreEntidad: this.nombreEntidad,
          ObjetoContrato: this.objetoContrato,
          ObjetoGeneral: this.objetoGeneral,
          TablaPerfiles: this.tablaPerfiles,
          TablaObjetosObligaciones: this.tablaObjetosObligaciones,
        };
        break;
      case 'Juridica':
        juridicaPliegos = {};
        break;
    }

    // Pliegos
    for (let i = 0; this.files.length > i; i++) {
      let postUploadFileTaskId: string;
      await this.formsService
        .postUploadFile(this.files[i].Name, this.files[i].Bytes as ArrayBuffer)
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
                delete this.files[i].Bytes;
                this.files[i].ServerPath = httpEvent.body;

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

    juridicaPliegos = Object.assign(juridicaPliegos, {
      Pliegos: this.pliegos,
      Juridica: this.juridicaId,
      PliegosFiles: this.files,
    });

    let postFormsJuridicaPliegosTaskId: string;
    this.formsService.postFormJuridicaPliegos(juridicaPliegos).subscribe(
      (httpEvent) => {
        switch (httpEvent.type) {
          case HttpEventType.Sent:
            postFormsJuridicaPliegosTaskId = this.sharedService.pushWaitTask({
              description: 'Enviando informacion de la peticion...',
              progress: 0,
            }) as string;
            break;
          case HttpEventType.UploadProgress:
            this.sharedService.pushWaitTask({
              id: postFormsJuridicaPliegosTaskId,
              progress: Math.round((httpEvent.loaded * 100) / httpEvent.total),
            });
            break;
          case HttpEventType.Response:
            let putFormsJuridicaRequestTaskId: string;
            this.formsService
              .putFormJuridica(this.juridicaId, {
                JuridicaPliegos: httpEvent.body._id,
              })
              .subscribe(
                (httpEvent) => {
                  switch (httpEvent.type) {
                    case HttpEventType.Sent:
                      putFormsJuridicaRequestTaskId =
                        this.sharedService.pushWaitTask({
                          description:
                            'Actualizando informacion de la peticion...',
                          progress: 0,
                        }) as string;
                      break;
                    case HttpEventType.UploadProgress:
                      this.sharedService.pushWaitTask({
                        id: putFormsJuridicaRequestTaskId,
                        progress: Math.round(
                          (httpEvent.loaded * 100) / httpEvent.total
                        ),
                      });
                      break;
                  }
                },
                (httpEventError) => {
                  this.sharedService.removeWaitTask({
                    id: putFormsJuridicaRequestTaskId,
                  });
                },
                () => {
                  this.sharedService.pushToastMessage({
                    id: Utils.makeRandomString(4),
                    title: `Informacion ingresada`,
                    description: `Su respuesta ha sido correctamente ingresada, carge el archivo generado en su repositorio asignado y proceda a responder el flujo.`,
                    autohide: 15000,
                  });

                  this.router.navigate(['/']);

                  this.sharedService.removeWaitTask({
                    id: putFormsJuridicaRequestTaskId,
                  });
                }
              );
            break;
        }
      },
      (httpEventError) => {
        this.sharedService.removeWaitTask({
          id: postFormsJuridicaPliegosTaskId,
        });
      },
      () => {
        this.sharedService.removeWaitTask({
          id: postFormsJuridicaPliegosTaskId,
        });
      }
    );
  }

  isValidPreview() {
    switch (this.juridica.TipoPersona) {
      case 'Natural':
        return (
          this.dia &&
          this.numeroConvenio &&
          this.fechaConvenio &&
          this.nombreEntidad &&
          this.objetoContrato &&
          this.objetoGeneral &&
          this.tablaPerfiles.length > 0 &&
          this.tablaObjetosObligaciones.length > 0
        );
      case 'Juridica':
        return false;
      default:
        return false;
    }
  }

  isValidPerfil() {
    switch (this.juridica.TipoPersona) {
      case 'Natural':
        return (
          this.tablaPerfilesNombrePerfil &&
          this.tablaPerfilesNumeroVacantes &&
          this.tablaPerfilesRequisitosPerfil
        );
      case 'Juridica':
        return false;
      default:
        return false;
    }
  }

  isValidObjetoObligacion() {
    switch (this.juridica.TipoPersona) {
      case 'Natural':
        return (
          this.tablaObjetosObligacionesNombrePerfil &&
          this.tablaObjetosObligacionesObjetoContratacion &&
          this.tablaObjetosObligacionesObligaciones
        );
      case 'Juridica':
        return false;
      default:
        return false;
    }
  }

  isValid() {
    return this.isValidPreview() && this.files.length !== 0;
  }
}
