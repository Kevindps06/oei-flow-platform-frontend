import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Utils } from 'src/app/classes/utils';
import { Convenio } from 'src/app/interfaces/Convenio';
import { FileItem } from 'src/app/interfaces/FileItem';
import { FormsCoordinacionLogistica } from 'src/app/interfaces/forms-coordinacionlogistica';
import { WaitTask } from 'src/app/interfaces/WaitTask';
import { FormsService } from 'src/app/services/forms.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-forms-coordinacionlogistica',
  templateUrl: './coordinacionlogistica.component.html',
  styleUrls: ['./coordinacionlogistica.component.css'],
})
export class FormsCoordinacionLogisticaComponent implements OnInit {
  convenios: Convenio[] = [];

  nombre: string = '';
  convenio: string = '';

  fechaIda!: Date;

  setFechaIda(fechaIda: Date) {
    this.fechaIda = fechaIda;
  }

  horaIda!: String;

  fechaVuelta: Date | undefined;

  setFechaVuelta(fechaVuelta: Date) {
    this.fechaVuelta = fechaVuelta;
  }

  horaVuelta!: String;

  identification: string = '';

  fechaNacimiento!: Date;

  setFechaNacimiento(fechaNacimiento: Date) {
    this.fechaNacimiento = fechaNacimiento;
  }

  equipajeAdicional: boolean = false;
  email: string = '';
  telefono: string = '';

  pasaporteFiles: FileItem[] = [];

  setPasaporteFiles(pasaporteFiles: FileItem[]) {
    this.pasaporteFiles = pasaporteFiles;
  }

  cedulaFiles: FileItem[] = [];

  setCedulaFiles(cedulaFiles: FileItem[]) {
    this.cedulaFiles = cedulaFiles;
  }

  infoAdicional: string = '';

  @Output() onWaitTasksChange = new EventEmitter<WaitTask[]>();

  constructor(
    private router: Router,
    private formsService: FormsService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    if (!history.state.userInfo || !history.state.plaftformInfo) {
      this.router.navigateByUrl('/login');

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
    }
  }

  btnSubmitClick() {
    const formsCoordinacionLogistica: FormsCoordinacionLogistica = {
      Id: Utils.makeRandomString(32),
      Nombre: this.nombre,
      Convenio: this.convenio,
      Ida: this.fechaIda,
      HorarioIda: this.horaIda,
      Vuelta: this.fechaVuelta,
      HorarioVuelta: this.horaVuelta,
      Identificator: this.identification,
      FechaNacimiento: this.fechaNacimiento,
      EquipajeAdicional: this.equipajeAdicional,
      Email: this.email,
      Telefono: this.telefono,
      PasaporteFiles: this.pasaporteFiles,
      CedulaFiles: this.cedulaFiles,
      InformacionAdicional: this.infoAdicional,
      Requestor: history.state.userInfo,
    };

    var taskId: string;
    this.formsService
      .postFormsCoordinacionLogistica(formsCoordinacionLogistica)
      .subscribe(
        (event) => {
          switch (event.type) {
            case HttpEventType.Sent:
              taskId = Utils.makeRandomString(4);
              this.sharedService.pushWaitTask({
                id: taskId,
                description: `Enviando coordinacion logistica...`,
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
                description: `Obteniendo la respuesta del envio de la coordinacion logistica...`,
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
                title: `Coordinacion logistica enviada satisfactoriamente`,
                description: `Su coordinacion logistica ha sido ingresada correctamente y sera procesada muy pronto, este atento de su correo electronico por el cual se le notificara del estado y manera de validacion de la peticion.`,
                autohide: 30000,
              });

              this.router.navigateByUrl('/');
              break;
          }
        },
        (err) => {}
      );
  }

  validateEmail(email: string = this.email): boolean {
    return Utils.validateEmail(email);
  }

  isValid() {
    return this.nombre &&
      this.convenio &&
      this.fechaIda &&
      this.horaIda &&
      this.fechaVuelta
      ? this.horaVuelta
      : true &&
          (this.identification.length === 8 ||
            this.identification.length === 10) &&
          this.fechaNacimiento &&
          Utils.validateEmail(this.email) &&
          this.telefono.length === 10 &&
          Utils.validateFiles(this.pasaporteFiles) &&
          Utils.validateFiles(this.cedulaFiles);
  }
}
