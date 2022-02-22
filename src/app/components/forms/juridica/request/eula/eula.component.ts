import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  Id: string = '';
  formsJuridicaRequest!: FormsJuridicaRequest;

  codigoVerificacion: string = '';

  codigoVerificacionRequested: boolean = false;
  validacionCodigoVerificacionError: boolean = false;

  constructor(
    private formsService: FormsService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    const taskId: string = Utils.makeRandomString(4);

    this.Id = this.activatedRoute.snapshot.params.id;

    /*this.formsService.getFormsJuridicaRequest(this.Id).subscribe((event) => {
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
            this.formsJuridicaRequest = event.body[0];
          }
          break;
      }
    });*/
  }

  currentAvailableAction: string = 'Solicitar codigo';

  invalidateCodigoVerificacion() {}

  solicitarVerificarCodigo() {
    const taskId: string = Utils.makeRandomString(4);

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
            this.sharedService.removeWaitTask({
              id: taskId,
            });
          },
          () => {
            this.sharedService.removeWaitTask({
              id: taskId,
            });

            this.sharedService.pushToastMessage({
              id: Utils.makeRandomString(4),
              title: `Codigo de verificacion solicitado`,
              description: `Se ha realizado la solicitud del codigo de verificacion satisfactoriamente, y en unos momentos le llegara a su correo electronico.`,
              autohide: 30000,
            });

            this.codigoVerificacionRequested = true;
          }
        );

      this.currentAvailableAction = 'Verificar codigo';
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
              case 404:
                this.sharedService.pushToastMessage({
                  id: Utils.makeRandomString(4),
                  title: `Not found`,
                  description: ``,
                });
                break;
              case 408:
                this.sharedService.pushToastMessage({
                  id: Utils.makeRandomString(4),
                  title: `Timeout`,
                  description: ``,
                });
                break;
            }
          },
          () => {
            this.sharedService.removeWaitTask({
              id: taskId,
            });

            this.sharedService.pushToastMessage({
              id: Utils.makeRandomString(4),
              title: `Correcto`,
              description: ``,
            });

            this.codigoVerificacionRequested = false;
          }
        );
    }
  }
}
