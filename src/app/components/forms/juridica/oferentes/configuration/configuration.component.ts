import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from 'src/app/classes/utils';
import { IJuridica } from 'src/app/interfaces/forms-juridica';
import { FormsService } from 'src/app/services/forms.service';
import { LoginService } from 'src/app/services/login.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-forms-juridica-oferentes-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css'],
})
export class FormsJuridicaOferentesConfigurationComponent implements OnInit {
  juridicaId: string = '';
  juridica!: IJuridica;

  fechaInicio!: Date;

  setFechaInicio(fechaInicio: Date) {
    this.fechaInicio = fechaInicio;
  }

  horaInicio!: number;

  fechaFin!: Date;

  setFechaFin(fechaFin: Date) {
    this.fechaFin = fechaFin;
  }

  horaFin!: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private formsService: FormsService,
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
          let getFormsJuridicaOferentesConfigurationVerifyEncargadoTaskId: string;
          this.formsService
            .getFormJuridicaOferentesConfigurationVerifyEncargado(
              this.juridicaId,
              this.loginService.activeAccoount()?.username as string
            )
            .subscribe(
              (httpEvent) => {
                switch (httpEvent.type) {
                  case HttpEventType.Sent:
                    getFormsJuridicaOferentesConfigurationVerifyEncargadoTaskId =
                      this.sharedService.pushWaitTask({
                        description: 'Verificando autorizacion...',
                        progress: 0,
                      }) as string;
                    break;
                  case HttpEventType.DownloadProgress:
                    this.sharedService.pushWaitTask({
                      id: getFormsJuridicaOferentesConfigurationVerifyEncargadoTaskId,
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
                  id: getFormsJuridicaOferentesConfigurationVerifyEncargadoTaskId,
                });
              },
              () => {
                let getFormJuridicaOferentesGetFechasTaskId: string;
                this.formsService
                  .getFormJuridicaOferentesGetFechas(this.juridicaId)
                  .subscribe(
                    (httpEvent) => {
                      switch (httpEvent.type) {
                        case HttpEventType.Sent:
                          getFormJuridicaOferentesGetFechasTaskId =
                            this.sharedService.pushWaitTask({
                              description:
                                'Obteniendo informacion de la peticion...',
                              progress: 0,
                            }) as string;
                          break;
                        case HttpEventType.DownloadProgress:
                          this.sharedService.pushWaitTask({
                            id: getFormJuridicaOferentesGetFechasTaskId,
                            progress: Math.round(
                              (httpEvent.loaded * 100) / httpEvent.total
                            ),
                          });
                          break;
                        case HttpEventType.Response:
                          this.fechaInicio = new Date(
                            httpEvent.body.FechaInicio
                          );
                          this.horaInicio = this.fechaInicio.getHours();

                          this.fechaFin = new Date(httpEvent.body.FechaFin);
                          this.horaFin = this.fechaFin.getHours();
                          break;
                      }
                    },
                    (httpEventError) => {
                      this.sharedService.removeWaitTask({
                        id: getFormJuridicaOferentesGetFechasTaskId,
                      });
                    },
                    () => {
                      let getFormJuridicaTaskId: string;
                      this.formsService
                        .getFormJuridica(this.juridicaId)
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
                        id: getFormJuridicaOferentesGetFechasTaskId,
                      });
                    }
                  );

                this.sharedService.removeWaitTask({
                  id: getFormsJuridicaOferentesConfigurationVerifyEncargadoTaskId,
                });
              }
            );

          this.sharedService.removeWaitTask({
            id: getFormJuridicaOferentesAvailabilityTaskId,
          });
        }
      );
  }

  ifEndDateIsGreaterThatStartDate(): boolean {
    if (!this.fechaFin || !this.fechaInicio) return false;

    return (
      this.fechaFin.setHours(this.horaFin ?? 0) >
      this.fechaInicio.setHours(this.horaInicio ?? 0)
    );
  }

  ifEndDateEqualsStartDate(): boolean {
    if (!this.fechaInicio || !this.fechaFin) return false;

    let startDate = this.fechaInicio;

    startDate.setHours(0, 0, 0, 0);

    let endDate = this.fechaFin;

    endDate.setHours(0, 0, 0, 0);

    return startDate === endDate;
  }

  isStartDateHoursGreaterThat(hour: number): boolean {
    return hour >= this.horaInicio ?? 0;
  }

  save() {
    let putFormJuridicaOferentesSetFechasTaskId: string;
    this.formsService
      .putFormJuridicaOferentesSetFechas(
        this.juridicaId,
        this.fechaInicio,
        this.fechaFin
      )
      .subscribe(
        (httpEvent) => {
          switch (httpEvent.type) {
            case HttpEventType.Sent:
              putFormJuridicaOferentesSetFechasTaskId =
                this.sharedService.pushWaitTask({
                  description: 'Estableciendo fechas...',
                  progress: 0,
                }) as string;
              break;
            case HttpEventType.DownloadProgress:
              this.sharedService.pushWaitTask({
                id: putFormJuridicaOferentesSetFechasTaskId,
                progress: Math.round(
                  (httpEvent.loaded * 100) / httpEvent.total
                ),
              });
              break;
          }
        },
        (httpEventError) => {
          this.sharedService.removeWaitTask({
            id: putFormJuridicaOferentesSetFechasTaskId,
          });
        },
        () => {
          this.sharedService.pushToastMessage({
            id: Utils.makeRandomString(4),
            title: `Fechas establecidas`,
            description: `Las fechas han sido establecidas correctamente, el espacio de los oferentes funcionara de acuerdo a estas fechas.`,
          });

          this.sharedService.removeWaitTask({
            id: putFormJuridicaOferentesSetFechasTaskId,
          });
        }
      );
  }

  isValid() {
    return (
      this.fechaInicio &&
      this.horaInicio &&
      this.fechaFin &&
      this.horaFin &&
      this.fechaFin > this.fechaInicio
    );
  }
}
