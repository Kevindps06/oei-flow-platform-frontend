import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { Utils } from 'src/app/classes/utils';
import { FormsJuridica } from 'src/app/interfaces/forms-juridica';
import { FormsService } from 'src/app/services/forms.service';
import { LoginService } from 'src/app/services/login.service';
import { SharedService } from 'src/app/services/shared.service';
import { Buffer } from 'buffer';

@Component({
  selector: 'app-forms-juridica-pliegos',
  templateUrl: './pliegos.component.html',
  styleUrls: ['./pliegos.component.css'],
})
export class FormsJuridicaPliegosComponent implements OnInit {
  formJuridicaId: string = '';

  field1: string = '';
  field2: string = '';
  field3: string = '';
  field4: string = '';
  field5: string = '';
  field6: string = '';
  field7: string = '';
  field8: string = '';
  field9: string = '';
  field10: string = '';
  file?: Blob;

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

    let getFormJuridicaPliegosAvailabilityTaskId: string;
    this.formsService
      .getFormJuridicaPliegosAvailability(this.formJuridicaId)
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
              this.formJuridicaId,
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

  invalidatePreview() {
    this.file = undefined;
  }

  btnPreviewClick() {
    let formsJuridicaPliegosGenerate = {
      field1: this.field1,
      field2: this.field2,
      field3: this.field3,
      field4: this.field4,
      field5: this.field5,
      field6: this.field6,
      field7: this.field7,
      field8: this.field8,
      field9: this.field9,
      field10: this.field10,
    };

    let postFormsJuridicaPliegosGenerateTaskId!: string;
    this.formsService
      .postFormJuridicaPliegosGenerate(
        this.formJuridica.TipoAdquisicion,
        this.formJuridica.TipoPersona,
        formsJuridicaPliegosGenerate
      )
      .subscribe(
        async (httpEvent) => {
          switch (httpEvent.type) {
            case HttpEventType.Sent:
              postFormsJuridicaPliegosGenerateTaskId =
                this.sharedService.pushWaitTask({
                  description:
                    'Validando certificado de ingresos y retenciones...',
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
              this.file = httpEvent.body;
              const currentDate = new Date();
              saveAs(
                this.file!,
                `pliegos preview ${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()} at ${currentDate.getHours()}.${currentDate.getMinutes()}.${currentDate.getSeconds()}.docx`
              );
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
    const formsJuridicaPliegos = {
      Field1: this.field1,
      Field2: this.field2,
      Field3: this.field3,
      Field4: this.field4,
      Field5: this.field5,
      Field6: this.field6,
      Field7: this.field7,
      Field8: this.field8,
      Field9: this.field9,
      Field10: this.field10,
      File: Buffer.from(await this.file!.arrayBuffer()),
      FormJuridica: this.formJuridicaId,
    };

    let postFormsJuridicaPliegosTaskId: string;
    this.formsService.postFormJuridicaPliegos(formsJuridicaPliegos).subscribe(
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
              .putFormJuridica(this.formJuridicaId, {
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

                  const currentDate = new Date();
                  saveAs(
                    this.file!,
                    `pliegos final ${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()} at ${currentDate.getHours()}.${currentDate.getMinutes()}.${currentDate.getSeconds()}.docx`
                  );

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
    switch (this.formJuridica.TipoAdquisicion) {
      case 'Bienes':
        return (
          this.field1 &&
          this.field2 &&
          this.field3 &&
          this.field4 &&
          this.field5 &&
          this.field6 &&
          this.field7 &&
          this.field8 &&
          this.field9 &&
          this.field10
        );
      default:
        return false;
    }
  }

  isValid() {
    switch (this.formJuridica.TipoAdquisicion) {
      case 'Bienes':
        return (
          this.field1 &&
          this.field2 &&
          this.field3 &&
          this.field4 &&
          this.field5 &&
          this.field6 &&
          this.field7 &&
          this.field8 &&
          this.field9 &&
          this.field10 &&
          this.file
        );
      default:
        return false;
    }
  }
}
