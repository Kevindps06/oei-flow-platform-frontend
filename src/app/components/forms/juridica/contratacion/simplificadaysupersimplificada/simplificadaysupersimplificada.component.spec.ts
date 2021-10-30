import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimplificadaysupersimplificadaComponent } from './simplificadaysupersimplificada.component';

describe('SimplificadaysupersimplificadaComponent', () => {
  let component: SimplificadaysupersimplificadaComponent;
  let fixture: ComponentFixture<SimplificadaysupersimplificadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimplificadaysupersimplificadaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimplificadaysupersimplificadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
