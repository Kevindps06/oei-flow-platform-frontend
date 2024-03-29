import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from 'src/app/classes/utils';
import { FormsTiquetesFillQuotations } from 'src/app/interfaces/forms-tiquetes-fillquotations';
import { FormsService } from 'src/app/services/forms.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-forms-tiquetes-selectquotation',
  templateUrl: './select-quotation.component.html',
  styleUrls: ['./select-quotation.component.css'],
})
export class FormsTiquetesSelectQuotationComponent implements OnInit {
  quotations: FormsTiquetesFillQuotations[] = [];

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

    let getFormsCoordinacionLogisticaTaskId!: string;
    this.formsService.getFormsCoordinacionLogistica(this.Id).subscribe(
      (httpEvent) => {
        switch (httpEvent.type) {
          case HttpEventType.Sent:
            getFormsCoordinacionLogisticaTaskId =
              this.sharedService.pushWaitTask({
                description:
                  'Obteniendo informacion de la coordinacion logistica...',
                progress: 0,
              }) as string;
            break;
          case HttpEventType.DownloadProgress:
            this.sharedService.pushWaitTask({
              id: getFormsCoordinacionLogisticaTaskId,
              progress: Math.round((httpEvent.loaded * 100) / httpEvent.total),
            });
            break;
          case HttpEventType.Response:
            if (httpEvent.body.length > 0) {
              if (httpEvent.body[0].SelectedQuotation) {
                this.router.navigate(['/']);

                this.sharedService.pushToastMessage({
                  id: Utils.makeRandomString(4),
                  title: `Coordinacion logistica finalizada`,
                  description: `La coordinacion logistica a la que esta intentando ingresar ya ha finalizado su proceso por esta razon no puede ingresar.`,
                  autohide: 10000,
                });
              } else {
                this.formsCoordinacionLogistica = httpEvent.body[0];

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
            break;
        }
      },
      (httpEventError) => {
        this.sharedService.removeWaitTask({
          id: getFormsCoordinacionLogisticaTaskId,
        });
      },
      () => {
        this.sharedService.removeWaitTask({
          id: getFormsCoordinacionLogisticaTaskId,
        });
      }
    );
  }

  setSelectedQuotation(
    selectedQuotation: FormsTiquetesFillQuotations
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
