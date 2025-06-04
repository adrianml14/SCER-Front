import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionBugsComponent } from './gestion-bugs.component';

describe('GestionBugsComponent', () => {
  let component: GestionBugsComponent;
  let fixture: ComponentFixture<GestionBugsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionBugsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionBugsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
