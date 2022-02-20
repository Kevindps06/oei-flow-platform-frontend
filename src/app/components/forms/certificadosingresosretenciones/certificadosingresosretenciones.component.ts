import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Utils } from 'src/app/classes/utils';
import { FormsService } from 'src/app/services/forms.service';
import { SharedService } from 'src/app/services/shared.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-forms-certificadosingresosretenciones',
  templateUrl: './certificadosingresosretenciones.component.html',
  styleUrls: ['./certificadosingresosretenciones.component.css'],
})
export class FormsCertificadosIngresosRetencionesComponent implements OnInit {
  years: string[] = [];

  year: string = '';

  setYear(year: string) {
    this.year = year
  }

  identificator: string = '';

  constructor(
    private formsService: FormsService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    const taskId = Utils.makeRandomString(4);

    this.formsService
      .getFormsCertificadosIngresosRetencionesYears()
      .subscribe(async (event) => {
        switch (event.type) {
          case HttpEventType.Sent:
            this.sharedService.pushWaitTask({
              id: taskId,
              description: 'Obteniendo informacion...',
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
            this.years = event.body;

            this.year = this.years[0]

            this.sharedService.removeWaitTask({
              id: taskId,
            });
            break;
        }
      });
  }

  btnValidarDocumento() {
    const taskId = Utils.makeRandomString(4);

    this.formsService
      .getFormsCertificadosIngresosRetenciones(this.year, this.identificator)
      .subscribe(
        async (event) => {
          switch (event.type) {
            case HttpEventType.Sent:
              this.sharedService.pushWaitTask({
                id: taskId,
                description:
                  'Validando certificado de ingresos y retenciones...',
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
              //window.open(window.URL.createObjectURL(event.body));

              saveAs(event.body, `${this.identificator}.pdf`);

              this.sharedService.pushToastMessage({
                id: Utils.makeRandomString(4),
                title: 'Certificado de ingresos y retenciones encontrado',
                description: `Su certificado de ingresos y retenciones identificado con el numero de cedula de ciudadania ${this.identificator} ha sido encontrado e iniciara su descarga en un momento.`,
              });

              this.sharedService.removeWaitTask({
                id: taskId,
              });
              break;
          }
        },
        (err) => {
          this.sharedService.pushToastMessage({
            id: Utils.makeRandomString(4),
            title: 'Certificado de ingresos y retenciones no encontrado',
            description: `Su certificado de ingresos y retenciones identificado con el numero de cedula de ciudadania ${this.identificator} no ha sido encontrado en el sistema.`,
          });

          this.sharedService.removeWaitTask({
            id: taskId,
          });
        }
      );
  }
}
