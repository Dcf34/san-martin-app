import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { NavbarModule } from 'src/app/shared/components/navbar/navbar.module';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressBarModule } from 'primeng/progressbar';
import { HistorialVentasComponent } from './historial-ventas.component';
import { HistorialVentasRoutingModule } from './historial-ventas-routing.component';
import { DetalleVentaModule } from './detalle-venta/detalle-venta.module';

@NgModule({
  declarations: [
    HistorialVentasComponent
  ],
  imports: [
    HistorialVentasRoutingModule,
    CommonModule,
    NavbarModule,
    MessagesModule,
    ToastModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    CheckboxModule,
    ProgressBarModule,
    DetalleVentaModule
  ],
  providers: [DialogService,
    MessageService, MensajesService, DatePipe]
})
export class HistorialVentasModule { }