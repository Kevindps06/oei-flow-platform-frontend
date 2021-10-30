import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicitacionComponent } from './licitacion.component';

describe('LicitacionComponent', () => {
  let component: LicitacionComponent;
  let fixture: ComponentFixture<LicitacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LicitacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LicitacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
