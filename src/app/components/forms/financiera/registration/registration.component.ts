import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Utils } from 'src/app/classes/utils';
import { Convenio } from 'src/app/interfaces/Convenio';
import { FileItem } from 'src/app/interfaces/FileItem';
import { FormsFinancieraRegistration } from 'src/app/interfaces/forms-financiera-registration';
import { WaitTask } from 'src/app/interfaces/WaitTask';
import { FormsService } from 'src/app/services/forms.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-forms-financiera-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class FormsFinancieraRegistrationComponent implements OnInit {
  formIndex: number = 0;

  // 0
  tipoPersona: string = '';

  tipoRelacion: string = '';

  setTipoRelacion(tipoRelacion: string) {
    this.tipoRelacion = tipoRelacion;
  }

  // 1
  identification: string = '';
  digitoVerificacion: string = '';
  email: string = '';

  // 2
  convenios: Convenio[] = [];
  convenio: string = '';

  nombre: string = '';

  // Natural

  rutFiles: FileItem[] = [];

  setRutFiles(rutFiles: FileItem[]) {
    this.rutFiles = rutFiles;
  }

  cedulaFiles: FileItem[] = [];

  setCedulaFiles(cedulaFiles: FileItem[]) {
    this.cedulaFiles = cedulaFiles;
  }

  certificacionBancariaFiles: FileItem[] = [];

  setCertificacionBancariaFiles(certificacionBancariaFiles: FileItem[]) {
    this.certificacionBancariaFiles = certificacionBancariaFiles;
  }

  informacionAdicional: string = '';
  manejoDatos: boolean = false;

  @Output() onWaitTasksChange = new EventEmitter<WaitTask[]>();

  constructor(
    private formsService: FormsService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {}

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
        break;
      case 1:
        // Reset form index 2 values
        this.convenio = '';
        this.nombre = '';
        this.rutFiles = [];
        this.cedulaFiles = [];
        this.certificacionBancariaFiles = [];

        // Load form index 2 values
        let taskId: string;
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
              this.convenios = []

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
    }

    this.formIndex++;
  }

  btnSubmitClick() {
    let formsFinancieraRegistration: FormsFinancieraRegistration = {
      Id: Utils.makeRandomString(32),
      TipoPersona: this.tipoPersona,
      TipoRelacion: this.tipoRelacion,
      Identificator:
        this.tipoPersona === 'Natural'
          ? this.identification
          : `${this.identification}-${this.digitoVerificacion}`,
      Email: this.email,
      Convenio: this.convenio,
      Nombre: this.nombre,
      RutFiles: this.rutFiles,
      CedulaFiles: this.cedulaFiles,
      CertificacionBancariaFiles: this.certificacionBancariaFiles,
      InformacionAdicional: this.informacionAdicional,
    };

    // Cleaning fields because information has been saved
    this.manejoDatos = false
    this.informacionAdicional = '';
    this.certificacionBancariaFiles = [];
    this.cedulaFiles = [];
    this.rutFiles = [];
    this.nombre = '';
    this.convenio = '';
    this.email = '';
    this.digitoVerificacion = '';
    this.identification = '';
    this.tipoRelacion = '';
    this.tipoPersona = '';

    this.formIndex = 0;

    var taskId: string;
    this.formsService
      .postFormsFinancieraRegistration(formsFinancieraRegistration)
      .subscribe(
        (event) => {
          switch (event.type) {
            case HttpEventType.Sent:
              this.sharedService.pushWaitTask({
                id: (taskId = Utils.makeRandomString(4)),
                description: `Enviando registro...`,
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
                description: `Obteniendo la respuesta del envio del registro...`,
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
                title: `Registro enviado satisfactoriamente`,
                description: `Su registro ha sido ingresado correctamente y sera procesado en un plazo maximo de 10 dias habiles*, este atento de su correo electronico por el cual se le notificara del estado y manera de validacion de la peticion.`,
                autohide: 30000,
              });
              break;
          }
        },
        (err) => {}
      );
  }

  validateEmail(email: string): boolean {
    return Utils.validateEmail(email);
  }

  isValid(formIndex: number = this.formIndex) {
    switch (formIndex) {
      case 0:
        return this.tipoPersona && this.tipoRelacion;
      case 1:
        return (
          (this.tipoPersona === 'Natural'
            ? this.identification.length === 8 ||
              this.identification.length === 10
            : this.identification.length === 9 &&
              this.digitoVerificacion.length === 1) &&
          Utils.validateEmail(this.email)
        );
      case 2:
        return (
          this.convenio &&
          this.nombre &&
          Utils.validateFiles(this.rutFiles) &&
          Utils.validateFiles(this.cedulaFiles) &&
          Utils.validateFiles(this.certificacionBancariaFiles) &&
          this.manejoDatos
        );
      default:
        return false;
    }
  }
}
