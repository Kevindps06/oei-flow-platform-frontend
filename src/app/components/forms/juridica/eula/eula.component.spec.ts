import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsJuridicaRequestEulaComponent } from './eula.component';

describe('FormsJuridicaRequestEulaComponent', () => {
  let component: FormsJuridicaRequestEulaComponent;
  let fixture: ComponentFixture<FormsJuridicaRequestEulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormsJuridicaRequestEulaComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsJuridicaRequestEulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
