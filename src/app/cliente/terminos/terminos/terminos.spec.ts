import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminosComponent  } from './terminos';

describe('Terminos', () => {
  let component: TerminosComponent ;
  let fixture: ComponentFixture<TerminosComponent >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminosComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
