import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from 'src/app/classes/utils';
import { FormsService } from 'src/app/services/forms.service';
import { SharedService } from 'src/app/services/shared.service';
import { LoginService } from 'src/app/services/login.service';
import { FormsJuridica } from 'src/app/interfaces/forms-juridica';
import { saveAs } from 'file-saver';
import { Buffer } from 'buffer';

@Component({
  selector: 'app-forms-juridica-minuta',
  templateUrl: './minuta.component.html',
  styleUrls: ['./minuta.component.css'],
})
export class FormsJuridicaMinutaComponent implements OnInit {
  formJuridicaId!: string;

  // Bienes
  tipoInmueble: string = '';
  nombreArrendador: string = '';
  numeroNit: string = '';
  nombreRepresentanteLegal: string = '';
  ciudadDondeReside: string = '';
  numeroCedula: string = '';
  ciudadExpedicion: string = '';
  detalleInmueble: string = '';
  ubicacionInmueble: string = '';
  barrio: string = '';
  ciudadInmueble: string = '';
  inmueble: string = '';
  mesesContrato: string = '';
  diaInicio: string = '';
  mesInicio: string = '';
  anoInicio: string = '';
  diaFin: string = '';
  mesFin: string = '';
  anoFin: string = '';
  valorContrato: string = '';
  valorCanonMensual: string = '';
  // field1
  // field2
  // field3
  // field4

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
  field11: string = '';
  field12: string = '';
  field13: string = '';
  field14: string = '';
  field15: string = '';
  field16: string = '';
  field17: string = '';
  field18: string = '';
  field19: string = '';
  field20: string = '';
  field21: string = '';
  field22: string = '';
  field23: string = '';
  field24: string = '';
  field25: string = '';
  file?: Blob;
  formJuridica!: FormsJuridica;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formsService: FormsService,
    private sharedService: SharedService,
    private router: Router,
    private loginService: LoginService
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

    let getFormJuridicaMinutaAvailabilityTaskId: string;
    this.formsService
      .getFormJuridicaMinutaAvailability(this.formJuridicaId)
      .subscribe(
        (httpEvent) => {
          switch (httpEvent.type) {
            case HttpEventType.Sent:
              getFormJuridicaMinutaAvailabilityTaskId =
                this.sharedService.pushWaitTask({
                  description: 'Verificando disponibilidad...',
                  progress: 0,
                }) as string;
              break;
            case HttpEventType.DownloadProgress:
              this.sharedService.pushWaitTask({
                id: getFormJuridicaMinutaAvailabilityTaskId,
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
            id: getFormJuridicaMinutaAvailabilityTaskId,
          });
        },
        () => {
          let getFormsJuridicaMinutaVerifyEncargadoTaskId: string;
          this.formsService
            .getFormJuridicaMinutaVerifyEncargado(
              this.formJuridicaId,
              this.loginService.activeAccoount()?.username as string
            )
            .subscribe(
              (httpEvent) => {
                switch (httpEvent.type) {
                  case HttpEventType.Sent:
                    getFormsJuridicaMinutaVerifyEncargadoTaskId =
                      this.sharedService.pushWaitTask({
                        description: 'Verificando autorizacion...',
                        progress: 0,
                      }) as string;
                    break;
                  case HttpEventType.DownloadProgress:
                    this.sharedService.pushWaitTask({
                      id: getFormsJuridicaMinutaVerifyEncargadoTaskId,
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
                  id: getFormsJuridicaMinutaVerifyEncargadoTaskId,
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
                  id: getFormsJuridicaMinutaVerifyEncargadoTaskId,
                });
              }
            );

          this.sharedService.removeWaitTask({
            id: getFormJuridicaMinutaAvailabilityTaskId,
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
      .postFormJuridicaMinutaGenerate(
        this.formJuridica.TipoAdquisicion,
        this.formJuridica.TipoPersona,
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
    const formsJuridicaRequestMinuta = {
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
      FormJuridica: this.formJuridicaId,
    };

    let postFormsJuridicaRequestMinutaTaskId: string;
    this.formsService
      .postFormJuridicaMinuta(formsJuridicaRequestMinuta)
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
                .putFormJuridica(this.formJuridicaId, {
                  JuridicaMinuta: httpEvent.body._id,
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
