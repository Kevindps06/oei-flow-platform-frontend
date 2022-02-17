import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsCertificadosIngresosRetencionesComponent } from './certificadosingresosretenciones.component';

describe('CertificacioneslaboralesComponent', () => {
  let component: FormsCertificadosIngresosRetencionesComponent;
  let fixture: ComponentFixture<FormsCertificadosIngresosRetencionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormsCertificadosIngresosRetencionesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      FormsCertificadosIngresosRetencionesComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
