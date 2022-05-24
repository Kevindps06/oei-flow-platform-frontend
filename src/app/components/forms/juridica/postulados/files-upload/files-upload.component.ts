import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from 'src/app/classes/utils';
import { FormsJuridica } from 'src/app/interfaces/forms-juridica';
import { FormsService } from 'src/app/services/forms.service';
import { LoginService } from 'src/app/services/login.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-forms-juridica-postulados-files-upload',
  templateUrl: './files-upload.component.html',
  styleUrls: ['./files-upload.component.css'],
})
export class FormsJuridicaPostuladosFilesUploadComponent implements OnInit {
  formIndex: number = 0;

  formJuridicaId: string = '';

  formJuridica!: FormsJuridica;

  codigoVerificacion: string = '';

  codigoVerificacionRequested: boolean = false;
  verificacionCodigoVerificacionError: boolean = false;

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
                title: `Componente ya utilizado`,
                description: `Ya se ha utilizado el componente al que intenta ingresar para su respectiva tarea.`,
              });
              break;
          }

          this.sharedService.removeWaitTask({
            id: getFormJuridicaPostuladosAvailabilityTaskId,
          });
        },
        () => {
          let getFormsJuridicaPostuladosVerifyEncargadoTaskId: string;
          this.formsService
            .getFormJuridicaPostuladosVerifyEncargado(
              this.formJuridicaId,
              this.loginService.activeAccoount()?.username as string
            )
            .subscribe(
              (httpEvent) => {
                switch (httpEvent.type) {
                  case HttpEventType.Sent:
                    getFormsJuridicaPostuladosVerifyEncargadoTaskId =
                      this.sharedService.pushWaitTask({
                        description: 'Verificando autorizacion...',
                        progress: 0,
                      }) as string;
                    break;
                  case HttpEventType.DownloadProgress:
                    this.sharedService.pushWaitTask({
                      id: getFormsJuridicaPostuladosVerifyEncargadoTaskId,
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
                  id: getFormsJuridicaPostuladosVerifyEncargadoTaskId,
                });
              },
              () => {
                let getFormJuridicaTaskId: string;
                this.formsService
                  .getFormJuridica(this.formJuridicaId)
                  .subscribe(
                    (httpEvent) => {
                      switch (httpEvent.type) {
                        case HttpEventType.Sent:
                          getFormJuridicaTaskId =
                            this.sharedService.pushWaitTask({
                              description:
                                'Obteniendo informacion de la peticion...',
                              progress: 0,
                            }) as string;
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
                          this.formJuridica = httpEvent.body[0];
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
                  id: getFormsJuridicaPostuladosVerifyEncargadoTaskId,
                });
              }
            );

          this.sharedService.removeWaitTask({
            id: getFormJuridicaPostuladosAvailabilityTaskId,
          });
        }
      );
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
        .getFormJuridicaEulaVerificationRequestCode(this.formJuridicaId)
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
        .getFormJuridicaEulaVerificationVerifyCode(
          this.formJuridicaEulaId,
          this.codigoVerificacion
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
}
