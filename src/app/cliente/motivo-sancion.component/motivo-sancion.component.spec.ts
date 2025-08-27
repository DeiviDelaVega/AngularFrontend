import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivoSancionComponent } from './motivo-sancion.component';

describe('MotivoSancionComponent', () => {
  let component: MotivoSancionComponent;
  let fixture: ComponentFixture<MotivoSancionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotivoSancionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotivoSancionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
