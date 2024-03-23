import { NgModule } from '@angular/core';

import { InicioComponent } from './inicio.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'usuarios', loadChildren: () => import('../usuarios/usuarios.module').then(m => m.UsuariosModule) },
  { path: 'clientes', loadChildren: () => import('../clientes/clientes.module').then(m => m.ClientesModule) },
  { path: 'comidas', loadChildren: () => import('../comidas/comidas.module').then(m => m.ComidasModule) },
  { path: 'configuracion', loadChildren: () => import('../configuracion/configuracion.module').then(m => m.ConfiguracionModule) },
  { path: 'ventas', loadChildren: () => import('../ventas/ventas.module').then(m => m.VentasModule) },
  { path: 'pedidos', loadChildren: () => import('../pedidos/pedidos.module').then(m => m.PedidosModule) },
  { path: 'reportes', loadChildren: () => import('../reportes/reportes.module').then(m => m.ReportesModule) }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InicioRoutingModule { }