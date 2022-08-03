import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Utils } from 'src/app/classes/utils';
import { FileItem } from 'src/app/interfaces/FileItem';
import { IJuridica } from 'src/app/interfaces/forms-juridica';
import { IJuridicaOferente } from 'src/app/interfaces/juridica-oferente';
import { FormsService } from 'src/app/services/forms.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-forms-juridica-oferentes',
  templateUrl: './oferentes.component.html',
  styleUrls: ['./oferentes.component.css'],
})
export class FormsJuridicaOferentesComponent implements OnInit {
  formIndex: number = 0;

  juridicaId: string = '';

  juridica!: IJuridica;

  email: string = '';

  codigoVerificacion: string = '';

  codigoVerificacionRequested: boolean = false;
  verificacionCodigoVerificacionError: boolean = false;

  documentosTecnicosFiles: FileItem[] = [];

  setDocumentosTecnicosFiles(documentosTecnicosFiles: FileItem[]) {
    this.documentosTecnicosFiles = documentosTecnicosFiles;
  }

  documentosFinancierosFiles: FileItem[] = [];

  setDocumentosFinancierosFiles(documentosFinancierosFiles: FileItem[]) {
    this.documentosFinancierosFiles = documentosFinancierosFiles;
  }

  documentosJuridicosFiles: FileItem[] = [];

  setDocumentosJuridicosFiles(documentosJuridicosFiles: FileItem[]) {
    this.documentosJuridicosFiles = documentosJuridicosFiles;
  }

  propuestaEconomicaFiles: FileItem[] = [];

  setPropuestaEconomicaFiles(propuestaEconomicaFiles: FileItem[]) {
    this.propuestaEconomicaFiles = propuestaEconomicaFiles;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private formsService: FormsService,
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.juridicaId = this.activatedRoute.snapshot.params.id;

    let getFormJuridicaOferentesAvailabilityTaskId: string;
    this.formsService
      .getFormJuridicaOferentesAvailability(this.juridicaId)
      .subscribe(
        (httpEvent) => {
          switch (httpEvent.type) {
            case HttpEventType.Sent:
              getFormJuridicaOferentesAvailabilityTaskId =
                this.sharedService.pushWaitTask({
                  description: 'Verificando disponibilidad...',
                  progress: 0,
                }) as string;
              break;
            case HttpEventType.DownloadProgress:
              this.sharedService.pushWaitTask({
                id: getFormJuridicaOferentesAvailabilityTaskId,
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
                title: `Convocatoria finalizada`,
                description: `Ya se ha finalizado la convocatoria a la que intenta ingresar.`,
              });
              break;
          }

          this.sharedService.removeWaitTask({
            id: getFormJuridicaOferentesAvailabilityTaskId,
          });
        },
        () => {
          this.sharedService.removeWaitTask({
            id: getFormJuridicaOferentesAvailabilityTaskId,
          });
        }
      );
  }

  validateEmail(email: string | undefined): boolean {
    if (!email) return false;

    return Utils.validateEmail(email);
  }

  async btnSubmitClick() {
    let juridicaOferente: IJuridicaOferente = {
      Email: this.email,
      Juridica: this.juridicaId,
    };

    // Documentos Tecnicos
    for (let i = 0; this.documentosTecnicosFiles.length > i; i++) {
      let postUploadFileTaskId: string;
      await this.formsService
        .postUploadFile(
          this.documentosTecnicosFiles[i].Name,
          this.documentosTecnicosFiles[i].Bytes as ArrayBuffer
        )
        .pipe(
          map((httpEvent) => {
            switch (httpEvent.type) {
              case HttpEventType.Sent:
                postUploadFileTaskId = this.sharedService.pushWaitTask({
                  description: `Subiendo documentos tecnicos...`,
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
                delete this.documentosTecnicosFiles[i].Bytes;
                this.documentosTecnicosFiles[i].ServerPath = httpEvent.body;

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

    // Documentos Financieros
    for (let i = 0; this.documentosFinancierosFiles.length > i; i++) {
      let postUploadFileTaskId: string;
      await this.formsService
        .postUploadFile(
          this.documentosFinancierosFiles[i].Name,
          this.documentosFinancierosFiles[i].Bytes as ArrayBuffer
        )
        .pipe(
          map((httpEvent) => {
            switch (httpEvent.type) {
              case HttpEventType.Sent:
                postUploadFileTaskId = this.sharedService.pushWaitTask({
                  description: `Subiendo documentos financieros...`,
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
                delete this.documentosFinancierosFiles[i].Bytes;
                this.documentosFinancierosFiles[i].ServerPath = httpEvent.body;

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

    // Documentos Juridicos
    for (let i = 0; this.documentosJuridicosFiles.length > i; i++) {
      let postUploadFileTaskId: string;
      await this.formsService
        .postUploadFile(
          this.documentosJuridicosFiles[i].Name,
          this.documentosJuridicosFiles[i].Bytes as ArrayBuffer
        )
        .pipe(
          map((httpEvent) => {
            switch (httpEvent.type) {
              case HttpEventType.Sent:
                postUploadFileTaskId = this.sharedService.pushWaitTask({
                  description: `Subiendo documentos juridicos...`,
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
                delete this.documentosJuridicosFiles[i].Bytes;
                this.documentosJuridicosFiles[i].ServerPath = httpEvent.body;

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

    // Propuesta Economica
    for (let i = 0; this.propuestaEconomicaFiles.length > i; i++) {
      let postUploadFileTaskId: string;
      await this.formsService
        .postUploadFile(
          this.propuestaEconomicaFiles[i].Name,
          this.propuestaEconomicaFiles[i].Bytes as ArrayBuffer
        )
        .pipe(
          map((httpEvent) => {
            switch (httpEvent.type) {
              case HttpEventType.Sent:
                postUploadFileTaskId = this.sharedService.pushWaitTask({
                  description: `Subiendo propuesta economica...`,
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
                delete this.propuestaEconomicaFiles[i].Bytes;
                this.propuestaEconomicaFiles[i].ServerPath = httpEvent.body;

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

    juridicaOferente = Object.assign(juridicaOferente, {
      DocumentosTecnicosFiles: this.documentosTecnicosFiles,
      DocumentosFinancierosFiles: this.documentosFinancierosFiles,
      DocumentosJuridicosFiles: this.documentosJuridicosFiles,
      PropuestaEconomicaFiles: this.propuestaEconomicaFiles,
    });

    let postJuridicaOferenteTaskId: string;
    this.formsService.postFormJuridicaOferentes(juridicaOferente).subscribe(
      (event) => {
        switch (event.type) {
          case HttpEventType.Sent:
            postJuridicaOferenteTaskId = this.sharedService.pushWaitTask({
              description: `Enviando postulacion...`,
              progress: 0,
            }) as string;
            break;
          case HttpEventType.UploadProgress:
            this.sharedService.pushWaitTask({
              id: postJuridicaOferenteTaskId,
              progress: Math.round((event.loaded * 100) / event.total),
            });
            break;
        }
      },
      (httpEventError) => {
        this.sharedService.removeWaitTask({
          id: postJuridicaOferenteTaskId,
        });
      },
      () => {
        let getFormJuridicaPostuladosSendNotificationTaskId: string;
        this.formsService
          .getFormJuridicaOferentesSendNotification(this.email)
          .subscribe(
            (httpEvent) => {
              switch (httpEvent.type) {
                case HttpEventType.Sent:
                  getFormJuridicaPostuladosSendNotificationTaskId =
                    this.sharedService.pushWaitTask({
                      description: 'Finalizando...',
                      progress: 0,
                    }) as string;
                  break;
                case HttpEventType.DownloadProgress:
                  this.sharedService.pushWaitTask({
                    id: getFormJuridicaPostuladosSendNotificationTaskId,
                    progress: Math.round(
                      (httpEvent.loaded * 100) / httpEvent.total
                    ),
                  });
                  break;
              }
            },
            (httpEventError) => {
              this.router.navigate(['/']);

              this.sharedService.removeWaitTask({
                id: getFormJuridicaPostuladosSendNotificationTaskId,
              });
            },
            () => {
              this.sharedService.pushToastMessage({
                id: Utils.makeRandomString(4),
                title: `Informacion ingresada`,
                description: `Su postulacion ha sido correctamente ingresada.`,
                autohide: 15000,
              });

              this.router.navigate(['/']);

              this.sharedService.removeWaitTask({
                id: getFormJuridicaPostuladosSendNotificationTaskId,
              });
            }
          );

        this.sharedService.removeWaitTask({
          id: postJuridicaOferenteTaskId,
        });
      }
    );

    /*const juridicaPostulados = {
      Postulados: this.postulados,
      FormJuridica: this.formJuridicaId,
    };

    let postFormsJuridicaPostuladosTaskId: string;
    this.formsService.postFormJuridicaPostulados(juridicaPostulados).subscribe(
      (httpEventPostulados) => {
        switch (httpEventPostulados.type) {
          case HttpEventType.Sent:
            postFormsJuridicaPostuladosTaskId = this.sharedService.pushWaitTask(
              {
                description: 'Enviando informacion de la peticion...',
                progress: 0,
              }
            ) as string;
            break;
          case HttpEventType.UploadProgress:
            this.sharedService.pushWaitTask({
              id: postFormsJuridicaPostuladosTaskId,
              progress: Math.round(
                (httpEventPostulados.loaded * 100) / httpEventPostulados.total
              ),
            });
            break;
          case HttpEventType.Response:
            let putFormsJuridicaTaskId: string;
            this.formsService
              .putFormJuridica(this.formJuridicaId, {
                JuridicaPostulados: httpEventPostulados.body._id,
              })
              .subscribe(
                (httpEvent) => {
                  switch (httpEvent.type) {
                    case HttpEventType.Sent:
                      putFormsJuridicaTaskId = this.sharedService.pushWaitTask({
                        description:
                          'Actualizando informacion de la peticion...',
                        progress: 0,
                      }) as string;
                      break;
                    case HttpEventType.UploadProgress:
                      this.sharedService.pushWaitTask({
                        id: putFormsJuridicaTaskId,
                        progress: Math.round(
                          (httpEvent.loaded * 100) / httpEvent.total
                        ),
                      });
                      break;
                    case HttpEventType.Response:
                      let putFormsJuridicaPostuladosSendRequestTaskId: string;
                      this.formsService
                        .getFormJuridicaPostuladosSendRequests(
                          httpEventPostulados.body._id
                        )
                        .subscribe(
                          (httpEvent) => {
                            switch (httpEvent.type) {
                              case HttpEventType.Sent:
                                putFormsJuridicaPostuladosSendRequestTaskId =
                                  this.sharedService.pushWaitTask({
                                    description:
                                      'Enviando informacion de la peticion...',
                                    progress: 0,
                                  }) as string;
                                break;
                              case HttpEventType.UploadProgress:
                                this.sharedService.pushWaitTask({
                                  id: putFormsJuridicaPostuladosSendRequestTaskId,
                                  progress: Math.round(
                                    (httpEvent.loaded * 100) / httpEvent.total
                                  ),
                                });
                                break;
                            }
                          },
                          (httpEventError) => {
                            this.sharedService.removeWaitTask({
                              id: putFormsJuridicaPostuladosSendRequestTaskId,
                            });
                          },
                          () => {
                            this.sharedService.pushToastMessage({
                              id: Utils.makeRandomString(4),
                              title: `Informacion ingresada`,
                              description: `Su respuesta ha sido correctamente ingresada, enviadas las peticiones de subida de documentos, puede proceder a responder el flujo.`,
                              autohide: 15000,
                            });

                            this.router.navigate(['/']);

                            this.sharedService.removeWaitTask({
                              id: putFormsJuridicaPostuladosSendRequestTaskId,
                            });
                          }
                        );
                      break;
                  }
                },
                (httpEventError) => {
                  this.sharedService.removeWaitTask({
                    id: putFormsJuridicaTaskId,
                  });
                },
                () => {
                  this.sharedService.removeWaitTask({
                    id: putFormsJuridicaTaskId,
                  });
                }
              );
            break;
        }
      },
      (httpEventError) => {
        this.sharedService.removeWaitTask({
          id: postFormsJuridicaPostuladosTaskId,
        });
      },
      () => {
        this.sharedService.removeWaitTask({
          id: postFormsJuridicaPostuladosTaskId,
        });
      }
    );*/
  }

  currentAvailableAction: string = 'Solicitar codigo';

  invalidateCodigoVerificacion() {
    this.verificacionCodigoVerificacionError = false;
  }

  formJuridicaEulaId!: string;

  solicitarVerificarCodigo() {
    let requestTimeout: NodeJS.Timeout;

    if (this.currentAvailableAction === 'Solicitar codigo') {
      let getFormsJuridicaEulaRequestVerificationCodeTaskId: string;
      this.formsService
        .getFormJuridicaOferentesVerificationRequestCode(
          this.juridicaId,
          this.email
        )
        .subscribe(
          (httpEvent) => {
            switch (httpEvent.type) {
              case HttpEventType.Sent:
                getFormsJuridicaEulaRequestVerificationCodeTaskId =
                  this.sharedService.pushWaitTask({
                    description:
                      'Realizando peticion del codigo de verificacion...',
                    progress: 0,
                  }) as string;
                break;
              case HttpEventType.UploadProgress:
                this.sharedService.pushWaitTask({
                  id: getFormsJuridicaEulaRequestVerificationCodeTaskId,
                  progress: Math.round(
                    (httpEvent.loaded * 100) / httpEvent.total
                  ),
                });
                break;
              case HttpEventType.Response:
                this.formJuridicaEulaId = httpEvent.body;
                break;
            }
          },
          (httpEventError) => {
            this.sharedService.removeWaitTask({
              id: getFormsJuridicaEulaRequestVerificationCodeTaskId,
            });
          },
          () => {
            this.currentAvailableAction = 'Verificar codigo';

            this.codigoVerificacionRequested = true;

            requestTimeout = setTimeout(() => {
              if (this.formIndex === 0) {
                this.verificacionCodigoVerificacionError = false;

                this.currentAvailableAction = 'Solicitar codigo';

                this.codigoVerificacionRequested = false;

                this.codigoVerificacion = '';

                this.sharedService.pushToastMessage({
                  id: Utils.makeRandomString(4),
                  title: `Tiempo limite de codigo alcanzado`,
                  description: `Se ha alcanzado el tiempo de espera maximo para la solicitud del codigo de verificacion, solicite uno nuevo, y vuelva a intentarlo.`,
                });
              }
            }, 300000);

            this.sharedService.pushToastMessage({
              id: Utils.makeRandomString(4),
              title: `Codigo de verificacion solicitado`,
              description: `Se ha realizado la solicitud del codigo de verificacion satisfactoriamente, y en unos momentos le llegara.`,
            });

            this.sharedService.removeWaitTask({
              id: getFormsJuridicaEulaRequestVerificationCodeTaskId,
            });
          }
        );
    } else {
      let getFormsJuridicaEulaVerifyVerificationCodeTaskId: string;
      this.formsService
        .getFormJuridicaOferentesVerificationVerifyCode(
          this.formJuridicaEulaId,
          this.codigoVerificacion,
          'kevindps@jjk.com.co'
        )
        .subscribe(
          (httpEvent) => {
            switch (httpEvent.type) {
              case HttpEventType.Sent:
                getFormsJuridicaEulaVerifyVerificationCodeTaskId =
                  this.sharedService.pushWaitTask({
                    description: 'Verificando el codigo de autentificacion...',
                    progress: 0,
                  }) as string;
                break;
              case HttpEventType.DownloadProgress:
                this.sharedService.pushWaitTask({
                  id: getFormsJuridicaEulaVerifyVerificationCodeTaskId,
                  progress: Math.round(
                    (httpEvent.loaded * 100) / httpEvent.total
                  ),
                });
                break;
            }
          },
          (httpEventError) => {
            switch (httpEventError.status) {
              case 403:
                clearTimeout(requestTimeout);

                this.verificacionCodigoVerificacionError = true;

                this.currentAvailableAction = 'Solicitar codigo';

                this.codigoVerificacionRequested = false;

                this.codigoVerificacion = '';

                this.sharedService.pushToastMessage({
                  id: Utils.makeRandomString(4),
                  title: `Codigo ya utilizado`,
                  description: `El codigo que ha ingresado ya ha sido utilizado con anterioridad, solicite uno nuevo, y vuelva a intentarlo.`,
                });
                break;
              case 404:
                this.verificacionCodigoVerificacionError = true;

                this.codigoVerificacion = '';

                this.sharedService.pushToastMessage({
                  id: Utils.makeRandomString(4),
                  title: `Codigo incorrecto`,
                  description: `El codigo ingresado es incorrecto, vuelva a intentarlo.`,
                });
                break;
              case 408:
                clearTimeout(requestTimeout);

                this.verificacionCodigoVerificacionError = true;

                this.currentAvailableAction = 'Solicitar codigo';

                this.codigoVerificacionRequested = false;

                this.codigoVerificacion = '';

                this.sharedService.pushToastMessage({
                  id: Utils.makeRandomString(4),
                  title: `Codigo expirado`,
                  description: `El codigo ingresado ha expirado, vuelva a intentarlo.`,
                });
                break;
            }

            this.sharedService.removeWaitTask({
              id: getFormsJuridicaEulaVerifyVerificationCodeTaskId,
            });
          },
          () => {
            let getFormsJuridicaTaskId: string;
            this.formsService.getFormJuridica(this.juridicaId).subscribe(
              (httpEvent) => {
                switch (httpEvent.type) {
                  case HttpEventType.Sent:
                    getFormsJuridicaTaskId = this.sharedService.pushWaitTask({
                      description: 'Obteniendo informacion de la peticion...',
                      progress: 0,
                    }) as string;
                    break;
                  case HttpEventType.DownloadProgress:
                    this.sharedService.pushWaitTask({
                      id: getFormsJuridicaTaskId,
                      progress: Math.round(
                        (httpEvent.loaded * 100) / httpEvent.total
                      ),
                    });
                    break;
                  case HttpEventType.Response:
                    if (httpEvent.body.length > 0) {
                      clearTimeout(requestTimeout);

                      this.juridica = httpEvent.body[0];

                      this.formIndex++;
                    }
                    break;
                }
              },
              (httpEventError) => {
                this.sharedService.removeWaitTask({
                  id: getFormsJuridicaTaskId,
                });
              },
              () => {
                this.sharedService.removeWaitTask({
                  id: getFormsJuridicaTaskId,
                });
              }
            );

            this.sharedService.pushToastMessage({
              id: Utils.makeRandomString(4),
              title: `Autentificacion correcta`,
              description: `Se ha completado la autentificacion en 2 pasos satisfactoriamente.`,
            });

            this.sharedService.removeWaitTask({
              id: getFormsJuridicaEulaVerifyVerificationCodeTaskId,
            });
          }
        );
    }
  }

  isValid(): boolean {
    return true;
  }
}
