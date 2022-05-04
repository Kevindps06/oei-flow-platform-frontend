import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectQuotationComponent } from './select-quotation.component';

describe('SelectQuotationComponent', () => {
  let component: SelectQuotationComponent;
  let fixture: ComponentFixture<SelectQuotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectQuotationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
