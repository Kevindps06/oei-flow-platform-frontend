import { Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router, private loginService: LoginService) {}

  ngOnInit(): void {
    if (!this.loginService.user) {
      this.loginService.loadUser();
    }
  }

  isRoute(route: string): Boolean {
    return this.router.url === route;
  }

  startWithRoute(route: string): Boolean {
    return this.router.url.startsWith(route);
  }

  isLoggedIn(): Boolean {
    return this.loginService.loggedInUser() !== undefined;
  }

  loggedInUserName(): String | undefined {
    return this.loginService.user?.displayName;
  }

  loggedInUserAvatar(): SafeUrl | String | undefined {
    return this.loginService.user?.avatar;
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
