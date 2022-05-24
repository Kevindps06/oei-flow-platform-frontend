import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormsComponent } from './components/forms/forms.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { OnlyNumbersDirective } from './directives/onlynumber.directive';
import { FormsJuridicaComponent } from './components/forms/juridica/juridica.component';
import { LoginComponent } from './components/login/login.component';
import { FormsFinancieraRegistrationComponent } from './components/forms/financiera/registration/registration.component';
import { FormsFinancieraInvoiceComponent } from './components/forms/financiera/invoice/invoice.component';
import { GlobalHttpInterceptorService } from './services/global-http-interceptor.service';
import { UploadFilesComponent } from './components/upload-files/upload-files.component';
import { HomeComponent } from './components/home/home.component';
import { FormsTiquetesComponent } from './components/forms/tiquetes/tiquetes.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { FormsTiquetesFillQuotationsComponent } from './components/forms/tiquetes/fill-quotations/fill-quotations.component';
import { FormsTiquetesSelectQuotationComponent } from './components/forms/tiquetes/select-quotation/select-quotation.component';
import { TestsComponent } from './components/forms/tests/tests.component';
import { MsalModule, MsalService, MSAL_INSTANCE } from '@azure/msal-angular';
import {
  BrowserCacheLocation,
  IPublicClientApplication,
  PublicClientApplication,
} from '@azure/msal-browser';
import { FormsCertificadosIngresosRetencionesComponent } from './components/forms/certificadosingresosretenciones/certificadosingresosretenciones.component';
import { OAuthSettings } from 'src/oauth';
import { MaxOnlyPriceNumbersDirective } from './directives/max-only-price-numbers.directive';
import { MinOnlyPriceNumbersDirective } from './directives/min-only-price-numbers.directive';
import { FormsJuridicaEulaComponent } from './components/forms/juridica/eula/eula.component';
import { FormsJuridicaMinutaComponent } from './components/forms/juridica/minuta/minuta.component';
import { ComprasComponent } from './components/forms/compras/compras.component';
import { FormsJuridicaPliegosComponent } from './components/forms/juridica/pliegos/pliegos.component';
import { FormsJuridicaPostuladosComponent } from './components/forms/juridica/postulados/postulados.component';
import { FormsJuridicaPostuladosFilesUploadComponent } from './components/forms/juridica/postulados/files-upload/files-upload.component';

let msalInstance: IPublicClientApplication | undefined = undefined;

export function MSALInstanceFactory(): IPublicClientApplication {
  msalInstance =
    msalInstance ??
    new PublicClientApplication({
      auth: {
        clientId: OAuthSettings.appId,
        redirectUri: OAuthSettings.redirectUri,
        postLogoutRedirectUri: OAuthSettings.redirectUri,
      },
      cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage,
      },
    });

  return msalInstance;
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    FormsComponent,
    OnlyNumbersDirective,
    FormsJuridicaComponent,
    LoginComponent,
    FormsFinancieraRegistrationComponent,
    FormsFinancieraInvoiceComponent,
    UploadFilesComponent,
    HomeComponent,
    FormsTiquetesComponent,
    DatePickerComponent,
    FormsTiquetesFillQuotationsComponent,
    FormsTiquetesSelectQuotationComponent,
    TestsComponent,
    FormsCertificadosIngresosRetencionesComponent,
    MaxOnlyPriceNumbersDirective,
    MinOnlyPriceNumbersDirective,
    FormsJuridicaEulaComponent,
    FormsJuridicaMinutaComponent,
    ComprasComponent,
    FormsJuridicaPliegosComponent,
    FormsJuridicaPostuladosComponent,
    FormsJuridicaPostuladosFilesUploadComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MsalModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalHttpInterceptorService,
      multi: true,
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    MsalService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
