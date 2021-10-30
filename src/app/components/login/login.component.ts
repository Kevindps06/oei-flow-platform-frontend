import { Component, OnInit } from '@angular/core';
import { WaitTask } from 'src/app/interfaces/WaitTask';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  waitTasks: WaitTask[] = [];

  constructor() {}

  ngOnInit(): void {}

  //show hide div variables
  userlogin = true;
  userregister = false;

  //Buttons clicks functionalities
  user_register() {
    this.userlogin = false;
    this.userregister = true;
  }

  user_login() {
    this.userlogin = true;
    this.userregister = false;
  }
}
