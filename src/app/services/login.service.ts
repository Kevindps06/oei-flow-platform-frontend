import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  validateUser(email: string, password: string): Observable<any> {
    console.log('Protocol:', environment.protocol)
    console.log('Backend Address:', environment.backendAddress);

    return this.http.request(
      new HttpRequest(
        'GET',
        `${environment.protocol}://${environment.backendAddress}/api/platform/validateUser`,
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
