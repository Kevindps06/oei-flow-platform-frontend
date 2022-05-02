import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  getAuthToken(): Observable<any> {
    return this.http.request(
      'GET',
      `${environment.backendProtocol}://${environment.backendAddress}/api/auth/token`,
      {
        params: new HttpParams().appendAll({
          client: 'default',
          secret: 'tluafed',
        }),
        reportProgress: true,
        observe: 'response',
      }
    );
  }
}
