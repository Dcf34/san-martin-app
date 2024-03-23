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
import { PedidosRoutingModule } from './pedidos-routing.module';
import { PedidosComponent } from './pages/pedidos.component';


@NgModule({
  declarations: [
    PedidosComponent
  ],
  imports: [
    PedidosRoutingModule,
    CommonModule,
    ProgressBarModule,
    CheckboxModule,
    ToastModule,
    ButtonModule, 
    FormsModule,
    NavbarModule,
    TableModule,
    MessagesModule
  ],
  providers: [DialogService,
    MessageService, MensajesService, DatePipe]
})
export class PedidosModule { }