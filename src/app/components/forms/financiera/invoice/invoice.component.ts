import { HttpEventType } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  isDevMode,
} from '@angular/core';
import { FileItem } from 'src/app/interfaces/FileItem';
import { WaitTask } from 'src/app/interfaces/WaitTask';
import { FormsService } from 'src/app/services/forms.service';
import { Utils } from 'src/app/classes/utils';
import { Convenio } from 'src/app/interfaces/Convenio';
import { FormsFinancieraInvoice } from 'src/app/interfaces/forms-financiera-invoice';

@Component({
  selector: 'app-forms-financiera-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
})
export class FormsFinancieraInvoiceComponent implements OnInit {
  waitTasks: WaitTask[] = [];
  formIndex: number = 0;

  // 0
  tipoPersona: string = '';
  tipoRelacion: string = '';

  // 1
  identification: string = '';
  digitoVerificacion: string = '';
  email: string = '';
  flowUser: any;
  verificationCode: string = '';
  validacionUsuarioError: boolean = false;
  authCode: string = '';
  authValidation: boolean = false;

  // 2
  tipoSoporteContable: string = '';

  // 2.1
  tipoLegalizacion: string | undefined;

  // 3
  convenios: Convenio[] = [];
  convenio: string = '';

  // Cuenta de cobro/Factura

  cuentaCobroFacturaFiles: FileItem[] = [];

  setCuentaCobroFacturaFiles(cuentaCobroFacturaFiles: FileItem[]) {
    this.cuentaCobroFacturaFiles = cuentaCobroFacturaFiles;
  }

  facturaEquivalenteFiles: FileItem[] = [];

  setFacturaEquivalenteFiles(facturaEquivalenteFiles: FileItem[]) {
    this.facturaEquivalenteFiles = facturaEquivalenteFiles;
  }

  seguridadSocialParafiscalesFiles: FileItem[] = [];

  setSeguridadSocialParafiscalesFiles(
    seguridadSocialParafiscalesFiles: FileItem[]
  ) {
    this.seguridadSocialParafiscalesFiles = seguridadSocialParafiscalesFiles;
  }

  informeActividadesFiles: FileItem[] = [];

  setInformeActividadesFiles(informeActividadesFiles: FileItem[]) {
    this.informeActividadesFiles = informeActividadesFiles;
  }

  // Anticipo

  camaraComercioFiles: FileItem[] = [];

  setCamaraDeComercioFiles(camaraComercioFiles: FileItem[]) {
    this.camaraComercioFiles = camaraComercioFiles;
  }

  formatoSolicitudAvancesFiles: FileItem[] = [];

  setFormatoSolicitudAvancesFiles(formatoSolicitudAvancesFiles: FileItem[]) {
    this.formatoSolicitudAvancesFiles = formatoSolicitudAvancesFiles;
  }

  cotizaciones: FileItem[] = [];

  setCotizacionesFiles(formatoSolicitudAvancesFiles: FileItem[]) {
    this.formatoSolicitudAvancesFiles = formatoSolicitudAvancesFiles;
  }

  solicitudesComision: FileItem[] = [];

  setSolicitudesComisionFiles(formatoSolicitudAvancesFiles: FileItem[]) {
    this.formatoSolicitudAvancesFiles = formatoSolicitudAvancesFiles;
  }

  // Dieta

  formatoSolicitudViajesFiles: FileItem[] = [];

  setFormatoSolicitudViajesFiles(formatoSolicitudViajesFiles: FileItem[]) {
    this.formatoSolicitudViajesFiles = formatoSolicitudViajesFiles;
  }

  infoAdicional: string = '';

  @Output() onWaitTasksChange = new EventEmitter<WaitTask[]>();

  constructor(private formsService: FormsService) {}

  ngOnInit(): void {}

  invalidateFlowUser() {
    this.flowUser = undefined;
    this.validacionUsuarioError = false;
  }

  btnValidarUsuarioClick() {
    var taskId: string;
    this.formsService
      .validateFlowUser(
        this.tipoPersona,
        this.tipoRelacion,
        this.tipoPersona === 'Juridica'
          ? `${this.identification}-${this.digitoVerificacion}`
          : this.identification,
        this.email
      )
      .subscribe(
        (event) => {
          switch (event.type) {
            case HttpEventType.Sent:
              taskId = Utils.makeRandomString(4);
              this.waitTasks.push({
                id: taskId,
                description: 'Validando informacion...',
                total: 0,
                current: 0,
                progress: 0,
              });
              this.onWaitTasksChange.emit(this.waitTasks);
              break;
            case HttpEventType.DownloadProgress:
              let taskIndex = this.waitTasks.findIndex(
                (element) => element.id === taskId
              );
              this.waitTasks[taskIndex].current = event.loaded;
              this.waitTasks[taskIndex].progress = Math.round(
                (event.loaded * 100) / this.waitTasks[taskIndex].total
              );
              this.onWaitTasksChange.emit(this.waitTasks);
              break;
            case HttpEventType.Response:
              this.flowUser = event.body.userInfo.value[0];
              this.verificationCode = event.body.generatedCode;

              this.waitTasks.splice(
                this.waitTasks.findIndex((element) => element.id === taskId)
              );
              this.onWaitTasksChange.emit(this.waitTasks);
              break;
          }
        },
        (err) => {
          if (err.status === 404) {
            this.flowUser = undefined;
            this.validacionUsuarioError = true;

            this.waitTasks.splice(
              this.waitTasks.findIndex((element) => element.id === taskId)
            );
            this.onWaitTasksChange.emit(this.waitTasks);
          }
        }
      );
  }

  resetTwoFactValidation() {
    this.authValidation = false;
  }

  btnValidateTwoFactorClick() {
    if (this.flowUser && this.verificationCode === this.authCode) {
      this.authValidation = true;
    } else {
      this.authValidation = false;
    }
  }

  btnPreviousClick() {
    switch (this.formIndex) {
      case 1:
        // Reset form index 0 values
        this.tipoPersona = '';
        this.tipoRelacion = '';
        break;
      case 2:
        // Reset form index 1 values
        this.identification = '';
        this.digitoVerificacion = '';
        this.email = '';
        this.flowUser = undefined;
        this.verificationCode = '';
        this.validacionUsuarioError = false;
        this.authCode = '';
        this.authValidation = false;
        break;
      case 2.1:
        // Reset form index 2 values
        this.tipoSoporteContable = '';

        this.formIndex = 2;
        return;
      case 3:
        if (this.tipoSoporteContable === 'Legalizacion') {
          // Reset form index 2.1 values
          this.tipoLegalizacion = '';

          this.formIndex = 2.1;
          return;
        }

        // Reset form index 2 values
        this.tipoSoporteContable = '';
        break;
    }

    // Reduce form index by 1
    this.formIndex--;
  }

  btnNextClick() {
    switch (this.formIndex) {
      case 0:
        // Reset form index 1 values
        this.identification = '';
        this.digitoVerificacion = '';
        this.email = '';
        this.flowUser = undefined;
        this.verificationCode = '';
        this.validacionUsuarioError = false;
        this.authCode = '';
        this.authValidation = false;
        break;
      case 1:
        // Reset form index 2 values
        this.tipoSoporteContable = '';
        break;
      case 2:
        if (this.tipoSoporteContable === 'Legalizacion') {
          // Reset form index 2.1 values
          this.tipoLegalizacion = '';

          this.formIndex = 2.1;
          return;
        }

        // Reset form index 3 values
        this.convenio = '';
        switch (this.tipoSoporteContable) {
          case 'Cuenta de cobro':
            this.cuentaCobroFacturaFiles = [];
            this.facturaEquivalenteFiles = [];
            this.seguridadSocialParafiscalesFiles = [];
            this.informeActividadesFiles = [];
            break;
          case 'Anticipo':
            this.formatoSolicitudAvancesFiles = [];
            break;
          case 'Dieta':
            this.formatoSolicitudViajesFiles = [];
            break;
          case 'Legalizacion':
            break;
          default:
            break;
        }
        // Load form index 3 values
        var taskId: string;
        this.formsService.getConvenios().subscribe((event) => {
          switch (event.type) {
            case HttpEventType.Sent:
              taskId = Utils.makeRandomString(4);
              this.waitTasks.push({
                id: taskId,
                description: 'Cargando convenios...',
                total: 0,
                current: 0,
                progress: 0,
              });
              this.onWaitTasksChange.emit(this.waitTasks);
              break;
            case HttpEventType.DownloadProgress:
              let taskIndex = this.waitTasks.findIndex(
                (element) => element.id === taskId
              );
              this.waitTasks[taskIndex].current = event.loaded;
              this.waitTasks[taskIndex].progress = Math.round(
                (event.loaded * 100) / this.waitTasks[taskIndex].total
              );
              this.onWaitTasksChange.emit(this.waitTasks);
              break;
            case HttpEventType.Response:
              event.body.value.forEach((convenio: any) => {
                this.convenios.push({
                  Id: convenio.id,
                  Aliado: convenio.fields.Aliado,
                  Numero: convenio.fields.Numero,
                  Mostrar: convenio.fields.Mostrar,
                });
              });

              this.waitTasks.splice(
                this.waitTasks.findIndex((element) => element.id === taskId)
              );
              this.onWaitTasksChange.emit(this.waitTasks);
              break;
          }
        });
        break;
      case 2.1:
        // Reset form index 3 values
        this.convenio = '';
        switch (this.tipoSoporteContable) {
          case 'Cuenta de cobro':
            this.cuentaCobroFacturaFiles = [];
            this.facturaEquivalenteFiles = [];
            this.seguridadSocialParafiscalesFiles = [];
            this.informeActividadesFiles = [];
            break;
          case 'Anticipo':
            this.formatoSolicitudAvancesFiles = [];
            break;
          case 'Dieta':
            this.formatoSolicitudViajesFiles = [];
            break;
          case 'Legalizacion':
            break;
          default:
            break;
        }
        // Load form index 3 values
        var taskId: string;
        this.formsService.getConvenios().subscribe((event) => {
          switch (event.type) {
            case HttpEventType.Sent:
              taskId = Utils.makeRandomString(4);
              this.waitTasks.push({
                id: taskId,
                description: 'Cargando convenios...',
                total: 0,
                current: 0,
                progress: 0,
              });
              this.onWaitTasksChange.emit(this.waitTasks);
              break;
            case HttpEventType.ResponseHeader:
              this.waitTasks[
                this.waitTasks.findIndex((element) => element.id === taskId)
              ].total = event.headers.get('contentLength');
              this.onWaitTasksChange.emit(this.waitTasks);
              break;
            case HttpEventType.DownloadProgress:
              let taskIndex = this.waitTasks.findIndex(
                (element) => element.id === taskId
              );
              this.waitTasks[taskIndex].current = event.loaded;
              this.waitTasks[taskIndex].progress = Math.round(
                (event.loaded * 100) / this.waitTasks[taskIndex].total
              );
              this.onWaitTasksChange.emit(this.waitTasks);
              break;
            case HttpEventType.Response:
              this.convenios = event.body;

              this.waitTasks.splice(
                this.waitTasks.findIndex((element) => element.id === taskId)
              );
              this.onWaitTasksChange.emit(this.waitTasks);
              break;
          }
        });

        this.formIndex = 3;
        return;
    }

    this.formIndex++;
  }

  validateEmail(email: string): boolean {
    return Utils.validateEmail(email);
  }

  isDevMode() {
    return isDevMode();
  }

  async btnSubmitClick() {
    let formsFinancieraInvoice: FormsFinancieraInvoice = {
      Id: Utils.makeRandomString(32),
      TipoPersona: this.tipoPersona,
      TipoRelacion: this.tipoRelacion,
      Identificador:
        this.tipoPersona === 'Natural'
          ? this.identification
          : `${this.identification}-${this.digitoVerificacion}`,
      TipoSoporteContable: this.tipoSoporteContable,
      TipoLegalizacion: this.tipoLegalizacion,
      Convenio: this.convenio,
      InformacionAdicional: this.infoAdicional,
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

  isValid(formIndex: number = this.formIndex) {
    switch (formIndex) {
      case 0:
        if (this.tipoPersona === 'Juridica') {
          this.tipoRelacion = 'Proveedor';
        }

        return this.tipoPersona && this.tipoRelacion;
      case 1:
        return this.flowUser;
      case 2:
        return this.tipoSoporteContable;
      case 2.1:
        return this.tipoLegalizacion;
      case 3:
        if (this.convenio) {
          switch (this.tipoSoporteContable) {
            case 'Cuenta de cobro':
              return (
                Utils.validateFiles(this.cuentaCobroFacturaFiles) &&
                Utils.validateFiles(this.facturaEquivalenteFiles) &&
                Utils.validateFiles(this.seguridadSocialParafiscalesFiles) &&
                Utils.validateFiles(this.informeActividadesFiles)
              );
            case 'Anticipo':
              return Utils.validateFiles(this.formatoSolicitudAvancesFiles);
            case 'Dieta':
              return Utils.validateFiles(this.formatoSolicitudViajesFiles);
            case 'Legalizacion':
              return false;
            default:
              return false;
          }
        } else {
          return false;
        }
      default:
        return false;
    }
  }
}
