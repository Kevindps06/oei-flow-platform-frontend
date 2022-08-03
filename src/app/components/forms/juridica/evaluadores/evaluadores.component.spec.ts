import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsJuridicaEvaluadoresComponent } from './evaluadores.component';

describe('FormsJuridicaEvaluadoresComponent', () => {
  let component: FormsJuridicaEvaluadoresComponent;
  let fixture: ComponentFixture<FormsJuridicaEvaluadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormsJuridicaEvaluadoresComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsJuridicaEvaluadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
