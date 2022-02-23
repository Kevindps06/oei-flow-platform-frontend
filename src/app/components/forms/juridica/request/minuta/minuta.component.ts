import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from 'src/app/classes/utils';
import { FormsService } from 'src/app/services/forms.service';
import { SharedService } from 'src/app/services/shared.service';
import { LoginService } from 'src/app/services/login.service';
import { catchError, map } from 'rxjs/operators';
import { EMPTY, throwError } from 'rxjs';

@Component({
  selector: 'app-forms-juridica-request-minuta',
  templateUrl: './minuta.component.html',
  styleUrls: ['./minuta.component.css'],
})
export class FormsJuridicaRequestMinutaComponent implements OnInit {
  Id!: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formsService: FormsService,
    private sharedService: SharedService,
    private router: Router,
    private loginService: LoginService
  ) {}

  async ngOnInit(): Promise<void> {
    if (!this.loginService.loggedInUser()) {
      this.router.navigate(['/login']);

      this.sharedService.pushToastMessage({
        id: Utils.makeRandomString(4),
        title: `Inautorizado`,
        description: `El contenido al que esta intentando ingresar es de uso restringido, autentifiquese y vuelva a intentar ingresar.`,
      });

      return;
    }

    const taskId: string = Utils.makeRandomString(4);

    this.Id = this.activatedRoute.snapshot.params.id;

    await this.formsService
      .getFormsJuridicaRequestMinutaAvailability(this.Id)
      .pipe(
        map((httpEvent) => {
          switch (httpEvent.type) {
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
                progress: Math.round(
                  (httpEvent.loaded * 100) / httpEvent.total
                ),
              });
              break;
            case HttpEventType.Response:
              this.sharedService.removeWaitTask({
                id: taskId,
              });
              break;
          }
        }),
        catchError((httpEventError) => {
          this.router.navigate(['/']);

          this.sharedService.removeWaitTask({
            id: taskId,
          });

          switch (httpEventError.status) {
            case 406:
              this.sharedService.pushToastMessage({
                id: Utils.makeRandomString(4),
                title: `Contenido no disponible`,
                description: `El contenido al que esta intentando ingresar no se encuentra disponible, intentelo despues.`,
              });
              return EMPTY;
            case 423:
              this.sharedService.pushToastMessage({
                id: Utils.makeRandomString(4),
                title: `Componente ya usado`,
                description: `Ya se ha utilizado el componente al que intenta ingresar para su respectiva tarea.`,
              });
              return EMPTY;
          }

          return throwError(httpEventError);
        })
      )
      .toPromise();
  }
}
