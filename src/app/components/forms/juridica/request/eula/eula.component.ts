import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from 'src/app/classes/utils';
import { FormsJuridicaRequest } from 'src/app/interfaces/forms-juridica-request';
import { FormsService } from 'src/app/services/forms.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-forms-juridica-request-eula',
  templateUrl: './eula.component.html',
  styleUrls: ['./eula.component.css'],
})
export class FormsJuridicaRequestEulaComponent implements OnInit {
  formIndex: number = 0;

  Id: string = '';
  formsJuridicaRequest!: FormsJuridicaRequest;

  codigoVerificacion: string = '';

  codigoVerificacionRequested: boolean = false;
  verificacionCodigoVerificacionError: boolean = false;

  constructor(
    private formsService: FormsService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let taskId: string;

    this.Id = this.activatedRoute.snapshot.params.id;

    this.formsService
      .getFormsJuridicaRequestEulaAvailability(this.Id)
      .subscribe(
        (event) => {
          switch (event.type) {
            case HttpEventType.Sent:
              taskId = this.sharedService.pushWaitTask({
                description: 'Verificando disponibilidad...',
                progress: 0,
              }) as string;
              break;
            case HttpEventType.DownloadProgress:
              this.sharedService.pushWaitTask({
                id: taskId,
                progress: Math.round((event.loaded * 100) / event.total),
              });
              break;
          }
        },
        (err) => {
          this.router.navigate(['/']);

          switch (err.status) {
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
        }
      );
  }

  currentAvailableAction: string = 'Solicitar codigo';

  invalidateCodigoVerificacion() {
    this.verificacionCodigoVerificacionError = false;
  }

  formsJuridicaRequestEulaId!: string;

  solicitarVerificarCodigo() {
    let taskId: string;
    let requestTimeout: NodeJS.Timeout;

    if (this.currentAvailableAction === 'Solicitar codigo') {
      this.formsService
        .getFormsJuridicaRequestEulaRequestVerificationCode(this.Id)
        .subscribe(
          (httpEvent) => {
            switch (httpEvent.type) {
              case HttpEventType.Sent:
                taskId = this.sharedService.pushWaitTask({
                  description:
                    'Realizando peticion del codigo de verificacion...',
                  progress: 0,
                }) as string;
                break;
              case HttpEventType.UploadProgress:
                this.sharedService.pushWaitTask({
                  id: taskId,
                  progress: Math.round(
                    (httpEvent.loaded * 100) / httpEvent.total
                  ),
                });
                break;
            }
          },
          (httpEventError) => {},
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
                  title: `Tiempo limite de peticion alcanzado`,
                  description: `Se ha alcanzado el tiempo de espera maximo para la solicitud del codigo de verificacion, solicite uno nuevo, y vuelva a intentarlo.`,
                });
              }
            }, 300000);

            this.sharedService.pushToastMessage({
              id: Utils.makeRandomString(4),
              title: `Codigo de verificacion solicitado`,
              description: `Se ha realizado la solicitud del codigo de verificacion satisfactoriamente, y en unos momentos le llegara.`,
            });
          }
        );
    } else {
      this.formsService
        .getFormsJuridicaRequestEulaVerifyVerificationCode(
          this.Id,
          this.codigoVerificacion
        )
        .subscribe(
          (event) => {
            switch (event.type) {
              case HttpEventType.Sent:
                taskId = this.sharedService.pushWaitTask({
                  description: 'Verificando el codigo de verificacion...',
                  progress: 0,
                }) as string;
                break;
              case HttpEventType.DownloadProgress:
                this.sharedService.pushWaitTask({
                  id: taskId,
                  progress: Math.round((event.loaded * 100) / event.total),
                });
                break;
              case HttpEventType.Response:
                console.log(event.body);
                this.formsJuridicaRequestEulaId = event.body;
                break;
            }
          },
          (err) => {
            switch (err.status) {
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
          },
          () => {
            this.formsService
              .getFormsJuridicaRequest(this.Id)
              .subscribe((event) => {
                switch (event.type) {
                  case HttpEventType.Sent:
                    taskId = this.sharedService.pushWaitTask({
                      description: 'Obteniendo informacion de la peticion...',
                      progress: 0,
                    }) as string;
                    break;
                  case HttpEventType.DownloadProgress:
                    this.sharedService.pushWaitTask({
                      id: taskId,
                      progress: Math.round((event.loaded * 100) / event.total),
                    });
                    break;
                  case HttpEventType.Response:
                    if (event.body.length > 0) {
                      clearTimeout(requestTimeout);

                      this.formsJuridicaRequest = event.body[0];

                      this.formIndex++;
                    }
                    break;
                }
              });

            this.sharedService.pushToastMessage({
              id: Utils.makeRandomString(4),
              title: `Verificacion pasada correctamente`,
              description: `Se ha completado la verificacion en 2 pasos satisfactoriamente.`,
            });
          }
        );
    }
  }

  btnSubmitClick() {
    let taskId: string;

    this.formsService
      .putFormsJuridicaRequest(this.Id, {
        Eula: this.formsJuridicaRequestEulaId,
      })
      .subscribe((event) => {
        switch (event.type) {
          case HttpEventType.Sent:
            taskId = this.sharedService.pushWaitTask({
              description: 'Actualizando informacion de la peticion...',
              progress: 0,
            }) as string;
            break;
          case HttpEventType.UploadProgress:
            this.sharedService.pushWaitTask({
              id: taskId,
              progress: Math.round((event.loaded * 100) / event.total),
            });
            break;
          case HttpEventType.Response:
            this.router.navigate(['/']);

            this.sharedService.pushToastMessage({
              id: Utils.makeRandomString(4),
              title: `Condiciones aceptadas`,
              description: `Su respuesta ha sido correctamente ingresada.`,
            });
            break;
        }
      });
  }

  isValid() {
    switch (this.formIndex) {
      case 0:
        return this.formsJuridicaRequest;
      case 1:
        return true;
      default:
        return false;
    }
  }
}
