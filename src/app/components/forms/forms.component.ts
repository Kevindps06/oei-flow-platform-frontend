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
import { Toast } from 'bootstrap';

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

  @ViewChildren('toastList') toastList!: QueryList<ElementRef>;
  toastMessages: ToastMessage[] = [];

  setToastMessages(toastMessage: ToastMessage) {
    /*setTimeout(() => {
      this.toastMessages.push(toastMessage);
      
      setTimeout(() => {
        const toast = new Toast(
          this.toastList.get(
            this.toastMessages.findIndex(
              (element) => element.id === toastMessage.id
            )
          )?.nativeElement
        );
        toast.show();

        setTimeout(() => {
          this.toastMessages.splice(
            this.toastMessages.findIndex(
              (element) => element.id === toastMessage.id
            )
          );
        }, 5500);
      }, 100);
    }, 0);*/
  }

  removeToastMessage(toastId: string) {
    const toastMessageIndex = this.toastMessages.findIndex(
      (element) => element.id === toastId
    );

    /*const toast = new Toast(
      this.toastList.get(toastMessageIndex)?.nativeElement
    );
    toast.hide();*/

    setTimeout(() => {
      this.toastMessages.splice(toastMessageIndex);
    }, 500);
  }

  loading: boolean = false;

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
      case '/forms/coordinacionlogistica':
        this.title = 'Coordinacion logistica';
        this.description = 'Coordinacion logistica descripcion';
        break;
      case '/forms/financiera/registration':
        this.title = 'Registro colaborador o proveedor';
        this.description =
          'El registro es necesario para los procesos:\n- Envio de cuentas de cobro\n- Facturas\n- Anticipos\n- Pagos directos\n- Legalizaciones';
        break;
      case '/forms/financiera/invoice':
        this.title = 'Gestion de cuentas colaborador o proveedor';
        this.description =
          'Aqui podra realizar los siguientes procesos:\n- Envio de cuentas de cobro\n- Facturas\n- Anticipos\n- Pagos directos\n- Legalizaciones';
        break;
      case '/forms/juridica/contratacion/convenio/request':
        this.title = 'Subscripcion de convenio';
        this.description = 'Subscription request';
        break;
      case '/forms/juridica/contratacion/request':
        this.title = 'Formulario de contratacion';
        this.description = 'Formulario de contratacion descripcion.';
        break;
      case '/forms/juridica/contratacion/directa/' +
        this.route.snapshot.params.id:
        this.title =
          'Formato solicictud de adquisicion modalidad contratacion marco contratacion directa';
        this.description =
          '1. Compras o contrataciones directas se consideran aquellas cuyo valor estimado es igual o inferior a $40.000.000\n2. Las compras de menor importe, hasta $10.000.000$, se adquirirán directamente de los proveedores o prestadores de servicios, pedido contra factura\n3. Las compras superiores a $10.000.000$ e inferiores o iguales a $40.000.000 podrán hacerse por contratación directa con base en una sola oferta.\n4. Estas compras directas, por un importe igual o inferior a $40.000.000, no podrán tener una duración superior a un año ni ser objeto de prórroga.';
        break;
      case '/forms/juridica/contratacion/directa/excepcion/consultores/' +
        this.route.snapshot.params.id:
        this.title =
          'Formato solicictud de adquisicion modalidad contratacion marco contratacion directa por excepcion (Consultores)';
        this.description =
          '1. La selección directa de consultores no ofrece los beneficios de la competencia en lo que respecta a la calidad y el costo y carece de transparencia, lo que podría promover prácticas inaceptables. Por consiguiente, sólo se utilizará en casos excepcionales.\n2. La OEI podrá contar con esta modalidad de contratación que constituye una excepción al procedimiento general ya que se utiliza únicamente para contratos que no superen  la suma de DIECIOCHO MIL DOLARES (USD 18.000).\n3. La decisión de utilizar este modelo de contratación deberá, en todos los casos, estar justificada por motivos de mérito y capacidad, prescindiéndose tanto de la publicidad como de la invitación, en aquellas circunstancias en las que la ejecución del contrato requiera una especialización del contratista en razón de su experiencia y/o formación académica o profesional.\n4. La justificación de este tipo de contratación deberá en todo caso quedar registrada documentalmente en el expediente de contratación, cuyas características exijan la contratación de personas naturales o jurídicas de prestigio en un determinado ámbito, por su especialización y trayectoria académica o profesional evaluada por el órgano de contratación.';
        break;
      case '/forms/juridica/contratacion/directa/excepcion/sinlimite/' +
        this.route.snapshot.params.id:
        this.title =
          'Formato solicictud de adquisicion modalidad contratacion marco contratacion directa por excepcion (Sin limite)';
        this.description =
          'Entre los de utilización ordinaria. Por consiguiente, es de utilización limitada y restrictiva y sólo se utilizará en casos excepcionales.';
        break;
      case '/forms/juridica/contratacion/directa/comparativadeprecios/' +
        this.route.snapshot.params.id:
        this.title =
          'Formato solicictud de adquisicion modalidad contratacion marco contratacion por comparativa de precios';
        this.description =
          '1. Procedimiento abreviado utilizado sólo para compras de suministros comunes con especificaciones estándares, este procedimiento de contratación no podrá superar en ningún caso el importe de $ 80.000.000.\n2. Este procedimiento está basado en la comparación de precios ofertados por al menos tres (3) potenciales proveedores. La adjudicación de estos contratos será otorgada por el órgano de contratación a la oferta con el precio más bajo de entre todas las ofertas regulares y conformes.\n3. Por su propia naturaleza, adquisiciones al precio más bajo, en la comparativa de precios la OEI no dará a conocer a los proveedores el presupuesto oficial, es decir, el límite máximo de gasto que en virtud del contrato puede comprometer el órgano de contratación, incluido el impuesto sobre el valor añadido.\n4. La selección del adjudicatario siempre deberá estar basada en el precio más bajo, lo que significa que las especificaciones técnicas (requisitos mínimos) deben estar suficientemente detalladas como para que no sea posible valorar otros aspectos diferentes al precio. En la comparativa de precios no se nombrará un Comité de Evaluación.\n5. El expediente de contratación del procedimiento de comparativa de precios contendrá la solicitud u orden de compra con las especificaciones correspondientes y el documento de comparativa de precios del Anexo II.';
        break;
      case '/forms/juridica/contratacion/simplificadaysupersimplificada/' +
        this.route.snapshot.params.id:
        this.title =
          'Formato solicictud de adquisicion modalidad contratacion procedimientos supersimplificado y simplificado';
        this.description =
          'Procedimientos utilizados para compras de valor intermedio, consiste en la invitación a un mínimo de tres oferentes sujetos a unos requisitos (plazos, condiciones, especificaciones técnicas) en virtud de las cuales presentan sus propuestas y que posteriormente la OEI adjudicará en función de los criterios de adjudicación correspondientes a la naturaleza del objeto del contrato (servicios, suministros u obras).';
        break;
      case '/forms/juridica/contratacion/licitacion/' +
        this.route.snapshot.params.id:
        this.title =
          'Formato solicictud de adquisicion modalidad contratacion por licitacion';
        this.description =
          'Cuando se trate de contratos de cuantía superior a $400.000.000, la OEI publicará un anuncio en su página web en el "Área de Contratación" y en cualquier otro medio adicional que estime conveniente con el objetivo de aumentar su difusión. La publicación deberá incluir el "Pliego de condiciones"';
        break;
    }
  }

  isRoute(route: string) {
    return this.router.url === route;
  }

  startWithRoute(route: string) {
    return this.router.url.startsWith(route);
  }

  animationstart(event: AnimationEvent) {
    if (event.animationName === 'fadeIn') {
      this.loading = true;
    }
  }

  animationend(event: AnimationEvent) {
    if (event.animationName === 'fadeOut') {
      this.loading = false;
    }
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
