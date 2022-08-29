import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from 'src/app/classes/utils';
import { IJuridica } from 'src/app/interfaces/forms-juridica';
import { FormsService } from 'src/app/services/forms.service';
import { LoginService } from 'src/app/services/login.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-convocatoria',
  templateUrl: './convocatoria.component.html',
  styleUrls: ['./convocatoria.component.css'],
})
export class FormsJuridicaConvocatoriaComponent implements OnInit {
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
    private loginService: LoginService,
    private router: Router,
    private sharedService: SharedService,
    private formsService: FormsService,
    private activatedRoute: ActivatedRoute
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
}
