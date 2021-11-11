import { HttpEventType } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Utils } from 'src/app/classes/utils';
import { Convenio } from 'src/app/interfaces/Convenio';
import { FileItem } from 'src/app/interfaces/FileItem';
import { FormsFinancieraRegistration } from 'src/app/interfaces/forms-financiera-registration';
import { WaitTask } from 'src/app/interfaces/WaitTask';
import { FormsService } from 'src/app/services/forms.service';

@Component({
  selector: 'app-forms-financiera-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class FormsFinancieraRegistrationComponent implements OnInit {
  waitTasks: WaitTask[] = [];
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

  constructor(private formsService: FormsService) {}

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
                (event.loaded * 100) / event.total
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
    this.informacionAdicional = '';
    this.certificacionBancariaFiles = [];
    this.cedulaFiles = [];
    this.rutFiles = [];
    this.nombre = '';
    this.convenio = '';
    this.email = '';
    this.digitoVerificacion = ''
    this.identification = ''
    this.tipoRelacion = '';
    this.tipoPersona = '';

    this.formIndex = 0;

    var taskId: string;
    this.formsService
      .postFormsFinancieraRegistration(formsFinancieraRegistration)
      .subscribe(
        (event) => {
          let taskIndex;
          switch (event.type) {
            case HttpEventType.Sent:
              taskId = Utils.makeRandomString(4);
              this.waitTasks.push({
                id: taskId,
                description: `Enviando registro...`,
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
                (event.loaded * 100) / event.total
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
