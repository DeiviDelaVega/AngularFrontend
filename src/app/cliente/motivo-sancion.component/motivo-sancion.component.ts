import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'motivo-sancion',
  standalone: true, 
  imports: [ CommonModule,  RouterModule ],
  templateUrl: './motivo-sancion.component.html',
  styleUrls: ['./motivo-sancion.component.scss']
})
export class MotivoSancionComponent {}
