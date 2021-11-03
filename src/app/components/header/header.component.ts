import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Input() loggedUser: any;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {}

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
