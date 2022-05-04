import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdquisicionComponent } from './compras.component';

describe('AdquisicionComponent', () => {
  let component: AdquisicionComponent;
  let fixture: ComponentFixture<AdquisicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdquisicionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdquisicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
