import { Component, OnInit } from '@angular/core';
import { FormsService } from 'src/app/services/forms.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Convenio } from 'src/app/interfaces/Convenio';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css'],
})
export class FormsComponent implements OnInit {
  title!: string;
  description!: string;

  constructor(
    private formsService: FormsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  convenios: Convenio[] = [];

  ngOnInit(): void {
    switch (this.router.url.split('?')[0]) {
      case '/forms/tests':
        this.title = 'Test';
        this.description = '';
        return;
      case '/forms/financiera/registration':
        this.title = 'Registro colaborador o proveedor';
        this.description =
          'El registro es necesario para los procesos:\n- Envio de cuentas de cobro\n- Facturas\n- Anticipos\n- Pagos directos\n- Legalizaciones';
        return;
      case '/forms/financiera/invoice':
        this.title = 'Gestion de cuentas colaborador o proveedor';
        this.description =
          'Aqui podra realizar los siguientes procesos:\n- Envio de cuentas de cobro\n- Facturas\n- Anticipos\n- Pagos directos\n- Legalizaciones';
        return;
      case '/forms/juridica/request':
        this.title = 'Gestion juridica';
        this.description = 'Formulario de gestion juridica descripcion.';
        return;
      case `/forms/juridica/request/${this.activatedRoute.snapshot.params.id}/minuta`:
        this.title = 'Gestion juridica minuta';
        this.description = 'Formulario de gestion juridica minuta descripcion.';
        return;
      case `/forms/juridica/request/${this.activatedRoute.snapshot.params.id}/eula`:
        this.title = 'Gestion juridica eula';
        this.description = 'Formulario de gestion juridica eula descripcion.';
        return;
      case '/forms/coordinacionlogistica':
        this.title = 'Coordinacion logistica';
        this.description = 'Coordinacion logistica descripcion';
        return;
      case `/forms/coordinacionlogistica/${this.activatedRoute.snapshot.params.id}/fillquotations`:
        this.title = 'Coordinacion logistica fill quotations';
        this.description = 'Coordinacion logistica fill quotations descripcion';
        return;
      case `/forms/coordinacionlogistica/${this.activatedRoute.snapshot.params.id}/selectquotation`:
        this.title = 'Coordinacion logistica select quotation';
        this.description =
          'Coordinacion logistica select quotation descripcion';
        return;
      case '/forms/certificadosingresosretenciones':
        this.title = 'Gestion de certificados de ingresos y retenciones';
        this.description =
          'Aqui podra realizar procesos como:\n- Descarga de certificado de ingresos y retenciones';
        return;
    }
  }

  isRoute(route: string) {
    return this.router.url === route;
  }

  startWithRoute(route: string) {
    return this.router.url.startsWith(route);
  }

  endWithRoute(route: string) {
    return this.router.url.split('?')[0].endsWith(route);
  }
}
