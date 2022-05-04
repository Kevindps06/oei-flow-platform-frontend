import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FillQuotationsComponent } from './fill-quotations.component';

describe('FillQuotationsComponent', () => {
  let component: FillQuotationsComponent;
  let fixture: ComponentFixture<FillQuotationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FillQuotationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FillQuotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
