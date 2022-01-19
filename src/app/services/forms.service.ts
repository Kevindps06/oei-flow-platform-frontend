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
import { FormsJuridicaContratacion } from '../interfaces/forms-juridica-contratacion';
import { FormsJuridicaContratacionConvenioRequest } from '../interfaces/forms-juridica-contratacion-convenio-request';
import { environment } from 'src/environments/environment';
import { FormsFinancieraInvoice } from '../interfaces/forms-financiera-invoice';
import { FormsCoordinacionLogistica } from '../interfaces/forms-coordinacionlogistica';

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
        `${environment.protocol}://${environment.backendAddress}/api/workflow/validateUser`,
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
        `${environment.protocol}://${environment.backendAddress}/api/request`,
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
        `${environment.protocol}://${environment.backendAddress}/api/uploadfile`,
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
        `${environment.protocol}://${environment.backendAddress}/api/forms/financiera/registration`,
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

  postFormsFinancieraInvoice(
    formsFinancieraInvoice: FormsFinancieraInvoice
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'POST',
        `${environment.protocol}://${environment.backendAddress}/api/forms/financiera/invoice`,
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

  postFormsCoordinacionLogistica(
    formsCoordinacionLogistica: FormsCoordinacionLogistica
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'POST',
        `${environment.protocol}://${environment.backendAddress}/api/forms/coordinacionlogistica`,
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
        `${environment.protocol}://${environment.backendAddress}/api/forms/coordinacioneslogisticas`,
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
        `${environment.protocol}://${environment.backendAddress}/api/forms/coordinacioneslogisticas`,
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

  getConvenios(showAll: boolean = false): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.protocol}://${environment.backendAddress}/api/convenios`,
        {
          params: new HttpParams().appendAll({
            showAll: showAll,
          }),
          reportProgress: true,
        }
      )
    );
  }

  getAirports(): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.protocol}://${environment.backendAddress}/api/information/airports`,
        {
          reportProgress: true,
        }
      )
    );
  }

  postFormsJuridicaContratacionConvenioRequest(
    formsJuridicaContratacionConvenioRequest: FormsJuridicaContratacionConvenioRequest
  ): Observable<any> {
    return new Observable((success) => {
      this.http
        .request(
          new HttpRequest(
            'POST',
            `https://prod-24.brazilsouth.logic.azure.com:443/workflows/f4f00890eb194d0da62fe26c2d6616d0/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=NdC4fjPyl1wYTOgWTBOSEqUvdeKEZPPO3ycToyQhRzA`,
            [formsJuridicaContratacionConvenioRequest],
            {
              reportProgress: true,
            }
          )
        )
        .pipe(
          map((event) => {
            success.next(event);
            switch (event.type) {
              case HttpEventType.Response:
                success.complete();
                break;
            }
          }),
          catchError((err) => {
            return throwError(err);
          })
        )
        .subscribe();
    });
  }

  submitFormsJuridicaContratacion(
    formsJuridicaContratacion: FormsJuridicaContratacion
  ): Observable<any> {
    return new Observable((success) => {
      this.http
        .request(
          new HttpRequest(
            'POST',
            `https://prod-25.brazilsouth.logic.azure.com:443/workflows/82f03002773e4a20a0d73d782d39ef18/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=h2Bpo6-VDFhG5WJxdRj-DbEqgk76ojBKiM-5wJuMBBc`,
            formsJuridicaContratacion,
            {
              reportProgress: true,
            }
          )
        )
        .pipe(
          map((event) => {
            success.next(event);
            switch (event.type) {
              case HttpEventType.Response:
                success.complete();
                break;
            }
          }),
          catchError((err) => {
            return throwError(err);
          })
        )
        .toPromise();
    });
  }
}
