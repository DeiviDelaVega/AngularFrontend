import { Routes } from '@angular/router';
import { authGuard } from './core/auth-guard';
import { roleGuard } from './core/role-guard';
import { ListadoClienteComponent } from './admin/mantCliente/listado-cliente/listado-cliente.component';
import { DetalleClienteComponent } from './admin/mantCliente/detalle-cliente/detalle-cliente.component';
import { EditarClienteComponent } from './admin/mantCliente/editar-cliente/editar-cliente.component';
import { CatalogoComponent } from './cliente/catalogo/catalogo.component';
import { MotivoSancionComponent } from './cliente/motivo-sancion.component/motivo-sancion.component';
import { guestGuard } from './core/guest-guard';

export const routes: Routes = [
  //Autenticacion rutas de auth (login, registro, etc)
  { path: 'auth/login', canActivate: [guestGuard], loadComponent: () => import('./auth/login/login.component').then(c => c.LoginComponent) },
  { path: 'auth/registro-cliente', canActivate: [guestGuard], loadComponent: () => import('./auth/registro-cliente/registro-cliente.component').then(c => c.RegistroClienteComponent) },
  { path: 'auth/registro-admin', canActivate: [guestGuard], loadComponent: () => import('./auth/registro-admin/registro-admin.component').then(c => c.RegistroAdminComponent) },
  { path: 'auth/pagina-inicio', loadComponent: () => import('./auth/pagina-inicio/pagina-inicio.component').then(c => c.PaginaInicioComponent) },

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

  //Admin reservas
  {
    path: 'admin/reservas', loadComponent: () => import('./admin/mantReservas/list-reserva/list-reserva.component').then(c => c.ListReservaComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_admin'] }
  },

  // Mantenimiento Cliente
  {
    path: 'admin/clienteAdmin', loadComponent: () => import('./admin/mantCliente/listado-cliente/listado-cliente.component').then(c => c.ListadoClienteComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_admin'] }
  },
  {
    path: 'admin/clienteAdmin/detalle/:id', loadComponent: () => import('./admin/mantCliente/detalle-cliente/detalle-cliente.component').then(c => c.DetalleClienteComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_admin'] }
  },
  {
    path: 'admin/clienteAdmin/editar/:id', loadComponent: () => import('./admin/mantCliente/editar-cliente/editar-cliente.component').then(c => c.EditarClienteComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_admin'] }
  },

  //Admin inmuebles
  {
    path: 'admin/inmuebles', loadComponent: () => import('./admin/mantInmueble/list-inmueble/list-inmueble.component').then(c => c.ListInmuebleComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_admin'] }
  },
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
  },

  // Catalogo verInmuebles
  {
    path: 'cliente/catalogo/verInmueble', loadComponent: () => import('./cliente/catalogo/catalogo.component').then(c => c.CatalogoComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_cliente'] }
  },
  {
    path: 'cliente/catalogo/motivo-sancion',
    component: MotivoSancionComponent
  },

  //reservar

  // routes.ts (agrega estas rutas abajo de tu bloque cliente)
{
  path: 'cliente/catalogo/detalle/:id',
  loadComponent: () => import('./cliente/catalogo/detalle-inmueble/detalle-inmueble/detalle-inmueble')
    .then(c => c.DetalleInmuebleComponent),
  canActivate: [authGuard, roleGuard],
  data: { roles: ['ROLE_cliente'] }
},
{
  path: 'cliente/terminos',
  loadComponent: () => import('./cliente/terminos/terminos/terminos')
    .then(c => c.TerminosComponent)
},
{
  path: 'cliente/pago-exitoso',
  loadComponent: () => import('./cliente/pago-exitoso/pago-exitoso/pago-exitoso')
    .then(c => c.PagoExitosoComponent),
  canActivate: [authGuard, roleGuard],
  data: { roles: ['ROLE_cliente'] }
},
{
  path: 'cliente/pago-error',
  loadComponent: () => import('./cliente/pago-error/pago-error/pago-error')
    .then(c => c.PagoErrorComponent),
  canActivate: [authGuard, roleGuard],
  data: { roles: ['ROLE_cliente'] }
},

  // ruta raíz redirige a login
  { path: '', pathMatch: 'full', redirectTo: 'auth/pagina-inicio' },
];