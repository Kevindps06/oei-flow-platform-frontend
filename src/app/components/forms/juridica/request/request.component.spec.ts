import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsJuridicaRequestComponent } from './request.component';

describe('RequestComponent', () => {
  let component: FormsJuridicaRequestComponent;
  let fixture: ComponentFixture<FormsJuridicaRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormsJuridicaRequestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsJuridicaRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
