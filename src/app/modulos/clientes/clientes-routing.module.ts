import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientesComponent } from './pages/clientes.component';
import { ClientesFormModule } from './pages/clientes-form/clientes-form.module';
import { EdicionClientesComponent } from './pages/clientes-form/clientes-form.component';

const routes: Routes = [
  { path: '', component: ClientesComponent },
  { path: 'edicion/:id', component: EdicionClientesComponent },
  { path: 'alta', component: EdicionClientesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }