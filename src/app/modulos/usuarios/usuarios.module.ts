import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { DatePipe } from '@angular/common';
import { NavbarModule } from '../../shared/components/navbar/navbar.module';
import { UsuariosComponent } from './pages/usuarios.component';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { TableModule } from 'primeng/table';
import { EdicionUsuariosComponent } from './pages/usuarios-form/usuarios-form.component';
import { UsuariosFormModule } from './pages/usuarios-form/usuarios-form.module';
import { MessagesModule } from 'primeng/messages';
import { EdicionUsuariosPermisosComponent } from './pages/usuarios-permisos/usuarios-permisos.component';
import { UsuariosPermisosFormModule } from './pages/usuarios-permisos/usuarios-permisos.module';

@NgModule({
  declarations: [
    UsuariosComponent
  ],
  imports: [
    UsuariosRoutingModule,
    CommonModule,
    ProgressBarModule,
    CheckboxModule,
    ToastModule,
    ButtonModule, 
    FormsModule,
    NavbarModule,
    TableModule,
    UsuariosFormModule,
    MessagesModule,
    UsuariosPermisosFormModule
  ],
  providers: [DialogService,
    MessageService, MensajesService, DatePipe]
})
export class UsuariosModule { }