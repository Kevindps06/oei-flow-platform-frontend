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
import { ToastMessage } from 'src/app/interfaces/toast-message';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-forms-financiera-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
})
export class FormsFinancieraInvoiceComponent implements OnInit {
  formIndex: number = 0;

  // 0
  tipoPersona: string = '';
  tipoRelacion: string = '';

  // 1
  identificator: string = '';
  digitoVerificacion: string = '';
  email: string = '';
  flowUser: any;
  verificationCode: string = '';
  validacionUsuarioError: boolean = false;
  authCode: string = '';
  authValidation: boolean = false;

  // 2
  tipoGestion: string = '';

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

  cotizacionesFiles: FileItem[] = [];

  setCotizacionesFiles(cotizacionesFiles: FileItem[]) {
    this.cotizacionesFiles = cotizacionesFiles;
  }

  solicitudesComisionFiles: FileItem[] = [];

  setSolicitudesComisionFiles(solicitudesComisionFiles: FileItem[]) {
    this.solicitudesComisionFiles = solicitudesComisionFiles;
  }

  // Dieta

  formatoSolicitudViajesFiles: FileItem[] = [];

  setFormatoSolicitudViajesFiles(formatoSolicitudViajesFiles: FileItem[]) {
    this.formatoSolicitudViajesFiles = formatoSolicitudViajesFiles;
  }

  infoAdicional: string = '';

  @Output() onWaitTasksChange = new EventEmitter<WaitTask[]>();
  @Output() onToastMessagesChange = new EventEmitter<ToastMessage>();

  constructor(
    private formsService: FormsService,
    private sharedService: SharedService
  ) {}

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
          ? `${this.identificator}-${this.digitoVerificacion}`
          : this.identificator,
        this.email
      )
      .subscribe(
        (event) => {
          switch (event.type) {
            case HttpEventType.Sent:
              taskId = Utils.makeRandomString(4);
              this.sharedService.pushWaitTask({
                id: taskId,
                description: 'Validando informacion...',
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
              this.flowUser = event.body.userInfo;
              this.verificationCode = event.body.generatedCode;

              this.sharedService.removeWaitTask({
                id: taskId,
              });

              this.sharedService.pushToastMessage({
                id: Utils.makeRandomString(4),
                title: `Bienvenido ${event.body.userInfo.fields.Nombre_x0020_o_x0020_razon_x0020}`,
                description: `Hola ${event.body.userInfo.fields.Nombre_x0020_o_x0020_razon_x0020}, esperamos tengas la mejor de las estancias.`,
              });
              break;
          }
        },
        (err) => {
          if (err.status === 404) {
            this.flowUser = undefined;
            this.validacionUsuarioError = true;

            this.sharedService.removeWaitTask({
              id: taskId,
            });
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
        this.identificator = '';
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
        this.tipoGestion = '';

        this.formIndex = 2;
        return;
      case 3:
        if (this.tipoGestion === 'Legalizacion') {
          // Reset form index 2.1 values
          this.tipoLegalizacion = '';

          this.formIndex = 2.1;
          return;
        }

        // Reset form index 2 values
        this.tipoGestion = '';
        break;
    }

    // Reduce form index by 1
    this.formIndex--;
  }

  btnNextClick() {
    switch (this.formIndex) {
      case 0:
        // Reset form index 1 values
        this.identificator = '';
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
        this.tipoGestion = '';
        break;
      case 2:
        if (this.tipoGestion === 'Legalizacion') {
          // Reset form index 2.1 values
          this.tipoLegalizacion = '';

          this.formIndex = 2.1;
          return;
        }

        // Reset form index 3 values
        this.convenio = '';
        switch (this.tipoGestion) {
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
              this.sharedService.pushWaitTask({
                id: taskId,
                description: 'Cargando convenios...',
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
              event.body.value.forEach((convenio: any) => {
                this.convenios.push({
                  Id: convenio.id,
                  Aliado: convenio.fields.Aliado,
                  Numero: convenio.fields.Numero,
                  Mostrar: convenio.fields.Mostrar,
                });
              });

              this.sharedService.removeWaitTask({
                id: taskId,
              });
              break;
          }
        });
        break;
      case 2.1:
        // Reset form index 3 values
        this.convenio = '';
        switch (this.tipoGestion) {
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
        this.formsService.getConvenios(true).subscribe((event) => {
          switch (event.type) {
            case HttpEventType.Sent:
              taskId = Utils.makeRandomString(4);
              this.sharedService.pushWaitTask({
                id: taskId,
                description: 'Cargando convenios...',
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
              this.convenios = event.body;

              this.sharedService.removeWaitTask({
                id: taskId,
              });
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

  btnSubmitClick() {
    let formsFinancieraInvoice: FormsFinancieraInvoice = {
      Id: Utils.makeRandomString(32),
      TipoPersona: this.tipoPersona,
      TipoRelacion: this.tipoRelacion,
      Identificator:
        this.tipoPersona === 'Natural'
          ? this.identificator
          : `${this.identificator}-${this.digitoVerificacion}`,
      Email: this.email,
      TipoGestion: this.tipoGestion,
      TipoLegalizacion: this.tipoLegalizacion,
      Convenio: this.convenio,
      InformacionAdicional: this.infoAdicional,
    };

    if (this.tipoPersona === 'Natural') {
      switch (this.tipoGestion) {
        case 'Cuenta de cobro':
          formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
            CuentaCobroFiles: this.cuentaCobroFacturaFiles,
            FacturaEquivalenteFiles: this.facturaEquivalenteFiles,
            SeguridadSocialFiles: this.seguridadSocialParafiscalesFiles,
            InformeActividadesFiles: this.informeActividadesFiles,
          });
          // Cleaning fields because information has been saved
          this.informeActividadesFiles = [];
          this.seguridadSocialParafiscalesFiles = [];
          this.facturaEquivalenteFiles = [];
          this.cuentaCobroFacturaFiles = [];
          break;
        case 'Anticipo':
          formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
            FormatoSolicitudAvancesFiles: this.formatoSolicitudAvancesFiles,
            CotizacionesFiles: this.cotizacionesFiles,
            SolicitudesComisionFiles: this.solicitudesComisionFiles,
          });
          // Cleaning fields because information has been saved
          this.solicitudesComisionFiles = [];
          this.cotizacionesFiles = [];
          this.formatoSolicitudAvancesFiles = [];
          break;
        case 'Dieta':
          formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
            FormatoSolicitudViajesFiles: this.formatoSolicitudViajesFiles,
          });
          // Cleaning fields because information has been saved
          this.formatoSolicitudViajesFiles = [];
          break;
      }
    } else {
      switch (this.tipoGestion) {
        case 'Cuenta de cobro':
          formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
            CuentaCobroFiles: this.cuentaCobroFacturaFiles,
            FacturaEquivalenteFiles: this.facturaEquivalenteFiles,
            SeguridadSocialFiles: this.seguridadSocialParafiscalesFiles,
            CertificadoParafiscales: this.informeActividadesFiles,
          });
          // Cleaning fields because information has been saved
          this.informeActividadesFiles = [];
          this.seguridadSocialParafiscalesFiles = [];
          this.facturaEquivalenteFiles = [];
          this.cuentaCobroFacturaFiles = [];
          break;
        case 'Anticipo':
          formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
            CamaraComercioFiles: this.camaraComercioFiles,
            FormatoSolicitudAvancesFiles: this.formatoSolicitudAvancesFiles,
            CotizacionesFiles: this.cotizacionesFiles,
            SolicitudesComisionFiles: this.solicitudesComisionFiles,
          });
          // Cleaning fields because information has been saved
          this.solicitudesComisionFiles = [];
          this.cotizacionesFiles = [];
          this.camaraComercioFiles = [];
          this.formatoSolicitudAvancesFiles = [];
          break;
      }
    }

    // Cleaning fields because information has been saved
    this.infoAdicional = '';
    this.convenio = '';
    this.tipoLegalizacion = '';
    this.tipoGestion = '';
    this.email = '';
    this.digitoVerificacion = '';
    this.identificator = '';
    this.tipoRelacion = '';
    this.tipoPersona = '';

    this.formIndex = 0;

    var taskId: string;
    this.formsService
      .postFormsFinancieraInvoice(formsFinancieraInvoice)
      .subscribe(
        (event) => {
          switch (event.type) {
            case HttpEventType.Sent:
              taskId = Utils.makeRandomString(4);
              this.sharedService.pushWaitTask({
                id: taskId,
                description: `Enviando ${(formsFinancieraInvoice.TipoGestion ===
                'Legalizacion'
                  ? `${formsFinancieraInvoice.TipoGestion} de tipo ${formsFinancieraInvoice.TipoLegalizacion}`
                  : formsFinancieraInvoice.TipoGestion
                ).toLowerCase()}...`,
                progress: 0,
              });
              break;
            case HttpEventType.UploadProgress:
              this.sharedService.pushWaitTask({
                id: taskId,
                progress: Math.round((event.loaded * 100) / event.total),
              });
              break;
            case HttpEventType.ResponseHeader:
              this.sharedService.pushWaitTask({
                id: taskId,
                description: `Obteniendo la respuesta del envio de ${(formsFinancieraInvoice.TipoGestion ===
                'Legalizacion'
                  ? `${formsFinancieraInvoice.TipoGestion} de tipo ${formsFinancieraInvoice.TipoLegalizacion}`
                  : formsFinancieraInvoice.TipoGestion
                ).toLowerCase()}...`,
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
              this.sharedService.removeWaitTask({
                id: taskId,
              });

              this.sharedService.pushToastMessage({
                id: Utils.makeRandomString(4),
                title: `${(formsFinancieraInvoice.TipoGestion === 'Legalizacion'
                  ? `${formsFinancieraInvoice.TipoGestion} de tipo ${formsFinancieraInvoice.TipoLegalizacion}`
                  : formsFinancieraInvoice.TipoGestion
                ).toLowerCase()} enviada satisfactoriamente`,
                description: `Su ${(formsFinancieraInvoice.TipoGestion ===
                'Legalizacion'
                  ? `${formsFinancieraInvoice.TipoGestion} de tipo ${formsFinancieraInvoice.TipoLegalizacion}`
                  : formsFinancieraInvoice.TipoGestion
                ).toLowerCase()} ha sido ingresada correctamente y sera procesada en un plazo maximo de 10 dias habiles*.`,
                autohide: 30000,
              });
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
        return this.tipoGestion;
      case 2.1:
        return this.tipoLegalizacion;
      case 3:
        if (this.convenio) {
          switch (this.tipoGestion) {
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
