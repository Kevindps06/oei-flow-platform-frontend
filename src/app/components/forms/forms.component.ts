import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  Event,
} from '@angular/router';
import { Convenio } from 'src/app/interfaces/Convenio';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css'],
})
export class FormsComponent implements OnInit {
  title!: string;
  description!: string;

  currentRoute: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Show progress spinner or progress bar
        console.log('Route change detected');
      }

      if (event instanceof NavigationEnd) {
        // Hide progress spinner or progress bar
        this.currentRoute = event.url;
        console.log(event);
      }

      if (event instanceof NavigationError) {
        // Hide progress spinner or progress bar

        // Present error to user
        console.log(event.error);
      }
    });
  }

  convenios: Convenio[] = [];

  ngOnInit(): void {
    switch (this.router.url.split('?')[0]) {
      // Financiera
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
      // Juridica
      case '/forms/juridica':
        this.title = 'Gestion juridica';
        //this.description = 'Formulario de gestion juridica.';
        return;
      case `/forms/juridica/${this.activatedRoute.snapshot.params.id}/minuta`:
        this.title = 'Gestion juridica minuta';
        //this.description = 'Formulario de gestion juridica minuta descripcion.';
        return;
      case `/forms/juridica/${this.activatedRoute.snapshot.params.id}/eula`:
        this.title = 'Gestion juridica eula';
        //this.description = 'Formulario de gestion juridica eula descripcion.';
        return;
      case `/forms/juridica/${this.activatedRoute.snapshot.params.id}/pliegos`:
        this.title = 'Gestion juridica pliegos';
        //this.description = 'Formulario de gestion juridica pliegos descripcion.';
        return;
      case `/forms/juridica/${this.activatedRoute.snapshot.params.id}/oferentes`:
        this.title = 'Gestion juridica oferentes';
        //this.description = 'Formulario de gestion juridica oferentes descripcion.';
        return;
      case `/forms/juridica/${this.activatedRoute.snapshot.params.id}/oferentes/configuration`:
        this.title = 'Gestion juridica oferentes configuracion';
        //this.description = 'Formulario de gestion juridica oferentes configuracion descripcion.';
        return;
      case `/forms/juridica/${this.activatedRoute.snapshot.params.id}/evaluadores`:
        this.title = 'Gestion juridica evaluadores';
        //this.description = 'Formulario de gestion juridica evaluadores descripcion.';
        return;
      case `/forms/juridica/${this.activatedRoute.snapshot.params.id}/evaluaciones`:
        this.title = 'Gestion juridica evaluaciones';
        //this.description = 'Formulario de gestion juridica evaluaciones descripcion.';
        return;
      // Compras
      case '/forms/compras':
        this.title = 'Gestion compras';
        //this.description = 'Formulario de gestion de adquisicion.';
        return;
      // Logistica
      case '/forms/logistica':
        this.title = 'Gestion logistica';
        //this.description = 'Gestion logistica';
        return;
      case `/forms/logistica/${this.activatedRoute.snapshot.params.id}/fillquotations`:
        this.title = 'Gestion logistica fill quotations';
        //this.description = 'Gestion logistica fill quotations';
        return;
      case `/forms/logistica/${this.activatedRoute.snapshot.params.id}/selectquotation`:
        this.title = 'Gestion logistica select quotation';
        //this.description = 'Gestion logistica select quotation descripcion';
        return;
      case '/forms/certificadosingresosretenciones':
        this.title = 'Gestion de certificados de ingresos y retenciones';
        //this.description =
        'Aqui podra realizar procesos como:\n- Descarga de certificado de ingresos y retenciones';
        return;
      case '/forms/tests':
        this.title = 'Test';
        //this.description = '';
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
