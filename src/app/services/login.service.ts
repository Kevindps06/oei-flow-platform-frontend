import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  user: any | undefined;

  constructor(private http: HttpClient) {}

  validateUser(
    email: string,
    password: string,
  ): Observable<any> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `http://${environment.backendAddress}/api/platform/validateUser`,
        {
          reportProgress: true,
          params: new HttpParams().appendAll({
            email: email,
            password: password,
          }),
        }
      )
    );
  }
}
