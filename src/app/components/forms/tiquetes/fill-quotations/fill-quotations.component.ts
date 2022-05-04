import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from 'src/app/classes/utils';
import { FormsTiquetesFillQuotations } from 'src/app/interfaces/forms-tiquetes-fillquotations';
import { FormsService } from 'src/app/services/forms.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-forms-tiquetes-fillquotations',
  templateUrl: './fill-quotations.component.html',
  styleUrls: ['./fill-quotations.component.css'],
})
export class FormsTiquetesFillQuotationsComponent
  implements OnInit
{
  quotations: FormsTiquetesFillQuotations[] = [];

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

    this.Id = this.activatedRoute.snapshot.params.id;

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
              if (httpEvent.body.SelectedQuotation) {
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

  btnSetTicketNumber() {
    this.formsService
      .putFormsCoordinacionLogistica(this.Id, {
        TicketNumber: this.ticketNumber,
      })
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
      .putFormsCoordinacionLogistica(this.Id, { Quotations: this.quotations })
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
      .putFormsCoordinacionLogistica(this.Id, { Quotations: this.quotations })
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
