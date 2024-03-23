import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistorialVentasComponent } from './historial-ventas.component';
import { DetalleVentaComponent } from './detalle-venta/detalle-venta.component';

const routes: Routes = [
  { path: '', component: HistorialVentasComponent },
  { path: 'detalle/:id', component: DetalleVentaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistorialVentasRoutingModule { }