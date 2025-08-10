import { Routes } from '@angular/router';
import { authGuard } from './core/auth-guard';
import { roleGuard } from './core/role-guard';
import { ListadoClienteComponent } from './admin/mantCliente/listado-cliente/listado-cliente.component';
import { DetalleClienteComponent } from './admin/mantCliente/detalle-cliente/detalle-cliente.component';
import { EditarClienteComponent } from './admin/mantCliente/editar-cliente/editar-cliente.component';

export const routes: Routes = [
  { path: 'clienteAdmin', component: ListadoClienteComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ROLE_admin'] }},
  { path: 'clienteAdmin/detalle/:id', component: DetalleClienteComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ROLE_admin'] }},
  { path: 'clienteAdmin/editar/:id', component: EditarClienteComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ROLE_admin'] }},
  { path: 'auth/login', loadComponent: () => import('./auth/login/login.component').then(c => c.LoginComponent) },
  { path: 'auth/registro-cliente', loadComponent: () => import('./auth/registro-cliente/registro-cliente.component').then(c => c.RegistroClienteComponent) },
  { path: 'auth/registro-admin', loadComponent: () => import('./auth/registro-admin/registro-admin.component').then(c => c.RegistroAdminComponent) },
  {
    path: 'cliente', loadComponent: () => import('./cliente/home/home.component').then(c => c.HomeClienteComponent),
    canActivate: [authGuard, roleGuard], data: { roles: ['ROLE_cliente'] }
  },
  {
    path: 'admin', loadComponent: () => import('./admin/home/home').then(c => c.Home),
    canActivate: [authGuard, roleGuard], data: { roles: ['ROLE_admin'] }
  },
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
  { path: '**', redirectTo: 'auth/login' }
];
