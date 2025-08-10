import { Routes } from '@angular/router';
import { authGuard } from './core/auth-guard';
import { roleGuard } from './core/role-guard';

export const routes: Routes = [
  // rutas de auth (login, registro, etc)
  { path: 'auth/login',            loadComponent: () => import('./auth/login/login.component').then(c => c.LoginComponent) },
  { path: 'auth/registro-cliente', loadComponent: () => import('./auth/registro-cliente/registro-cliente.component').then(c => c.RegistroClienteComponent) },
  { path: 'auth/registro-admin',   loadComponent: () => import('./auth/registro-admin/registro-admin.component').then(c => c.RegistroAdminComponent) },

  // ruta cliente protegida
  { 
    path: 'cliente',               loadComponent: () => import('./cliente/home/home.component').then(c => c.HomeClienteComponent),
    canActivate: [authGuard, roleGuard], 
    data: { roles: ['ROLE_cliente'] } 
  },
  
  // rutas admin protegidas, planas, no hijas
  { 
    path: 'admin',                  loadComponent: () => import('./admin/home/home').then(c => c.Home),
    canActivate: [authGuard, roleGuard], 
    data: { roles: ['ROLE_admin'] }
  },
  { 
    path: 'admin/inmuebles',        loadComponent: () => import('./admin/mantInmueble/list-inmueble/list-inmueble.component').then(c => c.ListInmuebleComponent),
    canActivate: [authGuard, roleGuard], 
    data: { roles: ['ROLE_admin'] }
  },/*
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

  // cualquier otra ruta va a login
  { path: '**', redirectTo: 'auth/login' }
];