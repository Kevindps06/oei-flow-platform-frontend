import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo, AuthenticationResult } from '@azure/msal-browser';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Utils } from '../classes/utils';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private router: Router,
    private http: HttpClient,
    private sharedService: SharedService,
    private msalService: MsalService
  ) {}

  validateUser(email: string, password: string): Observable<any> {
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

  loggedInUser(): AccountInfo | null {
    return this.msalService.instance.getActiveAccount();
  }

  userLogin() {
    var taskId: string = Utils.makeRandomString(4);
    this.sharedService.pushWaitTask({
      id: taskId,
      description: 'Iniciando sesion...',
      progress: 0,
    });

    this.msalService.loginPopup().subscribe((res: AuthenticationResult) => {
      this.sharedService.pushWaitTask({
        id: taskId,
        progress: 100,
      });

      this.msalService.instance.setActiveAccount(res.account);

      this.sharedService.removeWaitTask({
        id: taskId,
      });

      this.sharedService.pushToastMessage({
        id: Utils.makeRandomString(4),
        title: `Bienvenido`,
        description: `Hola ${
          this.msalService.instance.getActiveAccount()?.name
        }, esperamos tengas la mejor de las estancias.`,
      });

      this.router.navigate(['/']);
    });
  }

  userLogout() {
    this.msalService.logout();

    this.router.navigate(['/']);
  }
}
