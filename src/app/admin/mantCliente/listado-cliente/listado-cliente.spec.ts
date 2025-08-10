import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoClienteComponent } from './listado-cliente.component';

describe('ClienteAdmin', () => {
  let component: ListadoClienteComponent;
  let fixture: ComponentFixture<ListadoClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoClienteComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListadoClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
