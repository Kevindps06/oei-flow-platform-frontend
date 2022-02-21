import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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

  validateFlowUser(
    tipoDePersona: string,
    tipoDeRelacion: string,
    identification: string
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/workflow/validateUser`,
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
            name: name,
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
            Id: Id,
          }),
          reportProgress: true,
        }
      )
    );
  }

  putFormsCoordinacionLogistica(
    formsCoordinacionLogistica: any,
    Id: string
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
            Id: Id,
          }),
          reportProgress: true,
        }
      )
    );
  }

  getConvenios(): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.backendProtocol}://${environment.backendAddress}/api/convenios`,
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
