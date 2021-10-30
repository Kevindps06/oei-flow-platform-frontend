import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Convenio } from 'src/app/interfaces/Convenio';
import { FileItem } from 'src/app/interfaces/FileItem';
import { FormsFinancieraRegistration } from 'src/app/interfaces/forms-financiera-registration';

@Component({
  selector: 'app-forms-financiera-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class FormsFinancieraRegistrationComponent implements OnInit {
  @Input() convenios: Convenio[] = [];

  tipoDePersona!: string;
  tipoDeRelacion!: string;
  convenio!: string;
  identificacion!: string;
  nombre!: string;
  rutFiles: FileItem[] = [];
  cedulaFiles: FileItem[] = [];
  certificacionBancariaFiles: FileItem[] = [];
  email!: string;
  informacionAdicional!: string;
  manejoDeDatos: boolean = false;

  @Output() onSubmit = new EventEmitter<FormsFinancieraRegistration>();

  constructor() {}

  ngOnInit(): void {}

  getBase64(file: File) {
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = function (e) {
        resolve((reader.result as string).split(',')[1]);
      };
      reader.readAsDataURL(file);
    });
  }

  whenFileRUTChange(event: any) {
    let currentFilesLength = this.rutFiles.length;

    for (let i = 0; event.target.files.length > i; i++) {
      this.rutFiles.push({
        Index: currentFilesLength + i,
        Name: event.target.files[i].name,
        Size: event.target.files[i].size,
        Type: event.target.files[i].type,
        Uploaded: false,
      });

      this.getBase64(event.target.files[i]).then((result) => {
        this.rutFiles[currentFilesLength + i].Bytes = result as string;
        this.rutFiles[currentFilesLength + i].Uploaded = true;
      });
    }

    event.target.value = null;
  }

  onDeleteFileRUTClick(index: number) {
    if (this.rutFiles[index].Uploaded === true) {
      this.rutFiles.splice(index, 1);

      for (let i = 0; this.rutFiles.length > i; i++) {
        this.rutFiles[i].Index = i;
      }
    }
  }

  whenFileCedulaChange(event: any) {
    let currentFilesLength = this.cedulaFiles.length;

    for (let i = 0; event.target.files.length > i; i++) {
      this.cedulaFiles.push({
        Index: currentFilesLength + i,
        Name: event.target.files[i].name,
        Size: event.target.files[i].size,
        Type: event.target.files[i].type,
        Uploaded: false,
      });

      this.getBase64(event.target.files[i]).then((result) => {
        this.cedulaFiles[currentFilesLength + i].Bytes = result as string;
        this.cedulaFiles[currentFilesLength + i].Uploaded = true;
      });
    }

    event.target.value = null;
  }

  onDeleteFileCedulaClick(index: number) {
    if (this.cedulaFiles[index].Uploaded === true) {
      this.cedulaFiles.splice(index, 1);

      for (let i = 0; this.cedulaFiles.length > i; i++) {
        this.cedulaFiles[i].Index = i;
      }
    }
  }

  whenFileCertificacionBancariaChange(event: any) {
    let currentFilesLength = this.certificacionBancariaFiles.length;

    for (let i = 0; event.target.files.length > i; i++) {
      this.certificacionBancariaFiles.push({
        Index: currentFilesLength + i,
        Name: event.target.files[i].name,
        Size: event.target.files[i].size,
        Type: event.target.files[i].type,
        Uploaded: false,
      });

      this.getBase64(event.target.files[i]).then((result) => {
        this.certificacionBancariaFiles[currentFilesLength + i].Bytes =
          result as string;
        this.certificacionBancariaFiles[currentFilesLength + i].Uploaded = true;
      });
    }

    event.target.value = null;
  }

  onDeleteFileCertificacionBancariaClick(index: number) {
    if (this.certificacionBancariaFiles[index].Uploaded === true) {
      this.certificacionBancariaFiles.splice(index, 1);

      for (let i = 0; this.certificacionBancariaFiles.length > i; i++) {
        this.certificacionBancariaFiles[i].Index = i;
      }
    }
  }

  whenSubmit() {
    const newFinancieraRegistrationForm: FormsFinancieraRegistration = {
      'Tipo de persona': this.tipoDePersona,
      'Tipo de relacion': this.tipoDeRelacion,
      'CC/NIT': this.identificacion,
      Convenio: this.convenio,
      'Nombre o razon social': this.nombre,
      RUT: this.rutFiles,
      Cedula: this.cedulaFiles,
      'Certificacion bancaria': this.certificacionBancariaFiles,
      'Email de contacto': this.email,
      'Informacion adicional': this.informacionAdicional,
      'Manejo de datos': 'Acepto',
    };

    this.onSubmit.emit(newFinancieraRegistrationForm);
  }
}
