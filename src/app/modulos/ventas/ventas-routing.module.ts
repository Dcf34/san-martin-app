import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VentasComponent } from './pages/ventas.component';

const routes: Routes = [
  { path: '', component: VentasComponent },
  { path: 'nueva-venta', loadChildren: () => import('./pages/nueva-venta/nueva-venta.module').then(m => m.NuevaVentaModule) },
  { path: 'historial', loadChildren: () => import('./pages/historial-ventas/historial-ventas.module').then(m => m.HistorialVentasModule) },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }