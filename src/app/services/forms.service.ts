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
import { FormsCoordinacionLogistica } from '../interfaces/forms-coordinacionlogistica';
import { FormsJuridicaRequest } from '../interfaces/forms-juridica-request';

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

  postFormsJuridicaRequestFlow(
    formsJuridicaRequest: FormsJuridicaRequest
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'POST',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/request/flow`,
        formsJuridicaRequest,
        {
          headers: new HttpHeaders({
            'content-type': 'application/json',
          }),
          reportProgress: true,
        }
      )
    );
  }

  getFormsJuridicaRequest(_id: string): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/request`,
        {
          params: new HttpParams().appendAll({
            _id,
          }),
          reportProgress: true,
        }
      )
    );
  }

  putFormsJuridicaRequest(
    _id: string,
    formsJuridicaRequest: any
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'PUT',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/request`,
        formsJuridicaRequest,
        {
          params: new HttpParams().appendAll({
            _id,
          }),
          reportProgress: true,
        }
      )
    );
  }

  postFormsJuridicaRequestMinuta(
    formsJuridicaRequestMinuta: any
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'POST',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/request/minuta`,
        formsJuridicaRequestMinuta,
        {
          headers: new HttpHeaders({
            'content-type': 'application/json',
          }),
          reportProgress: true,
        }
      )
    );
  }

  postFormsJuridicaRequestMinutaGenerate(
    TipoAdquisicion: string,
    TipoPersona: string,
    formsJuridicaRequestMinuta: any
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'POST',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/request/minuta/generate`,
        formsJuridicaRequestMinuta,
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

  getFormsJuridicaRequestMinutaAvailability(_id: string): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/request/minuta/availability`,
        {
          params: new HttpParams().appendAll({
            _id,
          }),
          reportProgress: true,
        }
      )
    );
  }

  getFormsJuridicaRequestMinutaVerifyEncargado(
    _id: string,
    EmailEncargado: string
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/request/minuta/verifyencargado`,
        {
          params: new HttpParams().appendAll({
            _id,
            encargado: EmailEncargado,
          }),
          reportProgress: true,
        }
      )
    );
  }

  getFormsJuridicaRequestEulaAvailability(_id: string): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/request/eula/availability`,
        {
          params: new HttpParams().appendAll({
            _id,
          }),
          reportProgress: true,
        }
      )
    );
  }

  getFormsJuridicaRequestEulaRequestVerificationCode(
    JuridicaRequest: string
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/request/eula/requestverificationcode`,
        {
          params: new HttpParams().appendAll({
            JuridicaRequest: JuridicaRequest,
          }),
          reportProgress: true,
        }
      )
    );
  }

  getFormsJuridicaRequestEulaVerifyVerificationCode(
    _id: string,
    VerificationCode: string
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/forms/juridica/request/eula/verifyverificationcode`,
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
    formsCoordinacionLogistica: FormsCoordinacionLogistica
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
