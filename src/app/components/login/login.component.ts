import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Utils } from 'src/app/classes/utils';
import { WaitTask } from 'src/app/interfaces/WaitTask';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  waitTasks: WaitTask[] = [];

  setWaitTasks(waitTasks: WaitTask[]) {
    setTimeout(() => {
      this.waitTasks = waitTasks;
    }, 0);
  }

  loading: boolean = false;

  email: string = '';
  password: string = '';

  invalidUser: boolean = false;

  public static user: any | undefined;

  constructor(private loginServie: LoginService) {}

  ngOnInit(): void {}

  invalidateUser() {
    LoginComponent.user = undefined;
    this.invalidUser = false;
  }

  validateEmail(email: string = this.email) {
    return Utils.validateEmail(email);
  }

  validateUser() {
    var taskId: string;
    this.loginServie.validateUser(this.email, this.password).subscribe(
      (event) => {
        switch (event.type) {
          case HttpEventType.Sent:
            taskId = Utils.makeRandomString(4);
            this.waitTasks.push({
              id: taskId,
              description: 'Validando informacion...',
              total: 0,
              current: 0,
              progress: 0,
            });
            break;
          case HttpEventType.DownloadProgress:
            let taskIndex = this.waitTasks.findIndex(
              (element) => element.id === taskId
            );
            this.waitTasks[taskIndex].current = event.loaded;
            this.waitTasks[taskIndex].progress = Math.round(
              (event.loaded * 100) / this.waitTasks[taskIndex].total
            );
            break;
          case HttpEventType.Response:
            LoginComponent.user = event.body.userInfo.value[0];

            this.waitTasks.splice(
              this.waitTasks.findIndex((element) => element.id === taskId)
            );
            break;
        }
      },
      (err) => {
        if (err.status === 404) {
          LoginComponent.user = undefined;
          this.invalidUser = true;

          this.waitTasks.splice(
            this.waitTasks.findIndex((element) => element.id === taskId)
          );
        }
      }
    );
  }

  isValid() {
    return this.email && this.password;
  }

  animationstart(event: AnimationEvent) {
    if (event.animationName === 'fadeIn') {
      this.loading = true;
    }
  }

  animationend(event: AnimationEvent) {
    if (event.animationName === 'fadeOut') {
      this.loading = false;
    }
  }
}
