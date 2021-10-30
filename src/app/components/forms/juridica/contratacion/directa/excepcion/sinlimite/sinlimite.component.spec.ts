import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinlimiteComponent } from './sinlimite.component';

describe('SinlimiteComponent', () => {
  let component: SinlimiteComponent;
  let fixture: ComponentFixture<SinlimiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SinlimiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SinlimiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
