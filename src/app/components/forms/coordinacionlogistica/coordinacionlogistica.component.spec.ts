import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinacionlogisticaComponent } from './coordinacionlogistica.component';

describe('CoordinacionlogisticaComponent', () => {
  let component: CoordinacionlogisticaComponent;
  let fixture: ComponentFixture<CoordinacionlogisticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoordinacionlogisticaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoordinacionlogisticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
