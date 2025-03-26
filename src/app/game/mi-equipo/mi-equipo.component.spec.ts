import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiEquipoComponent } from './mi-equipo.component';

describe('MiEquipoComponent', () => {
  let component: MiEquipoComponent;
  let fixture: ComponentFixture<MiEquipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiEquipoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiEquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
