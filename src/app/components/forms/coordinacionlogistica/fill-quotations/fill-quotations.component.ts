import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Utils } from 'src/app/classes/utils';
import { FormsCoordinacionLogisticaFillQuotations } from 'src/app/interfaces/forms-coordinacionlogistica-fillquotations';
import { FormsService } from 'src/app/services/forms.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-forms-coordinacionlogistica-fillquotations',
  templateUrl: './fill-quotations.component.html',
  styleUrls: ['./fill-quotations.component.css'],
})
export class FormsCoordinacionLogisticaFillQuotationsComponent
  implements OnInit
{
  quotations: FormsCoordinacionLogisticaFillQuotations[] = [];

  aerolinea: string = '';
  trayecto: string = '';
  costo: number = 0;

  constructor(
    private router: Router,
    private formsService: FormsService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    if (!history.state.userInfo || !history.state.plaftformInfo) {
      this.router.navigate(['/login'], {
        state: {
          fromRoute: this.router.url,
        },
      });

      this.sharedService.pushToastMessage({
        id: Utils.makeRandomString(4),
        title: `Acceso inautorizado`,
        description: `Para ingresar a este componente es necesario contar con el acceso autorizado, inicie sesion y vuelva a intentar ingresar.`,
        autohide: 10000,
      });
      return;
    }
  }

  btnAddClick() {
    this.quotations.push({
      Number: this.quotations.length + 1,
      Aerolinea: this.aerolinea,
      Trayecto: this.trayecto,
      Costo: this.costo,
    });
  }

  isValid() {
    return this.aerolinea && this.trayecto && this.costo > 0;
  }
}
