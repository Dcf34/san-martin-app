import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modulos/login/login.component';
import { AuthGuard } from './core/guards/auth.guards';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { 
    path: 'inicio', 
    canActivate: [AuthGuard], 
    runGuardsAndResolvers: 'always',
    canActivateChild: [AuthGuard], 
    loadChildren: () => import('./modulos/inicio/inicio.module').then(m => m.InicioModule) 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      onSameUrlNavigation: 'reload',
      useHash: true

    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }