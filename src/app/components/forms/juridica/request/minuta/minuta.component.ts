import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from 'src/app/classes/utils';
import { FormsService } from 'src/app/services/forms.service';
import { SharedService } from 'src/app/services/shared.service';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    const taskId: string = Utils.makeRandomString(4);

    this.Id = this.activatedRoute.snapshot.params.id;

    this.formsService
      .getFormsJuridicaRequestMinutaAvailability(this.Id)
      .subscribe(
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
        () => {
          this.sharedService.removeWaitTask({
            id: taskId,
          });
        }
      );
  }
}
