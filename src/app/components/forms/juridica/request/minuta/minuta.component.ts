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

    let taskId: string;

    this.Id = this.activatedRoute.snapshot.params.id;

    this.formsService
      .getFormsJuridicaRequestMinutaAvailability(this.Id)
      .subscribe(
        (httpEvent) => {
          switch (httpEvent.type) {
            case HttpEventType.Sent:
              taskId = this.sharedService.pushWaitTask({
                description: 'Verificando disponibilidad...',
                progress: 0,
              }) as string;
              console.log(taskId);
              break;
            case HttpEventType.DownloadProgress:
              this.sharedService.pushWaitTask({
                id: taskId,
                progress: Math.round(
                  (httpEvent.loaded * 100) / httpEvent.total
                ),
              });
              break;
            case HttpEventType.Response:
              this.formsService
                .getFormsJuridicaRequestMinutaVerifyEncargado(
                  this.Id,
                  this.loginService.loggedInUser()?.username as string
                )
                .subscribe(
                  (httpEvent) => {
                    switch (httpEvent.type) {
                      case HttpEventType.Sent:
                        taskId = this.sharedService.pushWaitTask({
                          description: 'Verificando autorizacion...',
                          progress: 0,
                        }) as string;
                        console.log(taskId);
                        break;
                      case HttpEventType.DownloadProgress:
                        this.sharedService.pushWaitTask({
                          id: taskId,
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
        }
      );
  }

  btnSubmitClick() {
    this.formsService
      .putFormsJuridicaRequest(this.Id, {
        Minuta: 'Test minuta',
      })
      .subscribe();
  }

  isValid() {
    return true;
  }
}
