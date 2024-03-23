import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { NavbarModule } from 'src/app/shared/components/navbar/navbar.module';
import { MessagesModule } from 'primeng/messages';
import { VentasRoutingModule } from './ventas-routing.module';
import { VentasComponent } from './pages/ventas.component';
import { ToastModule } from 'primeng/toast';
import { NuevaVentaModule } from './pages/nueva-venta/nueva-venta.module';

@NgModule({
  declarations: [
    VentasComponent
  ],
  imports: [
    CommonModule,
    VentasRoutingModule,
    NavbarModule,
    MessagesModule,
    ToastModule
  ],
  providers: [DialogService,
    MessageService, MensajesService, DatePipe]
})
export class VentasModule { }