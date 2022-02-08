import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificacionesLaboralesComponent } from './certificacioneslaborales.component';

describe('CertificacioneslaboralesComponent', () => {
  let component: CertificacionesLaboralesComponent;
  let fixture: ComponentFixture<CertificacionesLaboralesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CertificacionesLaboralesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificacionesLaboralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
