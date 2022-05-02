import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { nextTick } from 'process';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalHttpInterceptorService {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      req.url.startsWith(
        `${environment.backendProtocol}://${environment.backendAddress}/api`
      ) &&
      req.url !==
        `${environment.backendProtocol}://${environment.backendAddress}/api/auth/token`
    ) {
      return this.authService.getAuthToken().pipe(
        mergeMap((res) => {
          return next.handle(
            req.clone({
              setHeaders: {
                'x-access-token': res.body.token,
              },
            })
          );
        })
      );
    }

    return next.handle(req);
  }
}
