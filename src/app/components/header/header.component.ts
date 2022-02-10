import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Input() loggedUser: any;

  constructor(
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {}

  isRoute(route: string): Boolean {
    return this.router.url === route;
  }

  startWithRoute(route: string): Boolean {
    return this.router.url.startsWith(route);
  }

  isLoggedIn(): Boolean {
    return this.loginService.loggedInUser() != null;
  }

  loggedInUserName(): String | undefined {
    return this.loginService.loggedInUser()?.name;
  }

  userLogout() {
    if (this.isLoggedIn()) {
      this.loginService.userLogout();
    }
  }

  mouseOverLoginButton: boolean = false;

  onMouseOverLoginButton() {
    this.mouseOverLoginButton = true;
  }

  onMouseOutLoginButton() {
    this.mouseOverLoginButton = false;
  }
}
