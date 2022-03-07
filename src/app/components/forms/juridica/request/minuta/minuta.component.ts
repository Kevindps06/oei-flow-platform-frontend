import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from 'src/app/classes/utils';
import { FormsService } from 'src/app/services/forms.service';
import { SharedService } from 'src/app/services/shared.service';
import { LoginService } from 'src/app/services/login.service';
import { FormsJuridicaRequest } from 'src/app/interfaces/forms-juridica-request';
import { saveAs } from 'file-saver';
import { Buffer } from 'buffer';

@Component({
  selector: 'app-forms-juridica-request-minuta',
  templateUrl: './minuta.component.html',
  styleUrls: ['./minuta.component.css'],
})
export class FormsJuridicaRequestMinutaComponent implements OnInit {
  JuridicaRequest!: string;
  formsJuridicaRequest!: FormsJuridicaRequest;

  field1: string = 'x';
  field2: string = 'x';
  field3: string = 'x';
  field4: string = 'x';
  field5: string = 'x';
  field6: string = 'x';
  field7: string = 'x';
  field8: string = 'x';
  field9: string = 'x';
  field10: string = 'x';
  field11: string = 'x';
  field12: string = 'x';
  field13: string = 'x';
  field14: string = 'x';
  field15: string = 'x';
  field16: string = 'x';
  field17: string = 'x';
  field18: string = 'x';
  field19: string = 'x';
  field20: string = 'x';
  field21: string = 'x';
  field22: string = 'x';
  field23: string = 'x';
  field24: string = 'x';
  field25: string = 'x';
  file?: Blob;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formsService: FormsService,
    private sharedService: SharedService,
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    if (!this.loginService.loggedInUser()) {
      this.router.navigate(['/login']);

      this.sharedService.pushToastMessage({
        id: Utils.makeRandomString(4),
        title: `Inautorizado`,
        description: `El contenido al que esta intentando ingresar es de uso restringido, autentifiquese y vuelva a intentar ingresar.`,
      });

      return;
    }

    this.JuridicaRequest = this.activatedRoute.snapshot.params.id;

    let getFormsJuridicaRequestMinutaAvailabilityTaskId: string;
    this.formsService
      .getFormsJuridicaRequestMinutaAvailability(this.JuridicaRequest)
      .subscribe(
        (httpEvent) => {
          switch (httpEvent.type) {
            case HttpEventType.Sent:
              getFormsJuridicaRequestMinutaAvailabilityTaskId =
                this.sharedService.pushWaitTask({
                  description: 'Verificando disponibilidad...',
                  progress: 0,
                }) as string;
              break;
            case HttpEventType.DownloadProgress:
              this.sharedService.pushWaitTask({
                id: getFormsJuridicaRequestMinutaAvailabilityTaskId,
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
                title: `Componente ya usado`,
                description: `Ya se ha utilizado el componente al que intenta ingresar para su respectiva tarea.`,
              });
              break;
          }

          this.sharedService.removeWaitTask({
            id: getFormsJuridicaRequestMinutaAvailabilityTaskId,
          });
        },
        () => {
          let getFormsJuridicaRequestMinutaVerifyEncargadoTaskId: string;
          this.formsService
            .getFormsJuridicaRequestMinutaVerifyEncargado(
              this.JuridicaRequest,
              this.loginService.loggedInUser()?.username as string
            )
            .subscribe(
              (httpEvent) => {
                switch (httpEvent.type) {
                  case HttpEventType.Sent:
                    getFormsJuridicaRequestMinutaVerifyEncargadoTaskId =
                      this.sharedService.pushWaitTask({
                        description: 'Verificando autorizacion...',
                        progress: 0,
                      }) as string;
                    break;
                  case HttpEventType.DownloadProgress:
                    this.sharedService.pushWaitTask({
                      id: getFormsJuridicaRequestMinutaVerifyEncargadoTaskId,
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
                    description: `Al contenido que esta intentando ingresar no se encuentra encargado usted, no intente ingresar.`,
                  });
                }

                this.sharedService.removeWaitTask({
                  id: getFormsJuridicaRequestMinutaVerifyEncargadoTaskId,
                });
              },
              () => {
                let getFormsJuridicaRequestTaskId: string;
                this.formsService
                  .getFormsJuridicaRequest(this.JuridicaRequest)
                  .subscribe(
                    (httpEvent) => {
                      switch (httpEvent.type) {
                        case HttpEventType.Sent:
                          getFormsJuridicaRequestTaskId =
                            this.sharedService.pushWaitTask({
                              description:
                                'Obteniendo informacion de la peticion...',
                              progress: 0,
                            }) as string;
                          break;
                        case HttpEventType.DownloadProgress:
                          this.sharedService.pushWaitTask({
                            id: getFormsJuridicaRequestTaskId,
                            progress: Math.round(
                              (httpEvent.loaded * 100) / httpEvent.total
                            ),
                          });
                          break;
                        case HttpEventType.Response:
                          this.formsJuridicaRequest = httpEvent.body[0];
                          break;
                      }
                    },
                    (httpEventError) => {
                      this.sharedService.removeWaitTask({
                        id: getFormsJuridicaRequestTaskId,
                      });
                    },
                    () => {
                      this.sharedService.removeWaitTask({
                        id: getFormsJuridicaRequestTaskId,
                      });
                    }
                  );

                this.sharedService.removeWaitTask({
                  id: getFormsJuridicaRequestMinutaVerifyEncargadoTaskId,
                });
              }
            );

          this.sharedService.removeWaitTask({
            id: getFormsJuridicaRequestMinutaAvailabilityTaskId,
          });
        }
      );
  }

  invalidatePreview() {
    this.file = undefined;
  }

  btnPreviewClick() {
    let formsJuridicaRequestMinutaGenerate = {
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
      field11: this.field11,
      field12: this.field12,
      field13: this.field13,
      field14: this.field14,
      field15: this.field15,
      field16: this.field16,
      field17: this.field17,
      field18: this.field18,
      field19: this.field19,
      field20: this.field20,
      field21: this.field21,
      field22: this.field22,
      field23: this.field23,
      field24: this.field24,
      field25: this.field25,
    };

    let postFormsJuridicaRequestMinutaGenerateTaskId!: string;
    this.formsService
      .postFormsJuridicaRequestMinutaGenerate(
        this.formsJuridicaRequest.TipoAdquisicion,
        this.formsJuridicaRequest.TipoPersona,
        formsJuridicaRequestMinutaGenerate
      )
      .subscribe(
        async (httpEvent) => {
          switch (httpEvent.type) {
            case HttpEventType.Sent:
              postFormsJuridicaRequestMinutaGenerateTaskId =
                this.sharedService.pushWaitTask({
                  description:
                    'Validando certificado de ingresos y retenciones...',
                  progress: 0,
                }) as string;
              break;
            case HttpEventType.DownloadProgress:
              this.sharedService.pushWaitTask({
                id: postFormsJuridicaRequestMinutaGenerateTaskId,
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
                `minuta preview ${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()} at ${currentDate.getHours()}.${currentDate.getMinutes()}.${currentDate.getSeconds()}.docx`
              );
              break;
          }
        },
        (httpEventError) => {
          this.sharedService.removeWaitTask({
            id: postFormsJuridicaRequestMinutaGenerateTaskId,
          });
        },
        () => {
          this.sharedService.removeWaitTask({
            id: postFormsJuridicaRequestMinutaGenerateTaskId,
          });
        }
      );
  }

  async btnSubmitClick() {
    let formsJuridicaRequestMinuta = {
      JuridicaRequest: this.JuridicaRequest,
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
      Field11: this.field11,
      Field12: this.field12,
      Field13: this.field13,
      Field14: this.field14,
      Field15: this.field15,
      Field16: this.field16,
      Field17: this.field17,
      Field18: this.field18,
      Field19: this.field19,
      Field20: this.field20,
      Field21: this.field21,
      Field22: this.field22,
      Field23: this.field23,
      Field24: this.field24,
      Field25: this.field25,
      File: Buffer.from(await this.file!.arrayBuffer()),
    };

    let postFormsJuridicaRequestMinutaTaskId: string;
    this.formsService
      .postFormsJuridicaRequestMinuta(formsJuridicaRequestMinuta)
      .subscribe(
        (httpEvent) => {
          switch (httpEvent.type) {
            case HttpEventType.Sent:
              postFormsJuridicaRequestMinutaTaskId =
                this.sharedService.pushWaitTask({
                  description: 'Enviando informacion de la peticion...',
                  progress: 0,
                }) as string;
              break;
            case HttpEventType.UploadProgress:
              this.sharedService.pushWaitTask({
                id: postFormsJuridicaRequestMinutaTaskId,
                progress: Math.round(
                  (httpEvent.loaded * 100) / httpEvent.total
                ),
              });
              break;
            case HttpEventType.Response:
              let putFormsJuridicaRequestTaskId: string;
              this.formsService
                .putFormsJuridicaRequest(this.JuridicaRequest, {
                  JuridicaRequestMinuta: httpEvent.body._id,
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
                      `minuta final ${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()} at ${currentDate.getHours()}.${currentDate.getMinutes()}.${currentDate.getSeconds()}.docx`
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
            id: postFormsJuridicaRequestMinutaTaskId,
          });
        },
        () => {
          this.sharedService.removeWaitTask({
            id: postFormsJuridicaRequestMinutaTaskId,
          });
        }
      );
  }

  isValidPreview() {
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
      this.field11 &&
      this.field12 &&
      this.field13 &&
      this.field14 &&
      this.field15 &&
      this.field16 &&
      this.field17 &&
      this.field18 &&
      this.field19 &&
      this.field20 &&
      this.field21 &&
      this.field22 &&
      this.field23 &&
      this.field24 &&
      this.field25
    );
  }

  isValid() {
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
      this.field11 &&
      this.field12 &&
      this.field13 &&
      this.field14 &&
      this.field15 &&
      this.field16 &&
      this.field17 &&
      this.field18 &&
      this.field19 &&
      this.field20 &&
      this.field21 &&
      this.field22 &&
      this.field23 &&
      this.field24 &&
      this.field25 &&
      this.file
    );
  }
}
