import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
    this.year = year;
  }

  tipoPersona: string = '';
  identificator: string = '';
  digitoVerificacion: string = '';

  constructor(
    private formsService: FormsService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    let getFormsCertificadosIngresosRetencionesYearsTaskId!: string;
    this.formsService.getFormsCertificadosIngresosRetencionesYears().subscribe(
      (httpEvent) => {
        switch (httpEvent.type) {
          case HttpEventType.Sent:
            getFormsCertificadosIngresosRetencionesYearsTaskId =
              this.sharedService.pushWaitTask({
                description: 'Obteniendo informacion...',
                progress: 0,
              }) as string;
            break;
          case HttpEventType.DownloadProgress:
            this.sharedService.pushWaitTask({
              id: getFormsCertificadosIngresosRetencionesYearsTaskId,
              progress: Math.round((httpEvent.loaded * 100) / httpEvent.total),
            });
            break;
          case HttpEventType.Response:
            this.years = httpEvent.body;

            this.year = this.years[0];
            break;
        }
      },
      (httpEventError) => {
        this.sharedService.removeWaitTask({
          id: getFormsCertificadosIngresosRetencionesYearsTaskId,
        });
      },
      () => {
        this.year = '2021';

        this.sharedService.removeWaitTask({
          id: getFormsCertificadosIngresosRetencionesYearsTaskId,
        });
      }
    );
  }

  btnValidarDocumento() {
    let getFormsCertificadosIngresosRetencionesTaskId!: string;
    this.formsService
      .getFormsCertificadosIngresosRetenciones(
        this.year,
        this.tipoPersona === 'Natural'
          ? this.identificator
          : `${this.identificator}-${this.digitoVerificacion}`
      )
      .subscribe(
        async (httpEvent) => {
          switch (httpEvent.type) {
            case HttpEventType.Sent:
              getFormsCertificadosIngresosRetencionesTaskId =
                this.sharedService.pushWaitTask({
                  description:
                    'Validando certificado de ingresos y retenciones...',
                  progress: 0,
                }) as string;
              break;
            case HttpEventType.DownloadProgress:
              this.sharedService.pushWaitTask({
                id: getFormsCertificadosIngresosRetencionesTaskId,
                progress: Math.round(
                  (httpEvent.loaded * 100) / httpEvent.total
                ),
              });
              break;
            case HttpEventType.Response:
              saveAs(httpEvent.body, `${this.identificator}.pdf`);

              this.sharedService.pushToastMessage({
                id: Utils.makeRandomString(4),
                title: 'Certificado de ingresos y retenciones encontrado',
                description: `Su certificado de ingresos y retenciones identificado con ${this.identificator} ha sido encontrado e iniciara su descarga en un momento.`,
              });
              break;
          }
        },
        (httpEventError) => {
          this.sharedService.pushToastMessage({
            id: Utils.makeRandomString(4),
            title: 'Certificado de ingresos y retenciones no encontrado',
            description: `Su certificado de ingresos y retenciones identificado con ${this.identificator} no ha sido encontrado en el sistema.`,
          });

          this.sharedService.removeWaitTask({
            id: getFormsCertificadosIngresosRetencionesTaskId,
          });
        },
        () => {
          this.sharedService.removeWaitTask({
            id: getFormsCertificadosIngresosRetencionesTaskId,
          });
        }
      );
  }
}
