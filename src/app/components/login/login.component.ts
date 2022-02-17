import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';
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

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {}

  validateEmail(email: string = this.email) {
    return Utils.validateEmail(email);
  }

  isLoggedIn(): Boolean {
    return this.loginService.loggedInUser() !== undefined;
  }

  userLoginLogout() {
    if (this.isLoggedIn()) {
      this.loginService.userLogout();
    } else {
      this.loginService.userLogin();
    }
  }

  isValid() {
    return true;
  }
}
