import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInmuebleComponent } from './edit-inmueble.component';

describe('EditInmuebleComponent', () => {
  let component: EditInmuebleComponent;
  let fixture: ComponentFixture<EditInmuebleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditInmuebleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditInmuebleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
