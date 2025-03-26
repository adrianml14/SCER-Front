import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComoJugarComponent } from './como-jugar.component';

describe('ComoJugarComponent', () => {
  let component: ComoJugarComponent;
  let fixture: ComponentFixture<ComoJugarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComoJugarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComoJugarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
