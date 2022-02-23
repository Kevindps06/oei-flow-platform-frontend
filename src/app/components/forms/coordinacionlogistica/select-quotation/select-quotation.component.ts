import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from 'src/app/classes/utils';
import { FormsCoordinacionLogisticaFillQuotations } from 'src/app/interfaces/forms-coordinacionlogistica-fillquotations';
import { FormsService } from 'src/app/services/forms.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-forms-coordinacionlogistica-selectquotation',
  templateUrl: './select-quotation.component.html',
  styleUrls: ['./select-quotation.component.css'],
})
export class FormsCoordinacionLogisticaSelectQuotationComponent
  implements OnInit
{
  quotations: FormsCoordinacionLogisticaFillQuotations[] = [];

  Id: string = '';
  formsCoordinacionLogistica: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formsService: FormsService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    if (!history.state.userInfo || !history.state.plaftformInfo) {
      this.router.navigate(['/login'], {
        state: {
          fromRoute: this.router.url,
        },
      });

      this.sharedService.pushToastMessage({
        id: Utils.makeRandomString(4),
        title: `Acceso inautorizado`,
        description: `Para ingresar a este componente es necesario contar con el acceso autorizado, inicie sesion y vuelva a intentar ingresar.`,
        autohide: 10000,
      });

      return;
    }

    this.Id = this.activatedRoute.snapshot.paramMap.get('Id') as string;

    let taskId: string;
    this.formsService.getFormsCoordinacionLogistica(this.Id).subscribe(
      (event) => {
        switch (event.type) {
          case HttpEventType.Sent:
            this.sharedService.pushWaitTask({
              id: (taskId = Utils.makeRandomString(4)),
              description:
                'Obteniendo informacion de la coordinacion logistica...',
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
            if (event.body.length > 0) {
              if (event.body[0].SelectedQuotation) {
                this.router.navigate(['/']);

                this.sharedService.pushToastMessage({
                  id: Utils.makeRandomString(4),
                  title: `Coordinacion logistica finalizada`,
                  description: `La coordinacion logistica a la que esta intentando ingresar ya ha finalizado su proceso por esta razon no puede ingresar.`,
                  autohide: 10000,
                });
              } else {
                this.formsCoordinacionLogistica = event.body[0];

                if (this.formsCoordinacionLogistica.Quotations.length > 0) {
                  this.quotations = this.formsCoordinacionLogistica.Quotations;
                }

                this.sharedService.pushToastMessage({
                  id: Utils.makeRandomString(4),
                  title: `Coordinacion logistica`,
                  description: `Ingrese las reservas necesarias para el proceso y posteriormente continue su camino aprobando la peticion en el flujo.`,
                  autohide: 10000,
                });
              }
            } else {
              this.router.navigate(['/']);

              this.sharedService.pushToastMessage({
                id: Utils.makeRandomString(4),
                title: `Coordinacion logistica no encontrada`,
                description: `No se ha encontrado la coordinacion logistica a la que intenta ingresar, verifique la direccion y vuelva a intentarlo.`,
                autohide: 10000,
              });
            }

            this.sharedService.removeWaitTask({
              id: taskId,
            });
            break;
        }
      },
      (err) => {
        this.sharedService.removeWaitTask({
          id: taskId,
        });
      }
    );
  }

  setSelectedQuotation(
    selectedQuotation: FormsCoordinacionLogisticaFillQuotations
  ) {
    this.formsService
      .putFormsCoordinacionLogistica(this.Id, {
        SelectedQuotation: selectedQuotation,
      })
      .subscribe(
        (event) => {
          switch (event.type) {
            case HttpEventType.Response:
              this.formsCoordinacionLogistica.SelectedQuotation =
                selectedQuotation;

              this.sharedService.pushToastMessage({
                id: Utils.makeRandomString(4),
                title: `Cotizacion #${selectedQuotation.Number} seleccionada correctamente`,
                description: `Se ha seleccionado correctamente la cotizacion, ya puede seguir el flujo o cambiar de cotizacion.`,
                autohide: 4000,
              });
              break;
          }
        },
        (err) => {
          this.formsCoordinacionLogistica.SelectedQuotation = undefined;

          this.sharedService.pushToastMessage({
            id: Utils.makeRandomString(4),
            title: `Cotizacion no seleccionada`,
            description: `La cotizacion no ha podido ser seleccionada, intente seleccionar la cotizacion nuevamente.`,
          });
        }
      );
  }
}
