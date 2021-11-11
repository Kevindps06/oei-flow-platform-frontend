import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Utils } from 'src/app/classes/utils';
import { LoginService } from 'src/app/services/login.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';

  invalidUser: boolean = false;

  constructor(
    private loginService: LoginService,
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  invalidateUser() {
    this.invalidUser = false;
    this.sharedService.setLoggedUser(undefined);
  }

  validateEmail(email: string = this.email) {
    return Utils.validateEmail(email);
  }

  validateUser() {
    var taskId: string;
    this.loginService.validateUser(this.email, this.password).subscribe(
      (event) => {
        switch (event.type) {
          case HttpEventType.Sent:
            taskId = Utils.makeRandomString(4);
            this.sharedService.pushWaitTask({
              id: taskId,
              description: 'Validando informacion...',
              progress: 0,
            });
            break;
          case HttpEventType.DownloadProgress:
            this.sharedService.pushWaitTask({
              id: taskId,
              progress: Math.round((event.loaded * 100) / event.total),
            });
            break;
          case HttpEventType.Response:
            this.sharedService.setLoggedUser(event.body);

            this.sharedService.removeWaitTask({
              id: taskId,
            });

            this.sharedService.pushToastMessage({
              id: Utils.makeRandomString(4),
              title: `Bienvenido ${event.body.userInfo.fields.Title}`,
              description: `Hola ${event.body.userInfo.fields.Title}, esperamos tengas la mejor de las estancias.`,
            });

            this.router.navigateByUrl('/');
            break;
        }
      },
      (err) => {
        if (err.status === 404) {
          this.invalidateUser();

          this.sharedService.removeWaitTask({
            id: taskId,
          });
        }
      }
    );
  }

  isValid() {
    return this.email && this.password;
  }
}
