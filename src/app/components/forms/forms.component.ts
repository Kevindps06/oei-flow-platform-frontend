import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormsService } from 'src/app/services/forms.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Convenio } from 'src/app/interfaces/Convenio';
import { FormsFinancieraRegistration } from 'src/app/interfaces/forms-financiera-registration';
import { WaitTask } from 'src/app/interfaces/WaitTask';
import { HttpEventType } from '@angular/common/http';
import { Utils } from 'src/app/classes/utils';
import { FormsJuridicaContratacion } from 'src/app/interfaces/forms-juridica-contratacion';
import { FormsJuridicaContratacionRequest } from 'src/app/interfaces/forms-juridica-contratacion-request';
import { ToastMessage } from 'src/app/interfaces/toast-message';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css'],
})
export class FormsComponent implements OnInit {
  waitTasks: WaitTask[] = [];

  setWaitTasks(waitTasks: WaitTask[]) {
    setTimeout(() => {
      this.waitTasks = waitTasks;
    }, 0);
  }

  title!: string;
  description!: string;

  constructor(
    private formsService: FormsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  convenios: Convenio[] = [];

  ngOnInit(): void {
    switch (this.router.url) {
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
      case '/forms/certificadosingresosretenciones':
        this.title = 'Gestion de certificados de ingresos y retenciones';
        this.description =
          'Aqui podra realizar procesos como:\n- Descarga de certificado de ingresos y retenciones';
        return;
      case '/forms/coordinacionlogistica':
        this.title = 'Coordinacion logistica';
        this.description = 'Coordinacion logistica descripcion';
        return;
      case '/forms/coordinacionlogistica/' +
        this.route.snapshot.params.id +
        '/fillquotations':
        this.title = 'Coordinacion logistica fill quotations';
        this.description = 'Coordinacion logistica fill quotations descripcion';
        return;
      case '/forms/coordinacionlogistica/' +
        this.route.snapshot.params.id +
        '/selectquotation':
        this.title = 'Coordinacion logistica select quotation';
        this.description =
          'Coordinacion logistica select quotation descripcion';
        return;
      case '/forms/juridica/request':
        this.title = 'Formulario de gestion juridica';
        this.description = 'Formulario de gestion juridica descripcion.';
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
    return this.router.url.endsWith(route);
  }

  onSubmitFinancieraRegistrationForm(
    financieraRegistrationForm: FormsFinancieraRegistration
  ) {
    var taskId: string;
    this.formsService
      .postFormsFinancieraRegistration(financieraRegistrationForm)
      .subscribe((event) => {
        switch (event.type) {
          case HttpEventType.Sent:
            taskId = Utils.makeRandomString(4);
            this.waitTasks.push({
              id: taskId,
              description: 'Subiendo información...',
              total: 0,
              current: 0,
              progress: 0,
            });
            break;
          case HttpEventType.UploadProgress:
            let taskIndex = this.waitTasks.findIndex(
              (element) => element.id === taskId
            );
            this.waitTasks[taskIndex].total = event.total;
            this.waitTasks[taskIndex].current = event.loaded;
            this.waitTasks[taskIndex].progress = Math.round(
              (event.loaded * 100) / event.total
            );
            break;
          case HttpEventType.Response:
            this.waitTasks.splice(
              this.waitTasks.findIndex((element) => element.id === taskId),
              1
            );
            break;
        }
      });
  }

  onSubmitFormsJuridicaContratacionConvenioRequest(
    formsJuridicaContratacionConvenioRequest: any
  ) {}

  onSubmitFormsJuridicaContratacionRequest(
    formsJuridicaContratacionRequest: FormsJuridicaContratacionRequest
  ) {}

  onSubmitFormsJuridicaContratacion(
    formsJuridicaContratacion: FormsJuridicaContratacion
  ) {
    var taskId: string;
    this.formsService
      .submitFormsJuridicaContratacion(formsJuridicaContratacion)
      .subscribe((event) => {
        switch (event.type) {
          case HttpEventType.Sent:
            taskId = Utils.makeRandomString(4);
            this.waitTasks.push({
              id: taskId,
              description: 'Subiendo información...',
              total: 0,
              current: 0,
              progress: 0,
            });
            break;
          case HttpEventType.UploadProgress:
            let taskIndex = this.waitTasks.findIndex(
              (element) => element.id === taskId
            );
            this.waitTasks[taskIndex].total = event.total;
            this.waitTasks[taskIndex].current = event.loaded;
            this.waitTasks[taskIndex].progress = Math.round(
              (event.loaded * 100) / event.total
            );
            break;
          case HttpEventType.Response:
            this.waitTasks.splice(
              this.waitTasks.findIndex((element) => element.id === taskId),
              1
            );
            break;
        }
      });
  }
}
