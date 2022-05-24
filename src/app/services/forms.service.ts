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
import { FormsJuridica } from '../interfaces/forms-juridica';

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

  postFormJuridicaFlow(formJuridica: FormsJuridica): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'POST',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/flow`,
        formJuridica,
        {
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

  postFormJuridicaMinuta(formJuridicaMinuta: any): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'POST',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/minuta`,
        formJuridicaMinuta,
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
    formJuridicaMinuta: any
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'POST',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/minuta/generate`,
        formJuridicaMinuta,
        {
          headers: new HttpHeaders({
            'content-type': 'application/json',
          }),
          params: new HttpParams().appendAll({
            TipoAdquisicion,
            TipoPersona,
          }),
          reportProgress: true,
          responseType: 'blob',
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

  getFormJuridicaPostuladosAvailability(_id: string): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/postulados/availability`,
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
    TipoAdquisicion: string,
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
            TipoAdquisicion,
            TipoPersona,
          }),
          reportProgress: true,
          responseType: 'blob',
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
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/minuta/verifyencargado`,
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

  getFormJuridicaPostuladosFilesUploadRequestCode(
    formJuridicaId: string
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/postulados/upload-files/requestcode`,
        {
          params: new HttpParams().appendAll({
            Juridica: formJuridicaId,
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
