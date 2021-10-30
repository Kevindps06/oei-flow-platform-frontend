import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormsService } from 'src/app/services/forms.service';
import { FormsJuridicaContratacion } from 'src/app/interfaces/forms-juridica-contratacion';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forms-juridica-contratacion',
  templateUrl: './contratacion.component.html',
  styleUrls: ['./contratacion.component.css'],
})
export class ContratacionComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<FormsJuridicaContratacion>();

  constructor(
    private formsService: FormsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    switch (this.router.url) {
      case 'forms/juridica/contratacion/directa/' +
        this.route.snapshot.params.id:
        this.tipo = 'Contratacion directa';
        break;
      case 'forms/juridica/contratacion/directa/excepcion/consultores/' +
        this.route.snapshot.params.id:
        break;
      case 'forms/juridica/contratacion/directa/excepcion/sinlimite/' +
        this.route.snapshot.params.id:
        break;
      case 'forms/juridica/contratacion/directa/comparativadeprecios/' +
        this.route.snapshot.params.id:
        break;
      case 'forms/juridica/contratacion/simplificadaysupersimplificada/' +
        this.route.snapshot.params.id:
        break;
      case 'forms/juridica/contratacion/licitacion/' +
        this.route.snapshot.params.id:
        break;
    }
  }

  tipo!: string;

  numSolicitud!: string;
  fecha!: string;
  tipoAdquisicion!: string;
  otraAdquisicion!: string;
  cargoA!: string;
  nombreConvenio!: string;
  nombreUnidad!: string;
  VBresponAreaFinan!: string;
  nombreResponAreaFinan!: string;
  nombreSolicitante!: string;
  VBareaJuridica!: string;

  cargoAChange() {
    switch (this.cargoA) {
      case 'Convenio':
        this.nombreUnidad = ''
        break;
      case 'Funcionamiento':
        this.nombreConvenio = '';
        this.nombreUnidad = '';
        break;
      case 'Unidad':
        this.nombreConvenio = '';
        break;
    }
  }

  whenSubmit() {
    const newFormJuridicaContratacion: FormsJuridicaContratacion = {
      id: this.route.snapshot.params.id,
      tipo: this.tipo,
      numSolicitud: this.numSolicitud,
      fecha: this.fecha,
      tipoAdquisicion: this.tipoAdquisicion,
      otraAdquisicion: this.otraAdquisicion,
      cargoA: this.cargoA,
      nombreConvenio: this.nombreConvenio ? this.nombreConvenio : undefined,
      nombreUnidad: this.nombreUnidad ? this.nombreUnidad : undefined,
      responAreaFinan: this.VBresponAreaFinan,
      nombreResponAreaFinan: this.nombreResponAreaFinan,
      nombreSolicitante: this.nombreSolicitante,
      VBAreaJuridica: this.VBareaJuridica,
    };

    this.onSubmit.emit(newFormJuridicaContratacion);
  }
}
