import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Utils } from 'src/app/classes/utils';
import { Convenio } from 'src/app/interfaces/Convenio';
import { DropdownItem } from 'src/app/interfaces/dropdown-item';
import { FileItem } from 'src/app/interfaces/FileItem';
import { FormsTiquetes } from 'src/app/interfaces/forms-tiquetes';
import { Tramo } from 'src/app/interfaces/tramo';
import { WaitTask } from 'src/app/interfaces/WaitTask';
import { FormsService } from 'src/app/services/forms.service';
import { SharedService } from 'src/app/services/shared.service';

declare const Autocomplete: any;

@Component({
  selector: 'app-forms-tiquetes',
  templateUrl: './tiquetes.component.html',
  styleUrls: ['./tiquetes.component.css'],
})
export class FormsTiquetesComponent implements OnInit {
  convenios: Convenio[] = [];

  nombre: string = '';
  convenio: string = '';

  ruta: string = '';
  tramos: Tramo[] = [];

  airports: DropdownItem[] = [];

  setOrigen(tramoIndex: number, origen: any) {
    setTimeout(() => {
      this.tramos[tramoIndex].origen = origen.originalTarget.value;
    }, 100);
  }

  setDestino(tramoIndex: number, destino: any) {
    setTimeout(() => {
      this.tramos[tramoIndex].destino = destino.originalTarget.value;
    }, 100);
  }

  setFechaIda(tramoIndex: number, fechaIda: Date) {
    this.tramos[tramoIndex].fechaIda = fechaIda;
  }

  setFechaVuelta(tramoIndex: number, fechaVuelta: Date) {
    this.tramos[tramoIndex].fechaVuelta = fechaVuelta;
  }

  identificationType: string = '';
  identification: string = '';

  fechaNacimiento!: Date;

  setFechaNacimiento(fechaNacimiento: Date) {
    this.fechaNacimiento = fechaNacimiento;
  }

  equipajeAdicional: string = '';
  email: string = '';
  telefono: string = '';

  pasaporteFiles: FileItem[] = [];

  setPasaporteFiles(pasaporteFiles: FileItem[]) {
    this.pasaporteFiles = pasaporteFiles;
  }

  comprobantesFiles: FileItem[] = [];

  setComprobantesFiles(comprobantesFiles: FileItem[]) {
    this.comprobantesFiles = comprobantesFiles;
  }

  informacionAdicional: string = '';

  @Output() onWaitTasksChange = new EventEmitter<WaitTask[]>();

  constructor(
    private router: Router,
    private formsService: FormsService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    /*if (!history.state.userInfo || !history.state.plaftformInfo) {
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

    for (
      let i = 0;
      history.state.plaftformInfo.fields.Convenios.length > i;
      i++
    ) {
      this.convenios.push({
        Id: history.state.plaftformInfo.fields.Convenios[i].id,
        Aliado: history.state.plaftformInfo.fields.Convenios[i].fields.Aliado,
        Numero: history.state.plaftformInfo.fields.Convenios[i].fields.Numero,
        Mostrar: history.state.plaftformInfo.fields.Convenios[i].fields.Mostrar,
      });
    }*/
  }

  onRutaChange() {
    if (this.airports.length === 0) {
      let getAirportsTaskId!: string;
      this.formsService.getAirports().subscribe(
        (httpEvent) => {
          switch (httpEvent.type) {
            case HttpEventType.Sent:
              getAirportsTaskId = this.sharedService.pushWaitTask({
                description: 'Cargando aeropuertos...',
                progress: 0,
              }) as string;
              break;
            case HttpEventType.DownloadProgress:
              this.sharedService.pushWaitTask({
                id: getAirportsTaskId,
                progress: Math.round(
                  (httpEvent.loaded * 100) / httpEvent.total
                ),
              });
              break;
            case HttpEventType.Response:
              for (const airport of httpEvent.body) {
                this.airports.push({
                  label: `${airport.Country} | ${airport.City} | ${airport['Airport Name']} | ${airport.IATA}`,
                  value: airport._id,
                });
              }
              break;
          }
        },
        (httpEventError) => {
          this.sharedService.removeWaitTask({
            id: getAirportsTaskId,
          });
        },
        () => {
          this.sharedService.removeWaitTask({
            id: getAirportsTaskId,
          });
        }
      );
    }

    switch (this.ruta) {
      case 'Ida':
      case 'Ida y vuelta':
        this.tramos = [{ index: 0 }];

        setTimeout(() => {
          new Autocomplete(document.getElementById(`inputOrigen0`), {
            data: this.airports,
          }),
            new Autocomplete(document.getElementById(`inputDestino0`), {
              data: this.airports,
            });
        });
        break;
      case 'Multidestino':
        this.tramos = [{ index: 0 }, { index: 1 }];

        setTimeout(() => {
          new Autocomplete(document.getElementById(`inputOrigen0`), {
            data: this.airports,
          });
          new Autocomplete(document.getElementById(`inputDestino0`), {
            data: this.airports,
          });
          new Autocomplete(document.getElementById(`inputOrigen1`), {
            data: this.airports,
          });
          new Autocomplete(document.getElementById(`inputDestino1`), {
            data: this.airports,
          });
        });
        break;
    }
  }

  airportIsValid(_airport?: string) {
    return this.airports.find((airport) => airport.label === _airport);
  }

  validateTramos(tramos: Tramo[], vuelta: boolean) {
    for (let tramo of tramos) {
      if (
        !this.airportIsValid(tramo.origen) ||
        !this.airportIsValid(tramo.destino) ||
        !tramo.fechaIda ||
        !tramo.horaIda ||
        !(vuelta ? tramo.fechaVuelta && tramo.horaVuelta : true)
      ) {
        return false;
      }
    }

    return true;
  }

  btnAddTramoClick() {
    this.tramos.push({ index: this.tramos.length });

    setTimeout(() => {
      new Autocomplete(
        document.getElementById(`inputOrigen${this.tramos.length - 1}`),
        {
          data: this.airports,
        }
      );
      new Autocomplete(
        document.getElementById(`inputDestino${this.tramos.length - 1}`),
        {
          data: this.airports,
        }
      );
    });
  }

  btnRemoveTramoClick(tramoIndex: number) {
    this.tramos.splice(tramoIndex, 1);
  }

  btnSubmitClick() {
    const formsCoordinacionLogistica: FormsTiquetes = {
      Id: Utils.makeRandomString(32),
      Nombre: this.nombre,
      Convenio: this.convenio,
      Tramos: this.tramos,
      IdentificatorType: this.identificationType,
      Identificator: this.identification,
      FechaNacimiento: this.fechaNacimiento,
      EquipajeAdicional: this.equipajeAdicional,
      Email: this.email,
      Telefono: this.telefono,
      PasaporteFiles: this.pasaporteFiles,
      ComprobantesFiles: this.comprobantesFiles,
      InformacionAdicional: Utils.replaceAll(
        this.informacionAdicional,
        '"',
        "'"
      ),
      Requestor: history.state.userInfo,
      Status: 0,
    };

    let postFormsCoordinacionLogisticaFlowTaskId!: string;
    this.formsService
      .postFormsCoordinacionLogisticaFlow(formsCoordinacionLogistica)
      .subscribe(
        (httpEvent) => {
          switch (httpEvent.type) {
            case HttpEventType.Sent:
              postFormsCoordinacionLogisticaFlowTaskId =
                this.sharedService.pushWaitTask({
                  description: `Enviando coordinacion logistica...`,
                  progress: 0,
                }) as string;
              break;
            case HttpEventType.UploadProgress:
              this.sharedService.pushWaitTask({
                id: postFormsCoordinacionLogisticaFlowTaskId,
                progress: Math.round(
                  (httpEvent.loaded * 100) / httpEvent.total
                ),
              });
              break;
            case HttpEventType.Response:
              this.router.navigateByUrl('/');

              this.sharedService.pushToastMessage({
                id: Utils.makeRandomString(4),
                title: `Coordinacion logistica enviada satisfactoriamente`,
                description: `Su coordinacion logistica ha sido ingresada correctamente y sera procesada muy pronto, este atento de su correo electronico por el cual se le notificara del estado y manera de validacion de la peticion.`,
                autohide: 30000,
              });
              break;
          }
        },
        (httpEventError) => {
          this.sharedService.removeWaitTask({
            id: postFormsCoordinacionLogisticaFlowTaskId,
          });
        },
        () => {
          this.sharedService.removeWaitTask({
            id: postFormsCoordinacionLogisticaFlowTaskId,
          });
        }
      );
  }

  validateEmail(email: string = this.email): boolean {
    return Utils.validateEmail(email);
  }

  isValid() {
    return (
      this.nombre &&
      this.convenio &&
      this.ruta &&
      this.validateTramos(
        this.tramos,
        this.ruta === 'Ida y vuelta' ? true : false
      ) &&
      this.identificationType &&
      (this.identification.length === 8 || this.identification.length === 10) &&
      this.fechaNacimiento &&
      this.equipajeAdicional &&
      Utils.validateEmail(this.email) &&
      this.telefono.length === 10
    );
  }
}
