import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OferentesComponent } from './oferentes.component';

describe('OferentesComponent', () => {
  let component: OferentesComponent;
  let fixture: ComponentFixture<OferentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OferentesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OferentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
