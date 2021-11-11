import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Input() loggedUser: any;

  constructor(private router: Router, private sharedService: SharedService) {}

  ngOnInit(): void {}

  onIniciarSesionBtnClick() {
    this.sharedService.setLoggedUser(undefined)
  }

  isRoute(route: string) {
    return this.router.url === route;
  }

  startWithRoute(route: string) {
    return this.router.url.startsWith(route);
  }

  ifLogeedIn() {
    return this.loggedUser;
  }

  mouseOverLoginButton: boolean = false;

  onMouseOverLoginButton() {
    this.mouseOverLoginButton = true;
  }

  onMouseOutLoginButton() {
    this.mouseOverLoginButton = false;
  }
}
