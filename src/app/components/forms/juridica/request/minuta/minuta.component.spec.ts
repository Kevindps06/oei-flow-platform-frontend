import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsJuridicaRequestMinutaComponent } from './minuta.component';

describe('FormsJuridicaRequestMinutaComponent', () => {
  let component: FormsJuridicaRequestMinutaComponent;
  let fixture: ComponentFixture<FormsJuridicaRequestMinutaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormsJuridicaRequestMinutaComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsJuridicaRequestMinutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
