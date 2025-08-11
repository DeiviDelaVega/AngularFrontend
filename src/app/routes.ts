import { Routes } from '@angular/router';
import { authGuard } from './core/auth-guard';
import { roleGuard } from './core/role-guard';
import { ListadoClienteComponent } from './admin/mantCliente/listado-cliente/listado-cliente.component';
import { DetalleClienteComponent } from './admin/mantCliente/detalle-cliente/detalle-cliente.component';
import { EditarClienteComponent } from './admin/mantCliente/editar-cliente/editar-cliente.component';

export const routes: Routes = [
  
  //ClienteAdmin
  /* sin el admin{ path: 'clienteAdmin/detalle/:id', component: DetalleClienteComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ROLE_admin'] }},
   */
  { path: 'admin/clienteAdmin', component: ListadoClienteComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ROLE_admin'] }},
  { path: 'admin/clienteAdmin/detalle/:id', component: DetalleClienteComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ROLE_admin'] }},
  { path: 'admin/clienteAdmin/editar/:id', component: EditarClienteComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ROLE_admin'] }},
  
  //Autenticacion rutas de auth (login, registro, etc)
  { path: 'auth/login', loadComponent: () => import('./auth/login/login.component').then(c => c.LoginComponent) },
  { path: 'auth/registro-cliente', loadComponent: () => import('./auth/registro-cliente/registro-cliente.component').then(c => c.RegistroClienteComponent) },
  { path: 'auth/registro-admin', loadComponent: () => import('./auth/registro-admin/registro-admin.component').then(c => c.RegistroAdminComponent) },
  
  //Proteccion Cliente
  {
    path: 'cliente', loadComponent: () => import('./cliente/home/home.component').then(c => c.HomeClienteComponent),
    canActivate: [authGuard, roleGuard], data: { roles: ['ROLE_cliente'] }
  },
    //Proteccion Admin
  {
    path: 'admin', loadComponent: () => import('./admin/home/home').then(c => c.Home),
    canActivate: [authGuard, roleGuard], data: { roles: ['ROLE_admin'] }
  },
    //Admin inmuebles
  { 
    path: 'admin/inmuebles',        loadComponent: () => import('./admin/mantInmueble/list-inmueble/list-inmueble.component').then(c => c.ListInmuebleComponent),
    canActivate: [authGuard, roleGuard], 
    data: { roles: ['ROLE_admin'] }
  },
  /*
  { 
    path: 'admin/inmuebles/create', loadComponent: () => import('./admin/mantInmueble/create-inmueble/create-inmueble.component').then(c => c.CreateInmuebleComponent),
    canActivate: [authGuard, roleGuard], 
    data: { roles: ['ROLE_admin'] }
  },
  { 
    path: 'admin/inmuebles/edit/:id', loadComponent: () => import('./admin/mantInmueble/edit-inmueble/edit-inmueble.component').then(c => c.EditInmuebleComponent),
    canActivate: [authGuard, roleGuard], 
    data: { roles: ['ROLE_admin'] }
  },
  { 
    path: 'admin/inmuebles/detail/:id', loadComponent: () => import('./admin/mantInmueble/detail-inmueble/detail-inmueble.component').then(c => c.DetailInmuebleComponent),
    canActivate: [authGuard, roleGuard], 
    data: { roles: ['ROLE_admin'] }
  },*/

  // ruta raíz redirige a login
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
];