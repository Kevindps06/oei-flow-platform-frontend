import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormsFinancieraRegistration } from '../interfaces/forms-financiera-registration';
import { environment } from 'src/environments/environment';
import { FormsFinancieraInvoice } from '../interfaces/forms-financiera-invoice';
import { FormsTiquetes } from '../interfaces/forms-tiquetes';
import { IJuridica } from '../interfaces/forms-juridica';
import { IJuridicaMinuta } from '../interfaces/juridica-minuta';
import { ICompras } from '../interfaces/forms-compras';

@Injectable({
  providedIn: 'root',
})
export class FormsService {
  constructor(private http: HttpClient) {}

  validateFinancieraRegistration(
    tipoDePersona: string,
    tipoDeRelacion: string,
    identification: string
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/workflow/financiera/validateregistration`,
        {
          params: new HttpParams().appendAll({
            tipoPersona: tipoDePersona,
            tipoRelacion: tipoDeRelacion,
            identificator: identification,
          }),
          reportProgress: true,
        }
      )
    );
  }

  getJuridicaValidateNumeroSolicitud(
    ConvenioResponsable: string,
    NumeroSolicitud: string
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/validate/numerosolicitud`,
        {
          params: new HttpParams().appendAll({
            ConvenioResponsable,
            NumeroSolicitud,
          }),
          reportProgress: true,
        }
      )
    );
  }

  getJuridicaValidateNumeroContrato(
    ConvenioResponsable: string,
    NumeroContrato: string
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/validate/numerocontrato`,
        {
          params: new HttpParams().appendAll({
            ConvenioResponsable,
            NumeroContrato,
          }),
          reportProgress: true,
        }
      )
    );
  }

  postTest(formsTests: any): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'POST',
        `${environment.backendProtocol}://${environment.backendAddress}/api/request`,
        formsTests,
        {
          headers: new HttpHeaders({
            'content-type': 'application/json',
          }),
          reportProgress: true,
        }
      )
    );
  }

  postUploadFile(name: string, data: ArrayBuffer): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'POST',
        `${environment.backendProtocol}://${environment.backendAddress}/api/files`,
        data,
        {
          headers: new HttpHeaders({
            'content-type': 'application/octet-stream',
          }),
          params: new HttpParams().appendAll({
            name,
          }),
          reportProgress: true,
        }
      )
    );
  }

  postFormsFinancieraRegistration(
    formsFinancieraRegistration: FormsFinancieraRegistration
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'POST',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/financiera/registration`,
        formsFinancieraRegistration,
        {
          headers: new HttpHeaders({
            'content-type': 'application/json',
          }),
          reportProgress: true,
        }
      )
    );
  }

  postFormsFinancieraInvoiceFlow(
    formsFinancieraInvoice: FormsFinancieraInvoice
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'POST',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/financiera/invoice/flow`,
        formsFinancieraInvoice,
        {
          headers: new HttpHeaders({
            'content-type': 'application/json',
          }),
          reportProgress: true,
        }
      )
    );
  }

  postFormJuridicaPostuladosFilesUpload(
    juridicaPostulado: any,
    postuladoId: string
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'POST',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/postulados/files-upload/save`,
        juridicaPostulado,
        {
          headers: new HttpHeaders({
            'content-type': 'application/json',
          }),
          params: new HttpParams().appendAll({
            postuladoid: postuladoId,
          }),
          reportProgress: true,
        }
      )
    );
  }

  postFormJuridicaFlow(juridica: IJuridica): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'POST',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/flow`,
        juridica,
        {
          headers: new HttpHeaders({
            'content-type': 'application/json',
          }),
          reportProgress: true,
        }
      )
    );
  }

  postFormComprasFlow(compras: ICompras): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'POST',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/flow`,
        compras,
        {
          params: new HttpParams().appendAll({
            compra: true,
          }),
          headers: new HttpHeaders({
            'content-type': 'application/json',
          }),
          reportProgress: true,
        }
      )
    );
  }

  getFormJuridica(_id: string): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica`,
        {
          params: new HttpParams().appendAll({
            _id,
          }),
          reportProgress: true,
        }
      )
    );
  }

  putFormJuridica(_id: string, formJuridica: any): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'PUT',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica`,
        formJuridica,
        {
          params: new HttpParams().appendAll({
            _id,
          }),
          reportProgress: true,
        }
      )
    );
  }

  getFormJuridicaOferentesSendNotification(email: string): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/oferentes/sendnotification`,
        {
          headers: new HttpHeaders({
            'content-type': 'application/json',
          }),
          params: new HttpParams().appendAll({
            email,
          }),
          reportProgress: true,
        }
      )
    );
  }

  postFormJuridicaOferentes(juridicaOferente: any): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'POST',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/oferentes`,
        juridicaOferente,
        {
          headers: new HttpHeaders({
            'content-type': 'application/json',
          }),
          reportProgress: true,
        }
      )
    );
  }

  postFormJuridicaMinuta(juridicaMinuta: IJuridicaMinuta): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'POST',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/minuta`,
        juridicaMinuta,
        {
          headers: new HttpHeaders({
            'content-type': 'application/json',
          }),
          reportProgress: true,
        }
      )
    );
  }

  postFormJuridicaMinutaGenerate(
    TipoAdquisicion: string,
    TipoPersona: string,
    juridicaMinutaGenerate: any
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'POST',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/minuta/generate`,
        juridicaMinutaGenerate,
        {
          headers: new HttpHeaders({
            'content-type': 'application/json',
          }),
          params: new HttpParams().appendAll({
            TipoAdquisicion,
            TipoPersona,
          }),
          reportProgress: true,
        }
      )
    );
  }

  postFormJuridicaMinutaGenerateAnexo(
    juridicaMinutaAnexoGenerate: any
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'POST',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/minuta/generate/anexo`,
        juridicaMinutaAnexoGenerate,
        {
          headers: new HttpHeaders({
            /*timeout: `${60000}`,*/
            'content-type': 'application/json',
          }),
          reportProgress: true,
        }
      )
    );
  }

  getFormJuridicaMinutaAvailability(_id: string): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/minuta/availability`,
        {
          params: new HttpParams().appendAll({
            _id,
          }),
          reportProgress: true,
        }
      )
    );
  }

  getJuridicaEvaluadoresAvailability(_id: string): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/evaluadores/availability`,
        {
          params: new HttpParams().appendAll({
            _id,
          }),
          reportProgress: true,
        }
      )
    );
  }

  getFormJuridicaPliegosAvailability(_id: string): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/pliegos/availability`,
        {
          params: new HttpParams().appendAll({
            _id,
          }),
          reportProgress: true,
        }
      )
    );
  }

  getFormJuridicaPostuladosFilesUploadAvailability(
    _id: string
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/postulados/files-upload/availability`,
        {
          params: new HttpParams().appendAll({
            _id,
          }),
          reportProgress: true,
        }
      )
    );
  }

  getFormJuridicaOferentesAvailability(_id: string): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/oferentes/availability`,
        {
          params: new HttpParams().appendAll({
            _id,
          }),
          reportProgress: true,
        }
      )
    );
  }

  getFormJuridicaPostuladosVerifyEncargado(
    _id: string,
    encargado: string
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/postulados/verifyencargado`,
        {
          params: new HttpParams().appendAll({
            _id,
            encargado,
          }),
          reportProgress: true,
        }
      )
    );
  }

  postFormJuridicaPliegosGenerate(
    TipoPersona: string,
    formJuridicaPliegos: any
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'POST',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/pliegos/generate`,
        formJuridicaPliegos,
        {
          headers: new HttpHeaders({
            'content-type': 'application/json',
          }),
          params: new HttpParams().appendAll({
            TipoPersona,
          }),
          reportProgress: true,
        }
      )
    );
  }

  postFormJuridicaPliegos(formJuridicaPliegos: any): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'POST',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/pliegos`,
        formJuridicaPliegos,
        {
          headers: new HttpHeaders({
            'content-type': 'application/json',
          }),
          reportProgress: true,
        }
      )
    );
  }

  getFormJuridicaMinutaVerifyEncargado(
    _id: string,
    encargado: string
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/minuta/verify/encargado`,
        {
          params: new HttpParams().appendAll({
            _id,
            encargado,
          }),
          reportProgress: true,
        }
      )
    );
  }

  getFormJuridicaOferentesConfigurationVerifyEncargado(
    _id: string,
    encargado: string
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/oferentes/verify/encargado`,
        {
          params: new HttpParams().appendAll({
            _id,
            encargado,
          }),
          reportProgress: true,
        }
      )
    );
  }

  getFormJuridicaEulaVerifyEncargado(
    _id: string,
    encargado: string
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/eula/verify/encargado`,
        {
          params: new HttpParams().appendAll({
            _id,
            encargado,
          }),
          reportProgress: true,
        }
      )
    );
  }

  getJuridicaEvaluadoresVerifyEncargado(
    _id: string,
    encargado: string
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/evaluadores/verify/encargado`,
        {
          params: new HttpParams().appendAll({
            _id,
            encargado,
          }),
          reportProgress: true,
        }
      )
    );
  }

  getJuridicaEvaluacionesVerifyEncargado(
    _id: string,
    encargado: string
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/evaluaciones/verify/encargado`,
        {
          params: new HttpParams().appendAll({
            _id,
            encargado,
          }),
          reportProgress: true,
        }
      )
    );
  }

  getFormJuridicaPliegosVerifyEncargado(
    _id: string,
    encargado: string
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/pliegos/verifyencargado`,
        {
          params: new HttpParams().appendAll({
            _id,
            encargado,
          }),
          reportProgress: true,
        }
      )
    );
  }

  getFormJuridicaEulaSaveResponse(
    Juridica: string,
    JuridicaEula: string,
    encargado: string
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/eula/saveresponse`,
        {
          params: new HttpParams().appendAll({
            Juridica,
            JuridicaEula,
            encargado,
          }),
          reportProgress: true,
        }
      )
    );
  }

  getFormJuridicaEulaAvailability(_id: string): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/eula/availability`,
        {
          params: new HttpParams().appendAll({
            _id,
          }),
          reportProgress: true,
        }
      )
    );
  }

  getFormJuridicaEulaMinuta(_id: string): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/eula/minuta`,
        {
          params: new HttpParams().appendAll({
            _id,
          }),
          reportProgress: true,
        }
      )
    );
  }

  getFormJuridicaEulaAnexo(_id: string): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/eula/anexo`,
        {
          params: new HttpParams().appendAll({
            _id,
          }),
          reportProgress: true,
        }
      )
    );
  }

  getFormJuridicaOferentesVerificationRequestCode(
    formJuridicaId: string,
    email: string
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/oferentes/verification/requestcode`,
        {
          params: new HttpParams().appendAll({
            Juridica: formJuridicaId,
            email,
          }),
          reportProgress: true,
        }
      )
    );
  }

  getFormJuridicaEulaVerificationRequestCode(
    formJuridicaId: string
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/eula/verification/requestcode`,
        {
          params: new HttpParams().appendAll({
            Juridica: formJuridicaId,
          }),
          reportProgress: true,
        }
      )
    );
  }

  getFormJuridicaOferentesVerificationVerifyCode(
    _id: string,
    VerificationCode: string,
    email: string
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/oferentes/verification/verifycode`,
        {
          params: new HttpParams().appendAll({
            _id,
            VerificationCode,
            email,
          }),
          reportProgress: true,
        }
      )
    );
  }

  getFormJuridicaEulaVerificationVerifyCode(
    _id: string,
    VerificationCode: string
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/eula/verification/verifycode`,
        {
          params: new HttpParams().appendAll({
            _id,
            VerificationCode,
          }),
          reportProgress: true,
        }
      )
    );
  }

  getFormsCertificadosIngresosRetencionesYears(): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/certificadosingresosretenciones/years`,
        {
          reportProgress: true,
        }
      )
    );
  }

  getFormsCertificadosIngresosRetenciones(
    year: string,
    identificator: string
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/certificadosingresosretenciones`,
        {
          params: new HttpParams().appendAll({
            year,
            identificator,
          }),
          reportProgress: true,
          responseType: 'blob',
        }
      )
    );
  }

  postFormsCoordinacionLogisticaFlow(
    formsCoordinacionLogistica: FormsTiquetes
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'POST',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/coordinacionlogistica/flow`,
        formsCoordinacionLogistica,
        {
          headers: new HttpHeaders({
            'content-type': 'application/json',
          }),
          reportProgress: true,
        }
      )
    );
  }

  getFormsCoordinacionLogistica(Id: string): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/coordinacionlogistica`,
        {
          params: new HttpParams().appendAll({
            Id,
          }),
          reportProgress: true,
        }
      )
    );
  }

  putFormsCoordinacionLogistica(
    Id: string,
    formsCoordinacionLogistica: any
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'PUT',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/coordinacionlogistica`,
        formsCoordinacionLogistica,
        {
          headers: new HttpHeaders({
            'content-type': 'application/json',
          }),
          params: new HttpParams().appendAll({
            Id,
          }),
          reportProgress: true,
        }
      )
    );
  }

  getConveniosFinanciera(): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/convenios/financiera`,
        {
          reportProgress: true,
        }
      )
    );
  }

  getConveniosJuridica(): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/convenios/juridica`,
        {
          reportProgress: true,
        }
      )
    );
  }

  getAirports(): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/information/airport`,
        {
          reportProgress: true,
        }
      )
    );
  }
}
