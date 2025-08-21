import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InmuebleMasReservasComponent } from './inmueble-mas-reservas.component';

describe('InmuebleMasReservasComponent', () => {
  let component: InmuebleMasReservasComponent;
  let fixture: ComponentFixture<InmuebleMasReservasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [InmuebleMasReservasComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InmuebleMasReservasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
