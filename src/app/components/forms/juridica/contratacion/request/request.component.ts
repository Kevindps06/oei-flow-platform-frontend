import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Convenio } from 'src/app/interfaces/Convenio';
import { FileItem } from 'src/app/interfaces/FileItem';
import { FormsJuridicaContratacionRequest } from 'src/app/interfaces/forms-juridica-contratacion-request';

@Component({
  selector: 'app-forms-juridica-contratacion-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css'],
})
export class FormsJuridicaContratacionRequestComponent implements OnInit {
  @Input() convenios: Convenio[] = [];

  tipoDePersona!: string;
  tipoDeRelacion!: string;
  convenio!: string;
  identificacion!: string;
  ocupacion!: string;
  valorContrato!: string;
  nombresApellidos!: string;
  direccion!: string;
  telefono!: string;
  fotocopiaCedulaFiles: FileItem[] = [];
  rutFiles: FileItem[] = [];
  certificacionBancariaFiles: FileItem[] = [];
  afiliacionSaludFiles: FileItem[] = [];
  afiliacionPensionFiles: FileItem[] = [];
  ARLFiles: FileItem[] = [];
  tarjetaProfesionalFiles: FileItem[] = [];
  hojaDeVidaFiles: FileItem[] = [];
  soportesHojaDeVidaFiles: FileItem[] = [];
  terminosDeReferenciaFiles: FileItem[] = [];
  justificacionContratistaFiles: FileItem[] = [];
  examenSaludOcupacionalFiles: FileItem[] = [];
  actaCumplimientoYConocimientoFiles: FileItem[] = [];

  @Output() onSubmit = new EventEmitter<FormsJuridicaContratacionRequest>();

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

  whenFileFotocopiaCedulaChange(event: any) {
    let currentFilesLength = this.fotocopiaCedulaFiles.length;

    for (let i = 0; event.target.files.length > i; i++) {
      this.fotocopiaCedulaFiles.push({
        Index: currentFilesLength + i,
        Name: event.target.files[i].name,
        Size: event.target.files[i].size,
        Type: event.target.files[i].type,
        Uploaded: false,
      });

      this.getBase64(event.target.files[i]).then((result) => {
        this.fotocopiaCedulaFiles[currentFilesLength + i].Bytes =
          result as string;
        this.fotocopiaCedulaFiles[currentFilesLength + i].Uploaded = true;
      });
    }

    event.target.value = null;
  }

  onDeleteFileFotocopiaCedulaClick(index: number) {
    if (this.fotocopiaCedulaFiles[index].Uploaded === true) {
      this.fotocopiaCedulaFiles.splice(index, 1);

      for (let i = 0; this.fotocopiaCedulaFiles.length > i; i++) {
        this.fotocopiaCedulaFiles[i].Index = i;
      }
    }
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

  whenFileAfiliacionSaludChange(event: any) {
    let currentFilesLength = this.afiliacionSaludFiles.length;

    for (let i = 0; event.target.files.length > i; i++) {
      this.afiliacionSaludFiles.push({
        Index: currentFilesLength + i,
        Name: event.target.files[i].name,
        Size: event.target.files[i].size,
        Type: event.target.files[i].type,
        Uploaded: false,
      });

      this.getBase64(event.target.files[i]).then((result) => {
        this.afiliacionSaludFiles[currentFilesLength + i].Bytes = result as string;
        this.afiliacionSaludFiles[currentFilesLength + i].Uploaded = true;
      });
    }

    event.target.value = null;
  }

  onDeleteFileAfiliacionSaludClick(index: number) {
    if (this.afiliacionSaludFiles[index].Uploaded === true) {
      this.afiliacionSaludFiles.splice(index, 1);

      for (let i = 0; this.afiliacionSaludFiles.length > i; i++) {
        this.afiliacionSaludFiles[i].Index = i;
      }
    }
  }

  whenFileAfiliacionPensionChange(event: any) {
    let currentFilesLength = this.afiliacionPensionFiles.length;

    for (let i = 0; event.target.files.length > i; i++) {
      this.afiliacionPensionFiles.push({
        Index: currentFilesLength + i,
        Name: event.target.files[i].name,
        Size: event.target.files[i].size,
        Type: event.target.files[i].type,
        Uploaded: false,
      });

      this.getBase64(event.target.files[i]).then((result) => {
        this.afiliacionPensionFiles[currentFilesLength + i].Bytes = result as string;
        this.afiliacionPensionFiles[currentFilesLength + i].Uploaded = true;
      });
    }

    event.target.value = null;
  }

  onDeleteFileAfiliacionPensionClick(index: number) {
    if (this.afiliacionPensionFiles[index].Uploaded === true) {
      this.afiliacionPensionFiles.splice(index, 1);

      for (let i = 0; this.afiliacionPensionFiles.length > i; i++) {
        this.afiliacionPensionFiles[i].Index = i;
      }
    }
  }

  whenFileARLChange(event: any) {
    let currentFilesLength = this.ARLFiles.length;

    for (let i = 0; event.target.files.length > i; i++) {
      this.ARLFiles.push({
        Index: currentFilesLength + i,
        Name: event.target.files[i].name,
        Size: event.target.files[i].size,
        Type: event.target.files[i].type,
        Uploaded: false,
      });

      this.getBase64(event.target.files[i]).then((result) => {
        this.ARLFiles[currentFilesLength + i].Bytes = result as string;
        this.ARLFiles[currentFilesLength + i].Uploaded = true;
      });
    }

    event.target.value = null;
  }

  onDeleteFileARLClick(index: number) {
    if (this.ARLFiles[index].Uploaded === true) {
      this.ARLFiles.splice(index, 1);

      for (let i = 0; this.ARLFiles.length > i; i++) {
        this.ARLFiles[i].Index = i;
      }
    }
  }

  whenFileTarjetaProfesionalChange(event: any) {
    let currentFilesLength = this.tarjetaProfesionalFiles.length;

    for (let i = 0; event.target.files.length > i; i++) {
      this.tarjetaProfesionalFiles.push({
        Index: currentFilesLength + i,
        Name: event.target.files[i].name,
        Size: event.target.files[i].size,
        Type: event.target.files[i].type,
        Uploaded: false,
      });

      this.getBase64(event.target.files[i]).then((result) => {
        this.tarjetaProfesionalFiles[currentFilesLength + i].Bytes = result as string;
        this.tarjetaProfesionalFiles[currentFilesLength + i].Uploaded = true;
      });
    }

    event.target.value = null;
  }

  onDeleteFileTarjetaProfesionalClick(index: number) {
    if (this.tarjetaProfesionalFiles[index].Uploaded === true) {
      this.tarjetaProfesionalFiles.splice(index, 1);

      for (let i = 0; this.tarjetaProfesionalFiles.length > i; i++) {
        this.tarjetaProfesionalFiles[i].Index = i;
      }
    }
  }

  whenFileHojaDeVidaChange(event: any) {
    let currentFilesLength = this.hojaDeVidaFiles.length;

    for (let i = 0; event.target.files.length > i; i++) {
      this.hojaDeVidaFiles.push({
        Index: currentFilesLength + i,
        Name: event.target.files[i].name,
        Size: event.target.files[i].size,
        Type: event.target.files[i].type,
        Uploaded: false,
      });

      this.getBase64(event.target.files[i]).then((result) => {
        this.hojaDeVidaFiles[currentFilesLength + i].Bytes = result as string;
        this.hojaDeVidaFiles[currentFilesLength + i].Uploaded = true;
      });
    }

    event.target.value = null;
  }

  onDeleteFileHojaDeVidaClick(index: number) {
    if (this.hojaDeVidaFiles[index].Uploaded === true) {
      this.hojaDeVidaFiles.splice(index, 1);

      for (let i = 0; this.hojaDeVidaFiles.length > i; i++) {
        this.hojaDeVidaFiles[i].Index = i;
      }
    }
  }
  
  whenFileSoportesHojaDeVidaChange(event: any) {
    let currentFilesLength = this.soportesHojaDeVidaFiles.length;

    for (let i = 0; event.target.files.length > i; i++) {
      this.soportesHojaDeVidaFiles.push({
        Index: currentFilesLength + i,
        Name: event.target.files[i].name,
        Size: event.target.files[i].size,
        Type: event.target.files[i].type,
        Uploaded: false,
      });

      this.getBase64(event.target.files[i]).then((result) => {
        this.soportesHojaDeVidaFiles[currentFilesLength + i].Bytes = result as string;
        this.soportesHojaDeVidaFiles[currentFilesLength + i].Uploaded = true;
      });
    }

    event.target.value = null;
  }

  onDeleteFileSoportesHojaDeVidaClick(index: number) {
    if (this.soportesHojaDeVidaFiles[index].Uploaded === true) {
      this.soportesHojaDeVidaFiles.splice(index, 1);

      for (let i = 0; this.soportesHojaDeVidaFiles.length > i; i++) {
        this.soportesHojaDeVidaFiles[i].Index = i;
      }
    }
  }

  whenFileTerminosDeReferenciaChange(event: any) {
    let currentFilesLength = this.terminosDeReferenciaFiles.length;

    for (let i = 0; event.target.files.length > i; i++) {
      this.terminosDeReferenciaFiles.push({
        Index: currentFilesLength + i,
        Name: event.target.files[i].name,
        Size: event.target.files[i].size,
        Type: event.target.files[i].type,
        Uploaded: false,
      });

      this.getBase64(event.target.files[i]).then((result) => {
        this.terminosDeReferenciaFiles[currentFilesLength + i].Bytes = result as string;
        this.terminosDeReferenciaFiles[currentFilesLength + i].Uploaded = true;
      });
    }

    event.target.value = null;
  }

  onDeleteFileTerminosDeReferenciaClick(index: number) {
    if (this.terminosDeReferenciaFiles[index].Uploaded === true) {
      this.terminosDeReferenciaFiles.splice(index, 1);

      for (let i = 0; this.terminosDeReferenciaFiles.length > i; i++) {
        this.terminosDeReferenciaFiles[i].Index = i;
      }
    }
  }

  whenFileJustificacionContratistaChange(event: any) {
    let currentFilesLength = this.justificacionContratistaFiles.length;

    for (let i = 0; event.target.files.length > i; i++) {
      this.justificacionContratistaFiles.push({
        Index: currentFilesLength + i,
        Name: event.target.files[i].name,
        Size: event.target.files[i].size,
        Type: event.target.files[i].type,
        Uploaded: false,
      });

      this.getBase64(event.target.files[i]).then((result) => {
        this.justificacionContratistaFiles[currentFilesLength + i].Bytes = result as string;
        this.justificacionContratistaFiles[currentFilesLength + i].Uploaded = true;
      });
    }

    event.target.value = null;
  }

  onDeleteFileJustificacionContratistaClick(index: number) {
    if (this.justificacionContratistaFiles[index].Uploaded === true) {
      this.justificacionContratistaFiles.splice(index, 1);

      for (let i = 0; this.justificacionContratistaFiles.length > i; i++) {
        this.justificacionContratistaFiles[i].Index = i;
      }
    }
  }

  whenFileExamenSaludOcupacionalChange(event: any) {
    let currentFilesLength = this.examenSaludOcupacionalFiles.length;

    for (let i = 0; event.target.files.length > i; i++) {
      this.examenSaludOcupacionalFiles.push({
        Index: currentFilesLength + i,
        Name: event.target.files[i].name,
        Size: event.target.files[i].size,
        Type: event.target.files[i].type,
        Uploaded: false,
      });

      this.getBase64(event.target.files[i]).then((result) => {
        this.examenSaludOcupacionalFiles[currentFilesLength + i].Bytes = result as string;
        this.examenSaludOcupacionalFiles[currentFilesLength + i].Uploaded = true;
      });
    }

    event.target.value = null;
  }

  onDeleteFileExamenSaludOcupacionalClick(index: number) {
    if (this.examenSaludOcupacionalFiles[index].Uploaded === true) {
      this.examenSaludOcupacionalFiles.splice(index, 1);

      for (let i = 0; this.examenSaludOcupacionalFiles.length > i; i++) {
        this.examenSaludOcupacionalFiles[i].Index = i;
      }
    }
  }

  whenFileActaCumplimientoYConocimientoChange(event: any) {
    let currentFilesLength = this.actaCumplimientoYConocimientoFiles.length;

    for (let i = 0; event.target.files.length > i; i++) {
      this.actaCumplimientoYConocimientoFiles.push({
        Index: currentFilesLength + i,
        Name: event.target.files[i].name,
        Size: event.target.files[i].size,
        Type: event.target.files[i].type,
        Uploaded: false,
      });

      this.getBase64(event.target.files[i]).then((result) => {
        this.actaCumplimientoYConocimientoFiles[currentFilesLength + i].Bytes = result as string;
        this.actaCumplimientoYConocimientoFiles[currentFilesLength + i].Uploaded = true;
      });
    }

    event.target.value = null;
  }

  onDeleteFileActaCumplimientoYConocimientoClick(index: number) {
    if (this.actaCumplimientoYConocimientoFiles[index].Uploaded === true) {
      this.actaCumplimientoYConocimientoFiles.splice(index, 1);

      for (let i = 0; this.actaCumplimientoYConocimientoFiles.length > i; i++) {
        this.actaCumplimientoYConocimientoFiles[i].Index = i;
      }
    }
  }
}
