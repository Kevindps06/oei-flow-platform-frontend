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
        let getConveniosFinancieraTaskId: string;
        this.formsService.getConveniosFinanciera().subscribe((httpEvent) => {
          switch (httpEvent.type) {
            case HttpEventType.Sent:
              getConveniosFinancieraTaskId = this.sharedService.pushWaitTask({
                description: 'Cargando convenios...',
                progress: 0,
              }) as string;
              break;
            case HttpEventType.DownloadProgress:
              this.sharedService.pushWaitTask({
                id: getConveniosFinancieraTaskId,
                progress: Math.round(
                  (httpEvent.loaded * 100) / httpEvent.total
                ),
              });
              break;
            case HttpEventType.Response:
              this.convenios = [];

              httpEvent.body.value.forEach((convenio: any) => {
                this.convenios.push({
                  Id: convenio.id,
                  Aliado: convenio.fields.Aliado,
                  Numero: convenio.fields.Numero,
                  Mostrar: convenio.fields.Mostrar,
                });
              });

              this.sharedService.removeWaitTask({
                id: getConveniosFinancieraTaskId,
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
      InformacionAdicional: this.informacionAdicional.replace('"', "'"),
    };

    // Cleaning fields because information has been saved
    this.manejoDatos = false;
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

    let postFormsFinancieraRegistrationTaskId: string;
    this.formsService
      .postFormsFinancieraRegistration(formsFinancieraRegistration)
      .subscribe(
        (httpEvent) => {
          switch (httpEvent.type) {
            case HttpEventType.Sent:
              postFormsFinancieraRegistrationTaskId =
                this.sharedService.pushWaitTask({
                  description: `Enviando registro...`,
                  progress: 0,
                }) as string;
              break;
            case HttpEventType.UploadProgress:
              this.sharedService.pushWaitTask({
                id: postFormsFinancieraRegistrationTaskId,
                progress: Math.round(
                  (httpEvent.loaded * 100) / httpEvent.total
                ),
              });
              break;
            case HttpEventType.Response:
              this.sharedService.pushToastMessage({
                id: Utils.makeRandomString(4),
                title: `Registro enviado satisfactoriamente`,
                description: `Su registro ha sido ingresado correctamente y sera procesado en la mayor brevedad posible, este atento al correo electronico registrado por el cual se le notificara del estado y manera de validacion de la peticion.`,
                autohide: 30000,
              });
              break;
          }
        },
        (httpEventError) => {
          this.sharedService.removeWaitTask({
            id: postFormsFinancieraRegistrationTaskId,
          });
        },
        () => {
          this.sharedService.removeWaitTask({
            id: postFormsFinancieraRegistrationTaskId,
          });
        }
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
