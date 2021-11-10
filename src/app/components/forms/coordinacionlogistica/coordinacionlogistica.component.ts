import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Utils } from 'src/app/classes/utils';
import { Convenio } from 'src/app/interfaces/Convenio';
import { FileItem } from 'src/app/interfaces/FileItem';
import { FormsCoordinacionLogistica } from 'src/app/interfaces/forms-coordinacionlogistica';
import { WaitTask } from 'src/app/interfaces/WaitTask';
import { FormsService } from 'src/app/services/forms.service';

@Component({
  selector: 'app-forms-coordinacionlogistica',
  templateUrl: './coordinacionlogistica.component.html',
  styleUrls: ['./coordinacionlogistica.component.css'],
})
export class CoordinacionLogisticaComponent implements OnInit {
  waitTasks: WaitTask[] = [];

  convenios: Convenio[] = [];

  nombre: string = '';
  convenio: string = '';

  fechaIda!: Date;

  setFechaIda(fechaIda: Date) {
    this.fechaIda = fechaIda;
  }

  fechaVuelta: Date | undefined;

  setFechaVuelta(fechaVuelta: Date) {
    this.fechaVuelta = fechaVuelta;
  }

  identification: string = '';
  equipajeAdicional: boolean = false;
  email: string = '';
  telefono: string = '';

  pasaporteFiles: FileItem[] = [];

  setPasaporteFiles(pasaporteFiles: FileItem[]) {
    this.pasaporteFiles = pasaporteFiles;
  }

  infoAdicional: string = '';

  @Output() onWaitTasksChange = new EventEmitter<WaitTask[]>();

  constructor(private router: Router, private formsService: FormsService) {}

  ngOnInit(): void {
    if (!history.state.Convenios) {
      this.router.navigateByUrl('/login');
      return;
    }

    for (let i = 0; history.state.Convenios.length > i; i++) {
      this.convenios.push({
        Id: history.state.Convenios[i].id,
        Aliado: history.state.Convenios[i].fields.field_Aliado,
        Numero: history.state.Convenios[i].fields.field_Numero,
        Mostrar: history.state.Convenios[i].fields.field_Mostrar,
      });
    }
  }

  btnSubmitClick() {
    const formsCoordinacionLogistica: FormsCoordinacionLogistica = {
      Id: Utils.makeRandomString(32),
      Nombre: this.nombre,
      Convenio: this.convenio,
      Ida: this.fechaIda,
      Vuelta: this.fechaVuelta,
      Identificator: this.identification,
      EquipajeAdicional: this.equipajeAdicional,
      Email: this.email,
      Telefono: this.telefono,
      PasaporteFiles: this.pasaporteFiles,
      InformacionAdicional: this.infoAdicional,
    };

    var taskId: string;
    this.formsService
      .postFormsCoordinacionLogistica(formsCoordinacionLogistica)
      .subscribe(
        (event) => {
          let taskIndex;
          switch (event.type) {
            case HttpEventType.Sent:
              taskId = Utils.makeRandomString(4);
              this.waitTasks.push({
                id: taskId,
                description: `Enviando coordinacion logistica...`,
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
    return (
      this.nombre &&
      this.convenio &&
      this.fechaIda &&
      (this.identification.length === 8 || this.identification.length === 10) &&
      Utils.validateEmail(this.email) &&
      this.telefono.length === 10 &&
      this.pasaporteFiles.length > 0
    );
  }
}
