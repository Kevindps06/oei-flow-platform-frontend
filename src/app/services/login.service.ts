import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import {
  AccountInfo,
  AuthenticationResult,
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
    private sanitizer: DomSanitizer
  ) {}

  loggedInUser(): AccountInfo | undefined {
    const activeAccount = this.msalService.instance.getActiveAccount();

    if (activeAccount === null) return undefined;

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

      this.router.navigate(['/']);

      return undefined;
    }

    return activeAccount;
  }

  userLogin() {
    let taskId: string = this.sharedService.pushWaitTask({
      description: 'Iniciando sesion...',
      progress: 0,
    }) as string;

    this.msalService
      .loginPopup()
      .subscribe(async (res: AuthenticationResult) => {
        this.sharedService.pushWaitTask({
          id: taskId,
          progress: 100,
        });

        this.msalService.instance.setActiveAccount(res.account);

        this.user = await this.getGraphUser();
        this.user.avatar = this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(await this.getGraphProfilePhoto())
        );

        this.sharedService.pushToastMessage({
          id: Utils.makeRandomString(4),
          title: `Bienvenido`,
          description: `Hola ${this.user?.givenName}, esperamos tengas la mejor de las estancias.`,
        });

        this.router.navigate(['/']);
      });
  }

  userLogout() {
    this.msalService.logout();
  }

  user!: User;

  async loadUser() {
    if (!this.loggedInUser()) return;

    let taskId: string = this.sharedService.pushWaitTask({
      description: 'Obteniendo informacion de usuario...',
      progress: 0,
    }) as string;

    if (!this.user) {
      this.user = await this.getGraphUser();

      try {
        this.user.avatar = this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(await this.getGraphProfilePhoto())
        );
      } catch (err) {
        console.log(err);
      }
    }

    this.sharedService.pushWaitTask({
      id: taskId,
      progress: 100,
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
