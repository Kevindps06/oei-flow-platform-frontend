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

@Component({
  selector: 'app-forms-financiera-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
})
export class FormsFinancieraInvoiceComponent implements OnInit {
  waitTasks: WaitTask[] = [];
  formIndex: number = 0;

  // 0
  tipoDePersona: string = '';
  tipoDeRelacion: string = '';

  // 1
  identification: string = '';
  digitoDeVerificacion: string = '';
  email: string = '';
  flowUser: any;
  verificationCode: string = '';
  validacionUsuarioError: boolean = false;
  authCode: string = '';
  authValidation: boolean = false;

  // 2
  tipoSoporteContable: string = '';

  // 3
  convenios: Convenio[] = [];
  convenio: string = '';

  cuentaCobroFacturaFiles: FileItem[] = [];

  whenCuentaCobroFacturaFilesChange(event: any) {
    let currentFilesLength = this.cuentaCobroFacturaFiles.length;

    for (let i = 0; event.target.files.length > i; i++) {
      this.cuentaCobroFacturaFiles.push({
        Index: currentFilesLength + i,
        Name: event.target.files[i].name,
        Size: event.target.files[i].size,
        Type: event.target.files[i].type,
        Uploaded: false,
      });

      Utils.getBase64(event.target.files[i]).then((result) => {
        this.cuentaCobroFacturaFiles[currentFilesLength + i].Bytes =
          result as string;
        this.cuentaCobroFacturaFiles[currentFilesLength + i].Uploaded = true;
      });
    }

    event.target.value = null;
  }

  onDeleteCobroFacturaFile(index: number) {
    if (this.cuentaCobroFacturaFiles[index].Uploaded === true) {
      this.cuentaCobroFacturaFiles.splice(index, 1);

      for (let i = 0; this.cuentaCobroFacturaFiles.length > i; i++) {
        this.cuentaCobroFacturaFiles[i].Index = i;
      }
    }
  }

  facturaEquivalenteFiles: FileItem[] = [];

  whenFacturaEquivalenteFilesChange(event: any) {
    let currentFilesLength = this.facturaEquivalenteFiles.length;

    for (let i = 0; event.target.files.length > i; i++) {
      this.facturaEquivalenteFiles.push({
        Index: currentFilesLength + i,
        Name: event.target.files[i].name,
        Size: event.target.files[i].size,
        Type: event.target.files[i].type,
        Uploaded: false,
      });

      Utils.getBase64(event.target.files[i]).then((result) => {
        this.facturaEquivalenteFiles[currentFilesLength + i].Bytes =
          result as string;
        this.facturaEquivalenteFiles[currentFilesLength + i].Uploaded = true;
      });
    }

    event.target.value = null;
  }

  onDeleteFacturaEquivalenteFilesClick(index: number) {
    if (this.facturaEquivalenteFiles[index].Uploaded === true) {
      this.facturaEquivalenteFiles.splice(index, 1);

      for (let i = 0; this.facturaEquivalenteFiles.length > i; i++) {
        this.facturaEquivalenteFiles[i].Index = i;
      }
    }
  }

  seguridadSocialParafiscalesFiles: FileItem[] = [];

  whenSeguridadSocialParafiscalesFilesChange(event: any) {
    let currentFilesLength = this.seguridadSocialParafiscalesFiles.length;

    for (let i = 0; event.target.files.length > i; i++) {
      this.seguridadSocialParafiscalesFiles.push({
        Index: currentFilesLength + i,
        Name: event.target.files[i].name,
        Size: event.target.files[i].size,
        Type: event.target.files[i].type,
        Uploaded: false,
      });

      Utils.getBase64(event.target.files[i]).then((result) => {
        this.seguridadSocialParafiscalesFiles[currentFilesLength + i].Bytes =
          result as string;
        this.seguridadSocialParafiscalesFiles[currentFilesLength + i].Uploaded =
          true;
      });
    }

    event.target.value = null;
  }

  onDeleteSeguridadSocialParafiscalesFilesClick(index: number) {
    if (this.seguridadSocialParafiscalesFiles[index].Uploaded === true) {
      this.seguridadSocialParafiscalesFiles.splice(index, 1);

      for (let i = 0; this.seguridadSocialParafiscalesFiles.length > i; i++) {
        this.seguridadSocialParafiscalesFiles[i].Index = i;
      }
    }
  }

  informeActividadesFiles: FileItem[] = [];

  whenInformeActividadesFilesChange(event: any) {
    let currentFilesLength = this.informeActividadesFiles.length;

    for (let i = 0; event.target.files.length > i; i++) {
      this.informeActividadesFiles.push({
        Index: currentFilesLength + i,
        Name: event.target.files[i].name,
        Size: event.target.files[i].size,
        Type: event.target.files[i].type,
        Uploaded: false,
      });

      Utils.getBase64(event.target.files[i]).then((result) => {
        this.informeActividadesFiles[currentFilesLength + i].Bytes =
          result as string;
        this.informeActividadesFiles[currentFilesLength + i].Uploaded = true;
      });
    }

    event.target.value = null;
  }

  onDeleteInformeActividadesFilesClick(index: number) {
    if (this.informeActividadesFiles[index].Uploaded === true) {
      this.informeActividadesFiles.splice(index, 1);

      for (let i = 0; this.informeActividadesFiles.length > i; i++) {
        this.informeActividadesFiles[i].Index = i;
      }
    }
  }

  infoAdicional: string = '';

  @Output() onWaitTasksChange = new EventEmitter<WaitTask[]>();

  correo!: string;
  tipoPersona!: string;
  tipoRelacion!: string;

  formatoSolicitudAvanceFiles: FileItem[] = [];
  cotizacionesFiles: FileItem[] = [];
  solicitudComisionFiles: FileItem[] = [];
  legalizacion!: string;
  formatoLegalizacionViajesFiles: FileItem[] = [];
  soporteFacturasFiles: FileItem[] = [];
  pasabordosTiquetesAereosFiles: FileItem[] = [];
  formatoSolicitudViajesFiles: FileItem[] = [];
  tipoSoporteContableProveedor!: string;
  tipoLegalizacion!: string;
  NIT!: string;

  camaraComercioFiles: FileItem[] = [];

  constructor(private formsService: FormsService) {}

  ngOnInit(): void {}

  whenFileFormatoSolicitudAvanceChange(event: any) {
    let currentFilesLength = this.formatoSolicitudAvanceFiles.length;

    for (let i = 0; event.target.files.length > i; i++) {
      this.formatoSolicitudAvanceFiles.push({
        Index: currentFilesLength + i,
        Name: event.target.files[i].name,
        Size: event.target.files[i].size,
        Type: event.target.files[i].type,
        Uploaded: false,
      });

      Utils.getBase64(event.target.files[i]).then((result) => {
        this.formatoSolicitudAvanceFiles[currentFilesLength + i].Bytes =
          result as string;
        this.formatoSolicitudAvanceFiles[currentFilesLength + i].Uploaded =
          true;
      });
    }

    event.target.value = null;
  }

  onDeleteFileFormatoSolicitudAvanceClick(index: number) {
    if (this.formatoSolicitudAvanceFiles[index].Uploaded === true) {
      this.formatoSolicitudAvanceFiles.splice(index, 1);

      for (let i = 0; this.formatoSolicitudAvanceFiles.length > i; i++) {
        this.formatoSolicitudAvanceFiles[i].Index = i;
      }
    }
  }

  whenFileCotizacionesChange(event: any) {
    let currentFilesLength = this.cotizacionesFiles.length;

    for (let i = 0; event.target.files.length > i; i++) {
      this.cotizacionesFiles.push({
        Index: currentFilesLength + i,
        Name: event.target.files[i].name,
        Size: event.target.files[i].size,
        Type: event.target.files[i].type,
        Uploaded: false,
      });

      Utils.getBase64(event.target.files[i]).then((result) => {
        this.cotizacionesFiles[currentFilesLength + i].Bytes = result as string;
        this.cotizacionesFiles[currentFilesLength + i].Uploaded = true;
      });
    }

    event.target.value = null;
  }

  onDeleteFileCotizacionesClick(index: number) {
    if (this.cotizacionesFiles[index].Uploaded === true) {
      this.cotizacionesFiles.splice(index, 1);

      for (let i = 0; this.cotizacionesFiles.length > i; i++) {
        this.cotizacionesFiles[i].Index = i;
      }
    }
  }

  whenFileSolicitudComisionChange(event: any) {
    let currentFilesLength = this.solicitudComisionFiles.length;

    for (let i = 0; event.target.files.length > i; i++) {
      this.solicitudComisionFiles.push({
        Index: currentFilesLength + i,
        Name: event.target.files[i].name,
        Size: event.target.files[i].size,
        Type: event.target.files[i].type,
        Uploaded: false,
      });

      Utils.getBase64(event.target.files[i]).then((result) => {
        this.solicitudComisionFiles[currentFilesLength + i].Bytes =
          result as string;
        this.solicitudComisionFiles[currentFilesLength + i].Uploaded = true;
      });
    }

    event.target.value = null;
  }

  onDeleteFileSolicitudComisionClick(index: number) {
    if (this.solicitudComisionFiles[index].Uploaded === true) {
      this.solicitudComisionFiles.splice(index, 1);

      for (let i = 0; this.solicitudComisionFiles.length > i; i++) {
        this.solicitudComisionFiles[i].Index = i;
      }
    }
  }

  whenFileFormatoLegalizacionViajesChange(event: any) {
    let currentFilesLength = this.formatoLegalizacionViajesFiles.length;

    for (let i = 0; event.target.files.length > i; i++) {
      this.formatoLegalizacionViajesFiles.push({
        Index: currentFilesLength + i,
        Name: event.target.files[i].name,
        Size: event.target.files[i].size,
        Type: event.target.files[i].type,
        Uploaded: false,
      });

      Utils.getBase64(event.target.files[i]).then((result) => {
        this.formatoLegalizacionViajesFiles[currentFilesLength + i].Bytes =
          result as string;
        this.formatoLegalizacionViajesFiles[currentFilesLength + i].Uploaded =
          true;
      });
    }

    event.target.value = null;
  }

  onDeleteFileFormatoLegalizacionViajesClick(index: number) {
    if (this.formatoLegalizacionViajesFiles[index].Uploaded === true) {
      this.formatoLegalizacionViajesFiles.splice(index, 1);

      for (let i = 0; this.formatoLegalizacionViajesFiles.length > i; i++) {
        this.formatoLegalizacionViajesFiles[i].Index = i;
      }
    }
  }

  whenFileSoporteFacturasChange(event: any) {
    let currentFilesLength = this.soporteFacturasFiles.length;

    for (let i = 0; event.target.files.length > i; i++) {
      this.soporteFacturasFiles.push({
        Index: currentFilesLength + i,
        Name: event.target.files[i].name,
        Size: event.target.files[i].size,
        Type: event.target.files[i].type,
        Uploaded: false,
      });

      Utils.getBase64(event.target.files[i]).then((result) => {
        this.soporteFacturasFiles[currentFilesLength + i].Bytes =
          result as string;
        this.soporteFacturasFiles[currentFilesLength + i].Uploaded = true;
      });
    }

    event.target.value = null;
  }

  onDeleteFileSoporteFacturasClick(index: number) {
    if (this.soporteFacturasFiles[index].Uploaded === true) {
      this.soporteFacturasFiles.splice(index, 1);

      for (let i = 0; this.soporteFacturasFiles.length > i; i++) {
        this.soporteFacturasFiles[i].Index = i;
      }
    }
  }

  whenFilePasabordosTiquetesAereosChange(event: any) {
    let currentFilesLength = this.pasabordosTiquetesAereosFiles.length;

    for (let i = 0; event.target.files.length > i; i++) {
      this.pasabordosTiquetesAereosFiles.push({
        Index: currentFilesLength + i,
        Name: event.target.files[i].name,
        Size: event.target.files[i].size,
        Type: event.target.files[i].type,
        Uploaded: false,
      });

      Utils.getBase64(event.target.files[i]).then((result) => {
        this.pasabordosTiquetesAereosFiles[currentFilesLength + i].Bytes =
          result as string;
        this.pasabordosTiquetesAereosFiles[currentFilesLength + i].Uploaded =
          true;
      });
    }

    event.target.value = null;
  }

  onDeleteFilePasabordosTiquetesAereosClick(index: number) {
    if (this.pasabordosTiquetesAereosFiles[index].Uploaded === true) {
      this.pasabordosTiquetesAereosFiles.splice(index, 1);

      for (let i = 0; this.pasabordosTiquetesAereosFiles.length > i; i++) {
        this.pasabordosTiquetesAereosFiles[i].Index = i;
      }
    }
  }

  whenFileFormatoSolicitudViajesChange(event: any) {
    let currentFilesLength = this.formatoSolicitudViajesFiles.length;

    for (let i = 0; event.target.files.length > i; i++) {
      this.formatoSolicitudViajesFiles.push({
        Index: currentFilesLength + i,
        Name: event.target.files[i].name,
        Size: event.target.files[i].size,
        Type: event.target.files[i].type,
        Uploaded: false,
      });

      Utils.getBase64(event.target.files[i]).then((result) => {
        this.formatoSolicitudViajesFiles[currentFilesLength + i].Bytes =
          result as string;
        this.formatoSolicitudViajesFiles[currentFilesLength + i].Uploaded =
          true;
      });
    }

    event.target.value = null;
  }

  onDeleteFileFormatoSolicitudViajesClick(index: number) {
    if (this.formatoSolicitudViajesFiles[index].Uploaded === true) {
      this.formatoSolicitudViajesFiles.splice(index, 1);

      for (let i = 0; this.formatoSolicitudViajesFiles.length > i; i++) {
        this.formatoSolicitudViajesFiles[i].Index = i;
      }
    }
  }

  whenFileCamaraComercioChange(event: any) {
    let currentFilesLength = this.camaraComercioFiles.length;

    for (let i = 0; event.target.files.length > i; i++) {
      this.camaraComercioFiles.push({
        Index: currentFilesLength + i,
        Name: event.target.files[i].name,
        Size: event.target.files[i].size,
        Type: event.target.files[i].type,
        Uploaded: false,
      });

      Utils.getBase64(event.target.files[i]).then((result) => {
        this.camaraComercioFiles[currentFilesLength + i].Bytes =
          result as string;
        this.camaraComercioFiles[currentFilesLength + i].Uploaded = true;
      });
    }

    event.target.value = null;
  }

  onDeleteFileCamaraComercioFileClick(index: number) {
    if (this.camaraComercioFiles[index].Uploaded === true) {
      this.camaraComercioFiles.splice(index, 1);

      for (let i = 0; this.camaraComercioFiles.length > i; i++) {
        this.camaraComercioFiles[i].Index = i;
      }
    }
  }

  onFieldChange() {
    this.flowUser = undefined;
    this.validacionUsuarioError = false;

    this.btnPrevious = this.formIndex > 0;
    this.btnNext = this.isValid(this.formIndex) ? true : false;
  }

  btnValidarUsuarioClick() {
    var taskId: string;
    this.formsService
      .validateFlowUser(
        this.tipoDePersona,
        this.tipoDeRelacion,
        this.tipoDePersona === 'Juridica'
          ? `${this.identification}-${this.digitoDeVerificacion}`
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

              this.btnNext = this.isValid(this.formIndex) ? true : false;
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

            this.btnNext = this.isValid(this.formIndex) ? true : false;
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

  btnPrevious: boolean = false;

  btnPreviousClick() {
    this.formIndex--;
    this.btnPrevious = this.formIndex !== 0;
  }

  btnNext: boolean = false;

  btnNextClick() {
    this.btnPrevious = true;
    this.btnNext = false;
    this.formIndex++;

    if (this.formIndex === 3) {
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
    }
  }

  btnSubmitClick() {
    let data = {
      Id: Utils.makeRandomString(32),
      TipoPersona: this.tipoDePersona,
      TipoRelacion: this.tipoDeRelacion,
      TipoSoporteContable: this.tipoSoporteContable,
      Identificador:
        this.tipoDePersona === 'Natural'
          ? this.identification
          : `${this.identification}-${this.digitoDeVerificacion}`,
      InformacionAdicional: this.infoAdicional,
      Convenio: this.convenio,
    };

    switch (this.tipoSoporteContable) {
      case 'Cuenta de cobro':
      case 'Factura o cuenta de cobro':
        data = Object.assign(data, {
          0: this.cuentaCobroFacturaFiles,
          1: this.facturaEquivalenteFiles,
          2: this.seguridadSocialParafiscalesFiles,
          3: this.informeActividadesFiles,
        });
        break;
    }

    var taskId: string;
    this.formsService
      .postFormsFinancieraInvoice({
        data,
      })
      .subscribe((event) => {
        switch (event.type) {
          case HttpEventType.Sent:
            break;
          case HttpEventType.UploadProgress:
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
  }

  isValid(formIndex: number) {
    switch (formIndex) {
      case 0:
        if (this.tipoDePersona === 'Juridica') {
          this.tipoDeRelacion = 'Proveedor';
        }

        return this.tipoDePersona && this.tipoDeRelacion;
      case 1:
        return this.flowUser;
      case 2:
        return this.tipoSoporteContable;
    }

    return false;
  }

  validateEmail(email: string): boolean {
    return Utils.validateEmail(email);
  }

  isDevMode() {
    return isDevMode();
  }
}
