import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsComponent } from './components/forms/forms.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'forms/tests',
    component: FormsComponent,
  },
  {
    path: 'forms/financiera/registration',
    component: FormsComponent,
  },
  {
    path: 'forms/financiera/invoice',
    component: FormsComponent,
  },
  {
    path: 'forms/juridica/request',
    component: FormsComponent,
  },
  {
    path: 'forms/juridica/request/:id/eula',
    component: FormsComponent,
  },
  {
    path: 'forms/coordinacionlogistica',
    component: FormsComponent,
  },
  {
    path: 'forms/coordinacionlogistica/:id/fillquotations',
    component: FormsComponent,
  },
  {
    path: 'forms/coordinacionlogistica/:id/selectquotation',
    component: FormsComponent,
  },
  {
    path: 'forms/certificadosingresosretenciones',
    component: FormsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
