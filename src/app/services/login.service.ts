import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import {
  AuthenticationResult,
  BrowserAuthError,
  InteractionType,
  PublicClientApplication,
} from '@azure/msal-browser';
import { Utils } from '../classes/utils';
import { SharedService } from './shared.service';
import { Client } from '@microsoft/microsoft-graph-client';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { OAuthSettings } from 'src/oauth';
import { User } from '../interfaces/user';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';

export interface idTokenClaims {
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private graphClient!: Client;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private msalService: MsalService,
    private sanitizer: DomSanitizer,
    private location: Location
  ) {}

  activeAccoount() {
    return this.msalService.instance.getActiveAccount();
  }

  loggedInUser(): boolean {
    const activeAccount = this.msalService.instance.getActiveAccount();

    if (!activeAccount || this.loadingUser) return false;

    if (
      Math.floor(new Date().getTime() / 1000.0) >
      (activeAccount.idTokenClaims as idTokenClaims).exp
    ) {
      this.msalService.instance.setActiveAccount(null);

      this.sharedService.pushToastMessage({
        id: Utils.makeRandomString(4),
        title: `Sesion expirada`,
        description: `Su anterior sesion ha expirado, vuelva a iniciar sesion.`,
      });

      if (
        this.router.url.split('?')[0] !== '/login' &&
        this.router.url.split('?')[0] !== '/'
      ) {
        this.router.navigate(['/login']);
      }

      return false;
    }

    return true;
  }

  userLogin() {
    const taskId: string = this.sharedService.pushWaitTask({
      description: 'Iniciando sesion...',
      progress: 0,
    }) as string;

    this.msalService.loginPopup().subscribe(
      async (res: AuthenticationResult) => {
        this.msalService.instance.setActiveAccount(res.account);

        this.sharedService.pushWaitTask({
          id: taskId,
          progress: 100,
        });

        await this.loadUser();

        this.sharedService.pushToastMessage({
          id: Utils.makeRandomString(4),
          title: `Bienvenido ${this.user?.givenName}`,
          description: `Hola ${this.user?.givenName}, esperamos tengas la mejor de las estancias.`,
        });

        this.location.back();

        this.sharedService.removeWaitTask({
          id: taskId,
        });
      },
      (err: BrowserAuthError) => {
        this.sharedService.pushToastMessage({
          id: Utils.makeRandomString(4),
          title: `No se ha iniciado sesion`,
          description: `No se ha completado el inicio de sesion, vuelva a intentarlo.`,
        });

        this.sharedService.removeWaitTask({
          id: taskId,
        });
      }
    );
  }

  userLogout() {
    this.msalService.logout();
  }

  user!: User;
  loadingUser: boolean = false;

  async loadUser() {
    if (!this.loggedInUser()) return;

    const taskId = this.sharedService.pushWaitTask({
      description: 'Obteniendo informacion de usuario...',
      progress: 0,
    });

    if (!this.user) {
      this.loadingUser = true;

      this.user = await this.getGraphUser();

      this.sharedService.pushWaitTask({
        id: taskId,
        progress: 50,
      });

      try {
        this.user.avatar = this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(await this.getGraphProfilePhoto())
        );
      } catch (err) {}

      this.loadingUser = false;
    }

    this.sharedService.pushWaitTask({
      id: taskId,
      progress: 100,
    });

    this.sharedService.removeWaitTask({
      id: taskId,
    });
  }

  private async getGraphUser(): Promise<User> {
    // Create an authentication provider for the current user
    const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(
      this.msalService.instance as PublicClientApplication,
      {
        account: this.msalService.instance.getActiveAccount()!,
        scopes: OAuthSettings.scopes,
        interactionType: InteractionType.Popup,
      }
    );

    // Initialize the Graph client
    this.graphClient = Client.initWithMiddleware({
      authProvider: authProvider,
    });

    // Get the user from Graph (GET /me)
    const graphUser: MicrosoftGraph.User = await this.graphClient
      .api('/me')
      .select('displayName,givenName,mail,userPrincipalName')
      .get();

    const user: User = new User();
    user.displayName = graphUser.displayName ?? '';
    user.givenName = graphUser.givenName ?? '';
    // Prefer the mail property, but fall back to userPrincipalName
    user.mail = graphUser.mail ?? graphUser.userPrincipalName ?? '';

    // Use default avatar
    user.avatar = '../../assets/azure-logo.png';

    return user;
  }

  private async getGraphProfilePhoto(): Promise<Blob> {
    const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(
      this.msalService.instance as PublicClientApplication,
      {
        account: this.msalService.instance.getActiveAccount()!,
        scopes: OAuthSettings.scopes,
        interactionType: InteractionType.Popup,
      }
    );

    this.graphClient = Client.initWithMiddleware({
      authProvider: authProvider,
    });

    const graphProfilePhoto: Blob = await this.graphClient
      .api('/me/photo/$value')
      .get();

    return graphProfilePhoto;
  }
}
