import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInmuebleComponent } from './list-inmueble.component';

describe('ListInmuebleComponent', () => {
  let component: ListInmuebleComponent;
  let fixture: ComponentFixture<ListInmuebleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListInmuebleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListInmuebleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
