import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from 'src/app/classes/utils';
import { FormsService } from 'src/app/services/forms.service';
import { SharedService } from 'src/app/services/shared.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-forms-juridica-request-minuta',
  templateUrl: './minuta.component.html',
  styleUrls: ['./minuta.component.css'],
})
export class FormsJuridicaRequestMinutaComponent implements OnInit {
  Id!: string;

  minuta: string = '';

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

    this.Id = this.activatedRoute.snapshot.params.id;

    let getFormsJuridicaRequestMinutaAvailabilityTaskId: string;
    this.formsService
      .getFormsJuridicaRequestMinutaAvailability(this.Id)
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
            case HttpEventType.Response:
              let getFormsJuridicaRequestMinutaVerifyEncargadoTaskId: string;
              this.formsService
                .getFormsJuridicaRequestMinutaVerifyEncargado(
                  this.Id,
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
                    this.sharedService.removeWaitTask({
                      id: getFormsJuridicaRequestMinutaVerifyEncargadoTaskId,
                    });
                  }
                );
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
          this.sharedService.removeWaitTask({
            id: getFormsJuridicaRequestMinutaAvailabilityTaskId,
          });
        }
      );
  }

  btnSubmitClick() {
    let putFormsJuridicaRequestTaskId: string;
    this.formsService
      .putFormsJuridicaRequest(this.Id, {
        Minuta: this.minuta,
      })
      .subscribe(
        (httpEvent) => {
          switch (httpEvent.type) {
            case HttpEventType.Sent:
              putFormsJuridicaRequestTaskId = this.sharedService.pushWaitTask({
                description: 'Actualizando informacion de la peticion...',
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
            case HttpEventType.Response:
              this.router.navigate(['/']);

              this.sharedService.pushToastMessage({
                id: Utils.makeRandomString(4),
                title: `Informacion ingresada`,
                description: `Su respuesta ha sido correctamente ingresada, prosiga a responder el flujo.`,
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
          this.sharedService.removeWaitTask({
            id: putFormsJuridicaRequestTaskId,
          });
        }
      );
  }

  isValid() {
    return this.minuta;
  }
}
