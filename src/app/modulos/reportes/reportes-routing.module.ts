import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportesComponent } from './pages/reportes.component';
import { ReporteVentasComponent } from './pages/reporte-ventas/rep-ventas.component';

const routes: Routes = [
  { path: '', component: ReportesComponent },
  { path: 'ventas', component: ReporteVentasComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }