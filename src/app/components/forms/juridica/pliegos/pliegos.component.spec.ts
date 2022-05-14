import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PliegosComponent } from './pliegos.component';

describe('PliegosComponent', () => {
  let component: PliegosComponent;
  let fixture: ComponentFixture<PliegosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PliegosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PliegosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
