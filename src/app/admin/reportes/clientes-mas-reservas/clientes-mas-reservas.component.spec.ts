import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ClientesMasReservasComponent } from './clientes-mas-reservas.component';

describe('ClientesMasReservasComponent', () => {
  let component: ClientesMasReservasComponent;
  let fixture: ComponentFixture<ClientesMasReservasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ClientesMasReservasComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientesMasReservasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
