import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquiposFantasyComponent } from './equipos-fantasy.component';

describe('EquiposFantasyComponent', () => {
  let component: EquiposFantasyComponent;
  let fixture: ComponentFixture<EquiposFantasyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquiposFantasyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquiposFantasyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
