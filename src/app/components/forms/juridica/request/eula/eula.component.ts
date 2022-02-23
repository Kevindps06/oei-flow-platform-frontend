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
    const taskId: string = Utils.makeRandomString(4);

    this.Id = this.activatedRoute.snapshot.params.id;

    this.formsService.getFormsJuridicaRequestEulaFillStatus(this.Id).subscribe(
      (event) => {
        switch (event.type) {
          case HttpEventType.Sent:
            this.sharedService.pushWaitTask({
              id: taskId,
              description: 'Verificando disponibilidad...',
              progress: 0,
            });
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

        this.sharedService.removeWaitTask({
          id: taskId,
        });

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
      },
      () => {}
    );
  }

  currentAvailableAction: string = 'Solicitar codigo';

  invalidateCodigoVerificacion() {
    this.verificacionCodigoVerificacionError = false;
  }

  solicitarVerificarCodigo() {
    const taskId: string = Utils.makeRandomString(4);
    let requestTimeout: NodeJS.Timeout;

    if (this.currentAvailableAction === 'Solicitar codigo') {
      this.formsService
        .postFormsJuridicaRequestEulaRequestVerificationCode(this.Id)
        .subscribe(
          (event) => {
            switch (event.type) {
              case HttpEventType.Sent:
                this.sharedService.pushWaitTask({
                  id: taskId,
                  description:
                    'Realizando peticion del codigo de verificacion...',
                  progress: 0,
                });
                break;
              case HttpEventType.UploadProgress:
                this.sharedService.pushWaitTask({
                  id: taskId,
                  progress: Math.round((event.loaded * 100) / event.total),
                });
                break;
            }
          },
          (err) => {
            console.log(err);

            this.sharedService.removeWaitTask({
              id: taskId,
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
                  title: `Tiempo limite de peticion alcanzado`,
                  description: `Se ha alcanzado el tiempo de espera maximo para la solicitud del codigo de verificacion, solicite uno nuevo, y vuelva a intentarlo.`,
                });
              }
            }, 300000);

            this.sharedService.removeWaitTask({
              id: taskId,
            });

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
                this.sharedService.pushWaitTask({
                  id: taskId,
                  description: 'Verificando el codigo de verificacion...',
                  progress: 0,
                });
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
            this.sharedService.removeWaitTask({
              id: taskId,
            });

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
                    this.sharedService.pushWaitTask({
                      id: taskId,
                      description: 'Obteniendo informacion de la peticion...',
                      progress: 0,
                    });
                    break;
                  case HttpEventType.DownloadProgress:
                    this.sharedService.pushWaitTask({
                      id: taskId,
                      progress: Math.round((event.loaded * 100) / event.total),
                    });
                    break;
                  case HttpEventType.Response:
                    this.sharedService.removeWaitTask({
                      id: taskId,
                    });

                    if (event.body.length > 0) {
                      clearTimeout(requestTimeout);

                      this.formsJuridicaRequest = event.body[0];

                      this.formIndex++;
                    }
                    break;
                }
              });

            this.sharedService.removeWaitTask({
              id: taskId,
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

  btnSubmitClick() {}

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
