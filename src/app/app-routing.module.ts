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
    path: 'forms/financiera/registration',
    component: FormsComponent,
  },
  {
    path: 'forms/financiera/invoice',
    component: FormsComponent,
  },
  {
    path: 'forms/juridica',
    component: FormsComponent,
  },
  {
    path: 'forms/juridica/:id/minuta',
    component: FormsComponent,
  },
  {
    path: 'forms/juridica/:id/eula',
    component: FormsComponent,
  },
  {
    path: 'forms/compras',
    component: FormsComponent,
  },
  {
    path: 'forms/compras/:id/eula',
    component: FormsComponent,
  },
  {
    path: 'forms/tiquetes',
    component: FormsComponent,
  },
  {
    path: 'forms/tiquetes/:id/fillquotations',
    component: FormsComponent,
  },
  {
    path: 'forms/tiquetes/:id/selectquotation',
    component: FormsComponent,
  },
  {
    path: 'forms/certificadosingresosretenciones',
    component: FormsComponent,
  },
  {
    path: 'forms/tests',
    component: FormsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
