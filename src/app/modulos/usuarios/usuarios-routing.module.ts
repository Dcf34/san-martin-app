import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { UsuariosComponent } from './pages/usuarios.component';
import { EdicionUsuariosComponent } from './pages/usuarios-form/usuarios-form.component';
import { EdicionUsuariosPermisosComponent } from './pages/usuarios-permisos/usuarios-permisos.component';

const routes: Routes = [
  { path: '', component: UsuariosComponent },
  { path: 'edicion/:id', component: EdicionUsuariosComponent },
  { path: 'alta', component: EdicionUsuariosComponent },
  { path: 'permisos/:id', component: EdicionUsuariosPermisosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }