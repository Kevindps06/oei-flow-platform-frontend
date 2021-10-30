import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsJuridicaContratacionRequestComponent } from './request.component';

describe('RequestComponent', () => {
  let component: FormsJuridicaContratacionRequestComponent;
  let fixture: ComponentFixture<FormsJuridicaContratacionRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormsJuridicaContratacionRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsJuridicaContratacionRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
