import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from 'src/app/classes/utils';
import { FileItem } from 'src/app/interfaces/FileItem';
import { FormsJuridica } from 'src/app/interfaces/forms-juridica';
import { FormsService } from 'src/app/services/forms.service';
import { LoginService } from 'src/app/services/login.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-forms-juridica-postulados',
  templateUrl: './postulados.component.html',
  styleUrls: ['./postulados.component.css'],
})
export class FormsJuridicaPostuladosComponent implements OnInit {
  formIndex: number = 0;

  formJuridicaId: string = '';

  formJuridica!: FormsJuridica;

  email: string = '';

  codigoVerificacion: string = '';

  codigoVerificacionRequested: boolean = false;
  verificacionCodigoVerificacionError: boolean = false;

  documentosFiles: FileItem[] = [];

  setDocumentosFiles(documentosFiles: FileItem[]) {
    this.documentosFiles = documentosFiles;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private formsService: FormsService,
    private sharedService: SharedService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formJuridicaId = this.activatedRoute.snapshot.params.id;

    let getFormJuridicaPostuladosAvailabilityTaskId: string;
    this.formsService
      .getFormJuridicaPostuladosAvailability(this.formJuridicaId)
      .subscribe(
        (httpEvent) => {
          switch (httpEvent.type) {
            case HttpEventType.Sent:
              getFormJuridicaPostuladosAvailabilityTaskId =
                this.sharedService.pushWaitTask({
                  description: 'Verificando disponibilidad...',
                  progress: 0,
                }) as string;
              break;
            case HttpEventType.DownloadProgress:
              this.sharedService.pushWaitTask({
                id: getFormJuridicaPostuladosAvailabilityTaskId,
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
            id: getFormJuridicaPostuladosAvailabilityTaskId,
          });
        },
        () => {
          this.sharedService.removeWaitTask({
            id: getFormJuridicaPostuladosAvailabilityTaskId,
          });
        }
      );
  }

  validateEmail(email: string | undefined): boolean {
    if (!email) return false;

    return Utils.validateEmail(email);
  }

  btnSubmitClick() {
    let getFormJuridicaPostuladosSendNotificationTaskId: string;
    this.formsService
      .getFormJuridicaPostuladosSendNotification('kevindps@jjk.com.co')
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
        .getFormJuridicaPostuladosFilesUploadVerificationRequestCode(
          this.formJuridicaId,
          'kevindps@jjk.com.co'
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
        .getFormJuridicaPostuladosFilesUploadVerificationVerifyCode(
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
            this.formsService.getFormJuridica(this.formJuridicaId).subscribe(
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

                      this.formJuridica = httpEvent.body[0];

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
