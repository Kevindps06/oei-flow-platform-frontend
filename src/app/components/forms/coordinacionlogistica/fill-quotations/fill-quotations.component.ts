import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from 'src/app/classes/utils';
import { FormsCoordinacionLogisticaFillQuotations } from 'src/app/interfaces/forms-coordinacionlogistica-fillquotations';
import { FormsService } from 'src/app/services/forms.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-forms-coordinacionlogistica-fillquotations',
  templateUrl: './fill-quotations.component.html',
  styleUrls: ['./fill-quotations.component.css'],
})
export class FormsCoordinacionLogisticaFillQuotationsComponent
  implements OnInit
{
  quotations: FormsCoordinacionLogisticaFillQuotations[] = [];

  Id: string = '';
  formsCoordinacionLogistica: any;

  ticketNumber: string = '';
  aerolinea: string = '';
  horaSalida: string = '';
  horaLlegada: string = '';
  costo: number | undefined;

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

    let taskId: string = Utils.makeRandomString(4);
    this.formsService.getFormsCoordinacionLogistica(this.Id).subscribe(
      (event) => {
        switch (event.type) {
          case HttpEventType.Sent:
            this.sharedService.pushWaitTask({
              id: taskId,
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
              if (event.body.SelectedQuotation) {
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
                  this.ticketNumber =
                    this.formsCoordinacionLogistica.TicketNumber;
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

  btnSetTicketNumber() {
    this.formsService
      .putFormsCoordinacionLogistica(
        { TicketNumber: this.ticketNumber },
        this.Id
      )
      .subscribe(
        (event) => {
          switch (event.type) {
            case HttpEventType.Response:
              this.formsCoordinacionLogistica.TicketNumber = this.ticketNumber;

              this.sharedService.pushToastMessage({
                id: Utils.makeRandomString(4),
                title: `Numero de tiquete actualizado`,
                description: `Se ha establecido correctamente el numero del tiquete para esta peticion.`,
              });
              break;
          }
        },
        (err) => {
          this.ticketNumber = this.formsCoordinacionLogistica.TicketNumber;

          this.sharedService.pushToastMessage({
            id: Utils.makeRandomString(4),
            title: `Numero de tiquete no actualizado`,
            description: `No se ha podido establecer el numero del tiquete para esta peticion, vuelva a intentarlo.`,
          });
        }
      );
  }

  uploadingQuotations: boolean = false;
  btnAddClick() {
    if (!this.costo) {
      return;
    }

    this.uploadingQuotations = true;

    this.quotations.push({
      Number: this.quotations.length + 1,
      Aerolinea: this.aerolinea,
      HoraSalida: this.horaSalida,
      HoraLlegada: this.horaLlegada,
      Costo: this.costo,
    });

    this.formsService
      .putFormsCoordinacionLogistica({ Quotations: this.quotations }, this.Id)
      .subscribe(
        (event) => {
          switch (event.type) {
            case HttpEventType.Response:
              this.formsCoordinacionLogistica.Quotations = this.quotations;

              this.sharedService.pushToastMessage({
                id: Utils.makeRandomString(4),
                title: `Cotizaciones actualizadas`,
                description: `Se han actualizado las cotizaciones de la peticion.`,
                autohide: 4000,
              });

              this.aerolinea = '';
              this.horaSalida = '';
              this.horaLlegada = '';
              this.costo = undefined;

              this.uploadingQuotations = false;
              break;
          }
        },
        (err) => {
          this.quotations = this.formsCoordinacionLogistica.Quotations;

          this.sharedService.pushToastMessage({
            id: Utils.makeRandomString(4),
            title: `Cotizaciones no actualizadas`,
            description: `Las cotizaciones no ha podido ser actualizadas, vuelva a intentarlo.`,
          });

          this.uploadingQuotations = false;
        }
      );
  }

  removeQuotation(quotationNumber: number) {
    this.quotations.splice(
      this.quotations.findIndex(
        (quotation) => quotation.Number === quotationNumber
      ),
      1
    );

    for (let i = 0; this.quotations.length > i; i++) {
      this.quotations[i].Number = i + 1;
    }

    this.formsService
      .putFormsCoordinacionLogistica({ Quotations: this.quotations }, this.Id)
      .subscribe(
        (event) => {
          switch (event.type) {
            case HttpEventType.Response:
              this.formsCoordinacionLogistica.Quotations = this.quotations;

              this.sharedService.pushToastMessage({
                id: Utils.makeRandomString(4),
                title: `Cotizaciones actualizadas`,
                description: `Se han actualizado las cotizaciones de la peticion.`,
                autohide: 4000,
              });
              break;
          }
        },
        (err) => {
          this.quotations = this.formsCoordinacionLogistica.Quotations;

          this.sharedService.pushToastMessage({
            id: Utils.makeRandomString(4),
            title: `Cotizaciones no actualizadas`,
            description: `Las cotizaciones no han podido ser actualizadas, intente remover la cotizacion nuevamente.`,
          });
        }
      );
  }

  isValid() {
    return (
      this.aerolinea &&
      this.horaSalida &&
      this.horaLlegada &&
      this.costo &&
      this.costo > 0
    );
  }
}
