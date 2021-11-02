import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { stringify } from 'querystring';
import { Utils } from 'src/app/classes/utils';
import { FormsCoordinacionLogistica } from 'src/app/interfaces/forms-coordinacion-logistica';
import { WaitTask } from 'src/app/interfaces/WaitTask';

@Component({
  selector: 'app-forms-coordinacionlogistica',
  templateUrl: './coordinacionlogistica.component.html',
  styleUrls: ['./coordinacionlogistica.component.css'],
})
export class CoordinacionlogisticaComponent implements OnInit {
  nombre: string = ''
  convenio: string = ''
  ida: string = ''
  vuelta: string | undefined
  cc: string = ''
  equipajeAdicional: string = ''
  email: string = ''
  telefono: string = ''
  pasaporte: string = ''

  @Output() onWaitTasksChange = new EventEmitter<WaitTask[]>();

  constructor() {}

  ngOnInit(): void {}

  async btnSubmitClick() {
    let formsCoordinacionLogistica: FormsCoordinacionLogistica = {
      Id: Utils.makeRandomString(32),
      Nombre: this.nombre,
      Convenio: this.convenio,
      Ida: this.ida,
      Vuelta: this.vuelta,
      CC: this.cc,
      EquipajeAdicional: this.equipajeAdicional,
      Email: this.email,
      Telefono: this.telefono,
      Pasaporte: this.pasaporte
    };

    if (this.tipoPersona === 'Natural') {
      switch (this.tipoSoporteContable) {
        case 'Cuenta de cobro':
          formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
            0: this.cuentaCobroFacturaFiles,
            1: this.facturaEquivalenteFiles,
            2: this.seguridadSocialParafiscalesFiles,
            3: this.informeActividadesFiles,
          });
          // Cleaning fields because information has been saved
          this.informeActividadesFiles = [];
          this.seguridadSocialParafiscalesFiles = [];
          this.facturaEquivalenteFiles = [];
          this.cuentaCobroFacturaFiles = [];
          break;
        case 'Anticipo':
          formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
            0: this.formatoSolicitudAvancesFiles,
            1: this.cotizaciones,
            2: this.solicitudesComision,
          });
          // Cleaning fields because information has been saved
          this.solicitudesComision = [];
          this.cotizaciones = [];
          this.formatoSolicitudAvancesFiles = [];
          break;
        case 'Dieta':
          formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
            0: this.formatoSolicitudViajesFiles,
          });
          // Cleaning fields because information has been saved
          this.formatoSolicitudViajesFiles = [];
          break;
      }
    } else {
      switch (this.tipoSoporteContable) {
        case 'Cuenta de cobro':
          formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
            0: this.cuentaCobroFacturaFiles,
            1: this.facturaEquivalenteFiles,
            2: this.seguridadSocialParafiscalesFiles,
            3: this.informeActividadesFiles,
          });
          // Cleaning fields because information has been saved
          this.informeActividadesFiles = [];
          this.seguridadSocialParafiscalesFiles = [];
          this.facturaEquivalenteFiles = [];
          this.cuentaCobroFacturaFiles = [];
          break;
        case 'Anticipo':
          formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
            0: this.formatoSolicitudAvancesFiles,
            1: this.camaraComercioFiles,
            2: this.cotizaciones,
            3: this.solicitudesComision,
          });
          // Cleaning fields because information has been saved
          this.solicitudesComision = [];
          this.cotizaciones = [];
          this.camaraComercioFiles = [];
          this.formatoSolicitudAvancesFiles = [];
          break;
      }
    }

    // Cleaning fields because information has been saved
    this.infoAdicional = '';
    this.convenio = '';
    this.tipoLegalizacion = '';
    this.tipoSoporteContable = '';
    this.email = '';
    this.digitoVerificacion = '';
    this.identification = '';
    this.tipoRelacion = '';
    this.tipoPersona = '';

    this.formIndex = 0;

    var taskId: string;
    this.formsService
      .postFormsFinancieraInvoice(formsFinancieraInvoice)
      .subscribe(
        (event) => {
          let taskIndex;
          switch (event.type) {
            case HttpEventType.Sent:
              taskId = Utils.makeRandomString(4);
              this.waitTasks.push({
                id: taskId,
                description: `Enviando ${
                  formsFinancieraInvoice.TipoSoporteContable === 'Legalizacion'
                    ? `${formsFinancieraInvoice.TipoSoporteContable} de tipo ${formsFinancieraInvoice.TipoLegalizacion}`
                    : formsFinancieraInvoice.TipoSoporteContable
                }...`,
                total: 0,
                current: 0,
                progress: 0,
              });
              this.onWaitTasksChange.emit(this.waitTasks);
              break;
            case HttpEventType.UploadProgress:
              taskIndex = this.waitTasks.findIndex(
                (element) => element.id === taskId
              );
              this.waitTasks[taskIndex].current = event.loaded;
              this.waitTasks[taskIndex].progress = Math.round(
                (event.loaded * 100) / this.waitTasks[taskIndex].total
              );
              this.onWaitTasksChange.emit(this.waitTasks);
              break;
            case HttpEventType.ResponseHeader:
              this.waitTasks.splice(
                this.waitTasks.findIndex((element) => element.id === taskId)
              );
              this.onWaitTasksChange.emit(this.waitTasks);
              break;
          }
        },
        (err) => {}
      );
  }
}
