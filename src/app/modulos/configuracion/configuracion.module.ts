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
import { TableModule } from 'primeng/table';
import { MessagesModule } from 'primeng/messages';
import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { ConfiguracionComponent } from './pages/configuracion.component';

@NgModule({
  declarations: [
    ConfiguracionComponent
  ],
  imports: [
    CommonModule,
    ProgressBarModule,
    CheckboxModule,
    ToastModule,
    ButtonModule, 
    FormsModule,
    NavbarModule,
    TableModule,
    MessagesModule,
    ConfiguracionRoutingModule
  ],
  providers: [DialogService,
    MessageService, MensajesService, DatePipe]
})
export class ConfiguracionModule { }