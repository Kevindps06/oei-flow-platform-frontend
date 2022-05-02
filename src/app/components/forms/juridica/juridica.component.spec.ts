import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsJuridicaComponent } from './juridica.component';

describe('RequestComponent', () => {
  let component: FormsJuridicaComponent;
  let fixture: ComponentFixture<FormsJuridicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormsJuridicaComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsJuridicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
