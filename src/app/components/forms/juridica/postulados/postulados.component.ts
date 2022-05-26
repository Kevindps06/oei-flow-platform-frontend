import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from 'src/app/classes/utils';
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
  formJuridicaId: string = '';

  postulados: { index: number; email?: string }[] = [{ index: 0 }];

  formJuridica!: FormsJuridica;

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

  setPostulado(postuladoIndex: number, postulado: any) {
    setTimeout(() => {
      this.postulados[postuladoIndex].email = postulado.originalTarget.value;
    }, 100);
  }

  validateEmail(email: string | undefined): boolean {
    if (!email) return false;

    return Utils.validateEmail(email);
  }

  allPostulados(): boolean {
    for (let postulado of this.postulados) {
      if (
        !postulado ||
        !postulado.email ||
        !Utils.validateEmail(postulado.email)
      ) {
        return false;
      }
    }

    return true;
  }

  btnAddPostuladoClick() {
    this.postulados.push({ index: this.postulados.length });
  }

  btnRemovePostuladoClick(index: number) {
    this.postulados.splice(index, 1);
  }

  btnSubmitClick() {
    const juridicaPostulados = {
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
    );
  }
}
