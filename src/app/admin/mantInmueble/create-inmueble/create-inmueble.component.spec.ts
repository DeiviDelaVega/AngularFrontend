import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInmuebleComponent } from './create-inmueble.component';

describe('CreateInmuebleComponent', () => {
  let component: CreateInmuebleComponent;
  let fixture: ComponentFixture<CreateInmuebleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateInmuebleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateInmuebleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
