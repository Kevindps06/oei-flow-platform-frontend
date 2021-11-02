import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormsComponent } from './components/forms/forms.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { OnlyNumbersDirective } from './directives/onlynumber.directive';
import { DirectaComponent } from './components/forms/juridica/contratacion/directa/directa/directa.component';
import { SimplificadaysupersimplificadaComponent } from './components/forms/juridica/contratacion/simplificadaysupersimplificada/simplificadaysupersimplificada.component';
import { LicitacionComponent } from './components/forms/juridica/contratacion/licitacion/licitacion.component';
import { ConsultoresComponent } from './components/forms/juridica/contratacion/directa/excepcion/consultores/consultores.component';
import { SinlimiteComponent } from './components/forms/juridica/contratacion/directa/excepcion/sinlimite/sinlimite.component';
import { FormsJuridicaContratacionConvenioRequestComponent } from './components/forms/juridica/contratacion/convenio/request/request.component';
import { FormsJuridicaContratacionRequestComponent } from './components/forms/juridica/contratacion/request/request.component';
import { LoginComponent } from './components/login/login.component';
import { FormsFinancieraRegistrationComponent } from './components/forms/financiera/registration/registration.component';
import { FormsFinancieraInvoiceComponent } from './components/forms/financiera/invoice/invoice.component';
import { GlobalHttpInterceptorService } from './services/global-http-interceptor.service';
import { UploadFilesComponent } from './components/upload-files/upload-files.component';
import { HomeComponent } from './components/home/home.component';
import { CoordinacionlogisticaComponent } from './components/forms/coordinacionlogistica/coordinacionlogistica.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    FormsComponent,
    OnlyNumbersDirective,
    DirectaComponent,
    SimplificadaysupersimplificadaComponent,
    LicitacionComponent,
    ConsultoresComponent,
    SinlimiteComponent,
    FormsJuridicaContratacionRequestComponent,
    FormsJuridicaContratacionConvenioRequestComponent,
    LoginComponent,
    FormsFinancieraRegistrationComponent,
    FormsFinancieraInvoiceComponent,
    UploadFilesComponent,
    HomeComponent,
    CoordinacionlogisticaComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalHttpInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
