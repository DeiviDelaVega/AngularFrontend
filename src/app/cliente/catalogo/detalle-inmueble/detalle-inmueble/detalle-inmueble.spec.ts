import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleInmuebleComponent } from './detalle-inmueble';

describe('DetalleInmueble', () => {
  let component: DetalleInmuebleComponent;
  let fixture: ComponentFixture<DetalleInmuebleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleInmuebleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleInmuebleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
