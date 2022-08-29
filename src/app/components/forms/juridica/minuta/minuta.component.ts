import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from 'src/app/classes/utils';
import { FormsService } from 'src/app/services/forms.service';
import { SharedService } from 'src/app/services/shared.service';
import { LoginService } from 'src/app/services/login.service';
import { IJuridica } from 'src/app/interfaces/forms-juridica';
import { saveAs } from 'file-saver';
import { FileItem } from 'src/app/interfaces/FileItem';
import { IJuridicaMinuta } from 'src/app/interfaces/juridica-minuta';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-forms-juridica-minuta',
  templateUrl: './minuta.component.html',
  styleUrls: ['./minuta.component.css'],
})
export class FormsJuridicaMinutaComponent implements OnInit {
  juridicaId!: string;
  juridica!: IJuridica;

  // Bienes
  tipoInmueble: string = '';
  nombreArrendador: string = '';
  numeroNit: string = '';
  nombreRepresentanteLegal: string = '';
  ciudadDondeReside: string = '';
  numeroCedula: string = '';
  ciudadExpedicion: string = '';
  detalleInmueble: string = '';
  ubicacionInmueble: string = '';
  barrio: string = '';
  ciudadInmueble: string = '';
  inmueble: string = '';
  mesesContrato: string = '';
  diaInicio: string = '';
  mesInicio: string = '';
  anoInicio: string = '';
  diaFin: string = '';
  mesFin: string = '';
  anoFin: string = '';
  valorContrato: string = '';
  valorCanonMensual: string = '';
  // field1
  // field2
  // field3
  // field4

  // Suministro
  numerodecontrato1: string = '';
  numerodeconvenio2: string = '';
  nombrecontratista: string = '';
  numerodenit4: string = '';
  nombrerepresentantelegal: string = '';
  // numeroCedula
  objetoContrato: string = '';
  terminodelcontrato8: string = '';
  valordelcontrato9: string = '';
  formadepago10: string = '';
  // field11
  obligacionesespecificas12: string = '';
  productos13: string = '';
  // field15
  // field16
  // field17
  // field18
  // field19
  fechaFirma: string = '';

  // Servicios - Natural
  // numerodecontrato1
  // numerodeconvenio2
  entidadaliada3: string = '';
  // nombrecontratista
  // numeroCedula
  // objetoContrato
  terminodeejecucipon7: string = '';
  valordelcontrato8: string = '';
  formadepago9: string = '';
  // field10
  // field11
  // field12
  // field13
  obligacionesespecificas14: string = '';
  productosaentregar15: string = '';
  // fechaFirma

  // Servicios - Juridica
  // numerodecontrato1
  // numerodeconvenio2
  // nombrecontratista
  nombrerepresentantelegal4: string = '';
  // numeroCedula
  // objetoContrato
  // field7
  // field8
  terminodeejecuciondelcontrato9: string = '';
  // formadepago10
  // obligacionesespecificas12
  productosaentregar13: string = '';
  tipodeamparo1: string = '';
  porcentajedelamparo15: string = '';
  vigenciadelamparo16: string = '';
  tipodeamparo2: string = '';
  porcentajedelamparo: string = '';
  vigenciadelamparo19: string = '';
  // fechaFirma

  // Anexo
  fechasuperior: string = '';
  direccionaefectosdenotificaciones: string = '';
  perfilprofesionaluobjetosocial: string = '';
  caracteristicaspersonaleseidentificativos: string = '';
  categoriadelinteresado: string = '';
  categoriadedatos: string = '';
  fechaantefirma: string = '';
  // nombrecontratista

  field1: string = '';
  field2: string = '';
  field3: string = '';
  field4: string = '';
  field5: string = '';
  field6: string = '';
  field7: string = '';
  field8: string = '';
  field9: string = '';
  field10: string = '';
  field11: string = '';
  field12: string = '';
  field13: string = '';
  field14: string = '';
  field15: string = '';
  field16: string = '';
  field17: string = '';
  field18: string = '';
  field19: string = '';
  field20: string = '';
  field21: string = '';
  field22: string = '';
  field23: string = '';
  field24: string = '';
  field25: string = '';
  minuta: any;
  anexo: any;

  docxBlob1!: Blob;
  pdfUint8Array1?: Uint8Array;
  pdfBlob1!: Blob;

  docxBlob2!: Blob;
  pdfUint8Array2?: Uint8Array;
  pdfBlob2!: Blob;

  files: FileItem[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private formsService: FormsService,
    private sharedService: SharedService,
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    if (!this.loginService.activeAccoount()) {
      this.router.navigate(['/login']);

      this.sharedService.pushToastMessage({
        id: Utils.makeRandomString(4),
        title: `Inautorizado`,
        description: `El contenido al que esta intentando ingresar es de uso restringido, autentifiquese y vuelva a intentar ingresar.`,
      });

      return;
    }

    this.juridicaId = this.activatedRoute.snapshot.params.id;

    let getFormJuridicaMinutaAvailabilityTaskId: string;
    this.formsService
      .getFormJuridicaMinutaAvailability(this.juridicaId)
      .subscribe(
        (httpEvent) => {
          switch (httpEvent.type) {
            case HttpEventType.Sent:
              getFormJuridicaMinutaAvailabilityTaskId =
                this.sharedService.pushWaitTask({
                  description: 'Verificando disponibilidad...',
                  progress: 0,
                }) as string;
              break;
            case HttpEventType.DownloadProgress:
              this.sharedService.pushWaitTask({
                id: getFormJuridicaMinutaAvailabilityTaskId,
                progress: Math.round(
                  (httpEvent.loaded * 100) / httpEvent.total
                ),
              });
              break;
          }
        },
        (httpEventError) => {
          this.router.navigate(['/']);

          switch (httpEventError.status) {
            case 406:
              this.sharedService.pushToastMessage({
                id: Utils.makeRandomString(4),
                title: `Contenido no disponible`,
                description: `El contenido al que esta intentando ingresar no se encuentra disponible, intentelo despues.`,
              });
              break;
            case 423:
              this.sharedService.pushToastMessage({
                id: Utils.makeRandomString(4),
                title: `Componente ya utilizado`,
                description: `Ya se ha utilizado el componente al que intenta ingresar para su respectiva tarea.`,
              });
              break;
          }

          this.sharedService.removeWaitTask({
            id: getFormJuridicaMinutaAvailabilityTaskId,
          });
        },
        () => {
          let getFormsJuridicaMinutaVerifyEncargadoTaskId: string;
          this.formsService
            .getFormJuridicaMinutaVerifyEncargado(
              this.juridicaId,
              this.loginService.activeAccoount()?.username as string
            )
            .subscribe(
              (httpEvent) => {
                switch (httpEvent.type) {
                  case HttpEventType.Sent:
                    getFormsJuridicaMinutaVerifyEncargadoTaskId =
                      this.sharedService.pushWaitTask({
                        description: 'Verificando autorizacion...',
                        progress: 0,
                      }) as string;
                    break;
                  case HttpEventType.DownloadProgress:
                    this.sharedService.pushWaitTask({
                      id: getFormsJuridicaMinutaVerifyEncargadoTaskId,
                      progress: Math.round(
                        (httpEvent.loaded * 100) / httpEvent.total
                      ),
                    });
                    break;
                }
              },
              (httpEventError) => {
                if (httpEventError.status === 403) {
                  this.router.navigate(['/']);

                  this.sharedService.pushToastMessage({
                    id: Utils.makeRandomString(4),
                    title: `Inautorizado`,
                    description: `Usted no cuenta con autorizacion para el contenido que esta intentando ingresar, no intente ingresar.`,
                  });
                }

                this.sharedService.removeWaitTask({
                  id: getFormsJuridicaMinutaVerifyEncargadoTaskId,
                });
              },
              () => {
                let getFormJuridicaTaskId: string;
                this.formsService.getFormJuridica(this.juridicaId).subscribe(
                  (httpEvent) => {
                    switch (httpEvent.type) {
                      case HttpEventType.Sent:
                        getFormJuridicaTaskId = this.sharedService.pushWaitTask(
                          {
                            description:
                              'Obteniendo informacion de la peticion...',
                            progress: 0,
                          }
                        ) as string;
                        break;
                      case HttpEventType.DownloadProgress:
                        this.sharedService.pushWaitTask({
                          id: getFormJuridicaTaskId,
                          progress: Math.round(
                            (httpEvent.loaded * 100) / httpEvent.total
                          ),
                        });
                        break;
                      case HttpEventType.Response:
                        this.juridica = httpEvent.body[0];
                        break;
                    }
                  },
                  (httpEventError) => {
                    this.sharedService.removeWaitTask({
                      id: getFormJuridicaTaskId,
                    });
                  },
                  () => {
                    this.sharedService.removeWaitTask({
                      id: getFormJuridicaTaskId,
                    });
                  }
                );

                this.sharedService.removeWaitTask({
                  id: getFormsJuridicaMinutaVerifyEncargadoTaskId,
                });
              }
            );

          this.sharedService.removeWaitTask({
            id: getFormJuridicaMinutaAvailabilityTaskId,
          });
        }
      );
  }

  invalidatePreview() {
    this.pdfUint8Array1 = undefined;
    this.pdfUint8Array2 = undefined;
    this.files = [];
  }

  btnPreviewClick() {
    switch (this.juridica.TipoAdquisicion) {
      case 'Bienes':
        this.minuta = {
          tipoInmueble: this.tipoInmueble,
          numeroContrato: this.juridica.NumeroContrato,
          nombreArrendador: this.nombreArrendador,
          numeroNit: this.numeroNit,
          nombreRepresentanteLegal: this.nombreRepresentanteLegal,
          ciudadDondeReside: this.ciudadDondeReside,
          numeroCedula: this.numeroCedula,
          ciudadExpedicion: this.ciudadExpedicion,
          detalleInmueble: this.detalleInmueble,
          ubicacionInmueble: this.ubicacionInmueble,
          barrio: this.barrio,
          ciudadInmueble: this.ciudadInmueble,
          inmueble: this.inmueble,
          mesesContrato: this.mesesContrato,
          diaInicio: this.diaInicio,
          mesInicio: this.mesInicio,
          anoInicio: this.anoInicio,
          diaFin: this.diaFin,
          mesFin: this.mesFin,
          anoFin: this.anoFin,
          valorContrato: this.valorContrato,
          valorCanonMensual: this.valorCanonMensual,
          field1: this.field1,
          field2: this.field2,
          field3: this.field3,
          field4: this.field4,
          field5: this.field5,
          field6: this.field6,
          field7: this.field7,
          field8: this.field8,
          field9: this.field9,
          field10: this.field10,
          field11: this.field11,
          field12: this.field12,
          field13: this.field13,
          field14: this.field14,
          field15: this.field15,
          field16: this.field16,
          field17: this.field17,
          field18: this.field18,
          field19: this.field19,
          field20: this.field20,
          field21: this.field21,
          field22: this.field22,
          field23: this.field23,
          field24: this.field24,
          field25: this.field25,
        };
        break;
      case 'Suministro':
        this.minuta = {
          numerodecontrato1: this.juridica.NumeroContrato,
          numerodeconvenio2: this.numerodeconvenio2,
          nombrecontratista: this.nombrecontratista,
          numerodenit4: this.numerodenit4,
          nombrerepresentantelegal: this.nombrerepresentantelegal,
          numeroCedula: this.numeroCedula,
          objetoContrato: this.objetoContrato,
          terminodelcontrato8: this.terminodelcontrato8,
          valordelcontrato9: this.valordelcontrato9,
          formadepago10: this.formadepago10,
          field11: this.field11,
          obligacionesespecificas12: this.obligacionesespecificas12,
          productos13: this.productos13,
          field15: this.field15,
          field16: this.field16,
          fiield17: this.field17,
          field18: this.field18,
          field19: this.field19,
          fechaFirma: this.fechaFirma,
        };
        break;
      case 'Servicios':
        switch (this.juridica.TipoPersona) {
          case 'Natural':
            this.minuta = {
              numerodecontrato1: this.juridica.NumeroContrato,
              numerodeconvenio2: this.numerodeconvenio2,
              entidadaliada3: this.entidadaliada3,
              nombrecontratista: this.nombrecontratista,
              numeroCedula: this.numeroCedula,
              objetoContrato: this.objetoContrato,
              terminodeejecucipon7: this.terminodeejecucipon7,
              valordelcontrato8: this.valordelcontrato8,
              formadepago9: this.formadepago9,
              field10: this.field10,
              field11: this.field11,
              field12: this.field12,
              field13: this.field13,
              obligacionesespecificas14: this.obligacionesespecificas14,
              productosaentregar15: this.productosaentregar15,
              fechaFirma: this.fechaFirma,
            };
            break;
          case 'Juridica':
            this.minuta = {
              numerodecontrato1: this.juridica.NumeroContrato,
              numerodeconvenio2: this.numerodeconvenio2,
              nombrecontratista: this.nombrecontratista,
              nombrerepresentantelegal4: this.nombrerepresentantelegal4,
              numeroCedula: this.numeroCedula,
              objetoContrato: this.objetoContrato,
              field7: this.field7,
              field8: this.field8,
              terminodeejecuciondelcontrato9:
                this.terminodeejecuciondelcontrato9,
              formadepago10: this.formadepago10,
              obligacionesespecificas12: this.obligacionesespecificas12,
              productosaentregar13: this.productosaentregar13,
              tipodeamparo1: this.tipodeamparo1,
              porcentajedelamparo15: this.porcentajedelamparo15,
              vigenciadelamparo16: this.vigenciadelamparo16,
              tipodeamparo2: this.tipodeamparo2,
              porcentajedelamparo: this.porcentajedelamparo,
              vigenciadelamparo19: this.vigenciadelamparo19,
              fechaFirma: this.fechaFirma,
            };
            break;
        }
        break;
    }

    this.anexo = {
      fechasuperior: this.fechasuperior,
      nombrecontratista: this.nombrecontratista,
      numeroCedula: this.numeroCedula,
      direccionaefectosdenotificaciones: this.direccionaefectosdenotificaciones,
      perfilprofesionaluobjetosocial: this.perfilprofesionaluobjetosocial,
      objetoContrato: this.objetoContrato,
      caracteristicaspersonaleseidentificativos:
        this.caracteristicaspersonaleseidentificativos,
      categoriadelinteresado: this.categoriadelinteresado,
      categoriadedatos: this.categoriadedatos,
      fechaantefirma: this.fechaantefirma,
    };

    this.files = [];

    let postFormsJuridicaMinutaGenerateTaskId!: string;
    this.formsService
      .postFormJuridicaMinutaGenerate(
        this.juridica.TipoAdquisicion,
        this.juridica.TipoPersona,
        this.minuta
      )
      .subscribe(
        async (httpEvent) => {
          switch (httpEvent.type) {
            case HttpEventType.Sent:
              postFormsJuridicaMinutaGenerateTaskId =
                this.sharedService.pushWaitTask({
                  description: 'Generando pre visualizacion...',
                  progress: 0,
                }) as string;
              break;
            case HttpEventType.DownloadProgress:
              this.sharedService.pushWaitTask({
                id: postFormsJuridicaMinutaGenerateTaskId,
                progress: Math.round(
                  (httpEvent.loaded * 100) / httpEvent.total
                ),
              });
              break;
            case HttpEventType.Response:
              this.docxBlob1 = new Blob([
                new Uint8Array(httpEvent.body.docxBuf.data),
              ]);

              this.pdfUint8Array1 = new Uint8Array(httpEvent.body.pdfBuf.data);

              this.pdfBlob1 = new Blob([this.pdfUint8Array1]);

              this.files.push({
                Index: 0,
                Name: `minuta.docx`,
                Size: this.docxBlob1.size,
                Type: this.docxBlob1.type,
                Bytes: await this.docxBlob1.arrayBuffer(),
                Uploaded: true,
              });

              this.files.push({
                Index: 1,
                Name: `minuta.pdf`,
                Size: this.pdfBlob1.size,
                Type: this.pdfBlob1.type,
                Bytes: await this.pdfBlob1.arrayBuffer(),
                Uploaded: true,
              });
              break;
          }
        },
        (httpEventError) => {
          this.sharedService.removeWaitTask({
            id: postFormsJuridicaMinutaGenerateTaskId,
          });
        },
        () => {
          this.sharedService.removeWaitTask({
            id: postFormsJuridicaMinutaGenerateTaskId,
          });
        }
      );

    let postFormsJuridicaMinutaGenerateAnexoTaskId!: string;
    this.formsService.postFormJuridicaMinutaGenerateAnexo(this.anexo).subscribe(
      async (httpEvent) => {
        switch (httpEvent.type) {
          case HttpEventType.Sent:
            postFormsJuridicaMinutaGenerateAnexoTaskId =
              this.sharedService.pushWaitTask({
                description: 'Generando pre visualizacion...',
                progress: 0,
              }) as string;
            break;
          case HttpEventType.DownloadProgress:
            this.sharedService.pushWaitTask({
              id: postFormsJuridicaMinutaGenerateAnexoTaskId,
              progress: Math.round((httpEvent.loaded * 100) / httpEvent.total),
            });
            break;
          case HttpEventType.Response:
            const currentDate = new Date();

            this.docxBlob2 = new Blob([
              new Uint8Array(httpEvent.body.docxBuf.data),
            ]);

            this.pdfUint8Array2 = new Uint8Array(httpEvent.body.pdfBuf.data);

            this.pdfBlob2 = new Blob([this.pdfUint8Array2]);

            this.files.push({
              Index: 2,
              Name: `anexo.docx`,
              Size: this.docxBlob2.size,
              Type: this.docxBlob2.type,
              Bytes: await this.docxBlob2.arrayBuffer(),
              Uploaded: true,
            });

            this.files.push({
              Index: 3,
              Name: `anexo.pdf`,
              Size: this.pdfBlob2.size,
              Type: this.pdfBlob2.type,
              Bytes: await this.pdfBlob2.arrayBuffer(),
              Uploaded: true,
            });
            break;
        }
      },
      (httpEventError) => {
        this.sharedService.removeWaitTask({
          id: postFormsJuridicaMinutaGenerateAnexoTaskId,
        });
      },
      () => {
        this.sharedService.removeWaitTask({
          id: postFormsJuridicaMinutaGenerateAnexoTaskId,
        });
      }
    );
  }

  async btnSubmitClick() {
    let juridicaMinuta!: IJuridicaMinuta;

    switch (this.juridica.TipoAdquisicion) {
      case 'Bienes':
        juridicaMinuta = {
          TipoInmueble: this.tipoInmueble,
          NombreArrendador: this.nombreArrendador,
          NumeroNit: this.numeroNit,
          NombreRepresentanteLegal: this.nombreRepresentanteLegal,
          CiudadDondeReside: this.ciudadDondeReside,
          NumeroCedula: this.numeroCedula,
          CiudadExpedicion: this.ciudadExpedicion,
          DetalleInmueble: this.detalleInmueble,
          UbicacionInmueble: this.ubicacionInmueble,
          Barrio: this.barrio,
          CiudadInmueble: this.ciudadInmueble,
          Inmueble: this.inmueble,
          MesesContrato: this.mesesContrato,
          DiaInicio: this.diaInicio,
          MesInicio: this.mesInicio,
          AnoInicio: this.anoInicio,
          DiaFin: this.diaFin,
          MesFin: this.mesFin,
          AnoFin: this.anoFin,
          ValorContrato: this.valorContrato,
          ValorCanonMensual: this.valorCanonMensual,
          Field1: this.field1,
          Field2: this.field2,
          Field3: this.field3,
          Field4: this.field4,
          Field5: this.field5,
          Field6: this.field6,
          Field7: this.field7,
          Field8: this.field8,
          Field9: this.field9,
          Field10: this.field10,
          Field11: this.field11,
          Field12: this.field12,
          Field13: this.field13,
          Field14: this.field14,
          Field15: this.field15,
          Field16: this.field16,
          Field17: this.field17,
          Field18: this.field18,
          Field19: this.field19,
          Field20: this.field20,
          Field21: this.field21,
          Field22: this.field22,
          Field23: this.field23,
          Field24: this.field24,
          Field25: this.field25,
        };
        break;
      case 'Suministro':
        juridicaMinuta = {
          NumeroContrato: this.numerodecontrato1,
          NumeroConvenio: this.numerodeconvenio2,
          NombreContratista: this.nombrecontratista,
          NumeroNit: this.numerodenit4,
          NombreRepresentanteLegal: this.nombrerepresentantelegal,
          NumeroCedula: this.numeroCedula,
          ObjetoContrato: this.objetoContrato,
          TerminoContrato: this.terminodelcontrato8,
          ValorContrato: this.valordelcontrato9,
          FormaPago: this.formadepago10,
          Field1: this.field11,
          ObligacionesEspecificas: this.obligacionesespecificas12,
          ProductosEntregar: this.productos13,
          Field15: this.field15,
          Field16: this.field16,
          Field17: this.field17,
          Field18: this.field18,
          Field19: this.field19,
        };
        break;
      case 'Servicios':
        switch (this.juridica.TipoPersona) {
          case 'Natural':
            juridicaMinuta = {
              NumeroContrato: this.numerodecontrato1,
              NumeroConvenio: this.numerodeconvenio2,
              EntidadAliada: this.entidadaliada3,
              NombreContratista: this.nombrecontratista,
              NumeroCedula: this.numeroCedula,
              ObjetoContrato: this.objetoContrato,
              TerminoEjecucion: this.terminodeejecucipon7,
              ValorContrato: this.valordelcontrato8,
              FormaPago: this.formadepago9,
              Field10: this.field10,
              Field11: this.field11,
              Field12: this.field12,
              Field13: this.field13,
              ObligacionesEspecificas: this.obligacionesespecificas14,
              ProductosEntregar: this.productosaentregar15,
              FechaFirma: this.fechaFirma,
            };
            break;
          case 'Juridica':
            juridicaMinuta = {
              NumeroContrato: this.numerodecontrato1,
              NumeroConvenio: this.numerodeconvenio2,
              NombreContratista: this.nombrecontratista,
              NombreRepresentanteLegal: this.nombrerepresentantelegal4,
              NumeroCedula: this.numeroCedula,
              ObjetoContrato: this.objetoContrato,
              Field7: this.field7,
              Field8: this.field8,
              TerminoEjecucion: this.terminodeejecuciondelcontrato9,
              FormaPago: this.formadepago10,
              ObligacionesEspecificas: this.obligacionesespecificas12,
              ProductosEntregar: this.productosaentregar13,
              TipoAmparo1: this.tipodeamparo1,
              PorcentajeAmparo1: this.porcentajedelamparo15,
              VigenciaAmparo1: this.vigenciadelamparo16,
              TipoAmparo2: this.tipodeamparo2,
              PorcentajeAmparo2: this.porcentajedelamparo,
              VigenciaAmparo2: this.vigenciadelamparo19,
              FechaFirma: this.fechaFirma,
            };
            break;
        }
        break;
    }

    // Minuta
    for (let i = 0; this.files.length > i; i++) {
      let postUploadFileTaskId: string;
      await this.formsService
        .postUploadFile(this.files[i].Name, this.files[i].Bytes as ArrayBuffer)
        .pipe(
          map((httpEvent) => {
            switch (httpEvent.type) {
              case HttpEventType.Sent:
                postUploadFileTaskId = this.sharedService.pushWaitTask({
                  description: `Subiendo archivos...`,
                  progress: 0,
                }) as string;
                break;
              case HttpEventType.UploadProgress:
                this.sharedService.pushWaitTask({
                  id: postUploadFileTaskId,
                  progress: Math.round(
                    (httpEvent.loaded * 100) / httpEvent.total
                  ),
                });
                break;
              case HttpEventType.Response:
                delete this.files[i].Bytes;
                this.files[i].ServerPath = httpEvent.body;

                this.sharedService.removeWaitTask({
                  id: postUploadFileTaskId,
                });
                break;
            }
          }),
          catchError((httpEventError) => {
            this.sharedService.removeWaitTask({
              id: postUploadFileTaskId,
            });

            return throwError(httpEventError);
          })
        )
        .toPromise();
    }

    juridicaMinuta = Object.assign(juridicaMinuta, {
      Minuta: this.minuta,
      Anexo: this.anexo,
      Juridica: this.juridicaId,
      MinutaFiles: this.files,
    });

    let postFormsJuridicaRequestMinutaTaskId: string;
    this.formsService.postFormJuridicaMinuta(juridicaMinuta).subscribe(
      (httpEvent) => {
        switch (httpEvent.type) {
          case HttpEventType.Sent:
            postFormsJuridicaRequestMinutaTaskId =
              this.sharedService.pushWaitTask({
                description: 'Enviando informacion de la peticion...',
                progress: 0,
              }) as string;
            break;
          case HttpEventType.UploadProgress:
            this.sharedService.pushWaitTask({
              id: postFormsJuridicaRequestMinutaTaskId,
              progress: Math.round((httpEvent.loaded * 100) / httpEvent.total),
            });
            break;
          case HttpEventType.Response:
            let putFormsJuridicaRequestTaskId: string;
            this.formsService
              .putFormJuridica(this.juridicaId, {
                JuridicaMinuta: httpEvent.body._id,
              })
              .subscribe(
                (httpEvent) => {
                  switch (httpEvent.type) {
                    case HttpEventType.Sent:
                      putFormsJuridicaRequestTaskId =
                        this.sharedService.pushWaitTask({
                          description:
                            'Actualizando informacion de la peticion...',
                          progress: 0,
                        }) as string;
                      break;
                    case HttpEventType.UploadProgress:
                      this.sharedService.pushWaitTask({
                        id: putFormsJuridicaRequestTaskId,
                        progress: Math.round(
                          (httpEvent.loaded * 100) / httpEvent.total
                        ),
                      });
                      break;
                  }
                },
                (httpEventError) => {
                  this.sharedService.removeWaitTask({
                    id: putFormsJuridicaRequestTaskId,
                  });
                },
                () => {
                  this.sharedService.pushToastMessage({
                    id: Utils.makeRandomString(4),
                    title: `Informacion ingresada`,
                    description: `Su respuesta ha sido correctamente ingresada, carge el archivo generado en su repositorio asignado y proceda a responder el flujo.`,
                    autohide: 15000,
                  });

                  this.router.navigate(['/']);

                  this.sharedService.removeWaitTask({
                    id: putFormsJuridicaRequestTaskId,
                  });
                }
              );
            break;
        }
      },
      (httpEventError) => {
        this.sharedService.removeWaitTask({
          id: postFormsJuridicaRequestMinutaTaskId,
        });
      },
      () => {
        this.sharedService.removeWaitTask({
          id: postFormsJuridicaRequestMinutaTaskId,
        });
      }
    );
  }

  isValidPreview() {
    switch (this.juridica.TipoAdquisicion) {
      case 'Bienes':
        return (
          this.tipoInmueble &&
          this.nombreArrendador &&
          this.numeroNit &&
          this.nombreRepresentanteLegal &&
          this.ciudadDondeReside &&
          this.numeroCedula &&
          this.ciudadExpedicion &&
          this.detalleInmueble &&
          this.ubicacionInmueble &&
          this.barrio &&
          this.ciudadInmueble &&
          this.inmueble &&
          this.mesesContrato &&
          this.diaInicio &&
          this.mesInicio &&
          this.anoInicio &&
          this.diaFin &&
          this.mesFin &&
          this.anoFin &&
          this.valorContrato &&
          this.valorCanonMensual &&
          this.field1 &&
          this.field2 &&
          this.field3 &&
          this.field4 &&
          (this.juridica.ManejoDatos === 'Si'
            ? this.isValidPreviewAnexo()
            : true)
        );
      case 'Suministro':
        return (
          this.nombrecontratista &&
          this.numerodenit4 &&
          this.nombrerepresentantelegal &&
          this.numeroCedula &&
          this.objetoContrato &&
          this.terminodelcontrato8 &&
          this.valordelcontrato9 &&
          this.formadepago10 &&
          this.field11 &&
          this.obligacionesespecificas12 &&
          this.productos13 &&
          this.field15 &&
          this.field16 &&
          this.field17 &&
          this.field18 &&
          this.field19 &&
          (this.juridica.ManejoDatos === 'Si'
            ? this.isValidPreviewAnexo()
            : true)
        );
      case 'Servicios':
        switch (this.juridica.TipoPersona) {
          case 'Natural':
            return (
              this.entidadaliada3 &&
              this.nombrecontratista &&
              this.numeroCedula &&
              this.objetoContrato &&
              this.terminodeejecucipon7 &&
              this.valordelcontrato8 &&
              this.formadepago9 &&
              this.field10 &&
              this.field11 &&
              this.field12 &&
              this.field13 &&
              this.obligacionesespecificas14 &&
              this.productosaentregar15 &&
              this.fechaFirma &&
              (this.juridica.ManejoDatos === 'Si'
                ? this.isValidPreviewAnexo()
                : true)
            );
          case 'Juridica':
            return (
              this.nombrecontratista &&
              this.nombrerepresentantelegal4 &&
              this.numeroCedula &&
              this.objetoContrato &&
              this.field7 &&
              this.field8 &&
              this.terminodeejecuciondelcontrato9 &&
              this.formadepago10 &&
              this.obligacionesespecificas12 &&
              this.productosaentregar13 &&
              this.tipodeamparo1 &&
              this.porcentajedelamparo15 &&
              this.vigenciadelamparo16 &&
              this.tipodeamparo2 &&
              this.porcentajedelamparo &&
              this.vigenciadelamparo19 &&
              this.fechaFirma &&
              (this.juridica.ManejoDatos === 'Si'
                ? this.isValidPreviewAnexo()
                : true)
            );
          default:
            return false;
        }
      default:
        return false;
    }
  }

  isValidPreviewAnexo() {
    /*console.log(this.fechasuperior);
    console.log(this.direccionaefectosdenotificaciones);
    console.log(this.perfilprofesionaluobjetosocial);
    console.log(this.caracteristicaspersonaleseidentificativos);
    console.log(this.categoriadelinteresado);
    console.log(this.categoriadedatos);
    console.log(this.fechaantefirma);
    console.log('---------------------------------------------');*/

    return (
      this.fechasuperior &&
      this.direccionaefectosdenotificaciones &&
      this.perfilprofesionaluobjetosocial &&
      this.caracteristicaspersonaleseidentificativos &&
      this.categoriadelinteresado &&
      this.categoriadedatos &&
      this.fechaantefirma
    );
  }

  isValid() {
    return (
      this.isValidPreview() &&
      (this.juridica.ManejoDatos === 'Si'
        ? this.isValidPreviewAnexo()
        : true) &&
      this.files.length !== 0
    );
  }
}
