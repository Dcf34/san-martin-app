import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComidasComponent } from './pages/comidas.component';
import { EdicionComidasComponent } from './pages/comidas-form/comidas-form.component';

const routes: Routes = [
  { path: '', component: ComidasComponent },
  { path: 'edicion/:id', component: EdicionComidasComponent },
  { path: 'alta', component: EdicionComidasComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComidasRoutingModule { }