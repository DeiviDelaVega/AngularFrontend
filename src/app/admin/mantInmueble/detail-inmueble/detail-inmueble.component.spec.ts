import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailInmuebleComponent } from './detail-inmueble.component';

describe('DetailInmuebleComponent', () => {
  let component: DetailInmuebleComponent;
  let fixture: ComponentFixture<DetailInmuebleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailInmuebleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailInmuebleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
