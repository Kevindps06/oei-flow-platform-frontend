import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Convenio } from 'src/app/interfaces/Convenio';
import { FileItem } from 'src/app/interfaces/FileItem';
import { Utils } from 'src/app/classes/utils';
import { FormsJuridicaContratacionConvenioRequest } from 'src/app/interfaces/forms-juridica-contratacion-convenio-request'
import { FormsService } from 'src/app/services/forms.service';
import { HttpEventType } from '@angular/common/http';
import { WaitTask } from 'src/app/interfaces/WaitTask';

@Component({
  selector: 'app-forms-juridica-contratacion-convenio-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css'],
})
export class FormsJuridicaContratacionConvenioRequestComponent
  implements OnInit
{
  waitTasks: WaitTask[] = [];

  @Input() convenios!: Convenio[];

  numero!: string;
  nombre!: string;
  adjuntosFiles: FileItem[] = [];

  @Output() onWaitTasksChange = new EventEmitter<WaitTask[]>();

  constructor(private formsService: FormsService) {}

  ngOnInit(): void {}

  whenFileAdjuntosChange(event: any) {
    let currentFilesLength = this.adjuntosFiles.length;

    for (let i = 0; event.target.files.length > i; i++) {
      this.adjuntosFiles.push({
        Index: currentFilesLength + i,
        Name: event.target.files[i].name,
        Size: event.target.files[i].size,
        Type: event.target.files[i].type,
        Uploaded: false,
      });

      Utils.getBase64(event.target.files[i]).then((result) => {
        this.adjuntosFiles[currentFilesLength + i].Bytes = result as string;
        this.adjuntosFiles[currentFilesLength + i].Uploaded = true;
      });
    }

    event.target.value = null;
  }

  whenDeleteFileAdjuntosClick(index: number) {
    if (this.adjuntosFiles[index].Uploaded === true) {
      this.adjuntosFiles.splice(index, 1);

      for (let i = 0; this.adjuntosFiles.length > i; i++) {
        this.adjuntosFiles[i].Index = i;
      }
    }
  }

  whenSubmit() {
    const formsJuridicaContratacionConvenio: FormsJuridicaContratacionConvenioRequest =
      {
        id: Utils.makeRandomString(64),
        operation: 'juridica-contratacion-convenio',
        username: 'aescobar@contratista.oei.org.co',
        password: '',
        number: this.numero,
        name: this.nombre,
        filesFields: [
          {
            key: "Adjuntos",
            value: this.adjuntosFiles,
          },
        ],
        additionalInfo: '',
        keys: [
          "id", "operation", "username", "password", "number", "name", "filesFields"
        ]
      };

    var taskId: string;
    this.formsService
      .postFormsJuridicaContratacionConvenioRequest(
        formsJuridicaContratacionConvenio
      )
      .subscribe((event) => {
        switch (event.type) {
          case HttpEventType.Sent:
            taskId = Utils.makeRandomString(4);
            this.waitTasks.push({
              id: taskId,
              description: 'Enviando información...',
              total: 0,
              current: 0,
              progress: 0,
            });
            this.onWaitTasksChange.emit(this.waitTasks);
            break;
          case HttpEventType.UploadProgress:
            let taskIndex = this.waitTasks.findIndex(
              (element) => element.id === taskId
            );
            this.waitTasks[taskIndex].total = event.total;
            this.waitTasks[taskIndex].current = event.loaded;
            this.waitTasks[taskIndex].progress = Math.round(
              (event.loaded * 100) / event.total
            );
            this.onWaitTasksChange.emit(this.waitTasks);
            break;
          case HttpEventType.Response:
            this.waitTasks.splice(
              this.waitTasks.findIndex((element) => element.id === taskId),
              1
            );
            this.onWaitTasksChange.emit(this.waitTasks);
            break;
        }
      });
  }
}
