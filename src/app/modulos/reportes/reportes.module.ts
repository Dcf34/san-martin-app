import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { NavbarModule } from 'src/app/shared/components/navbar/navbar.module';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { ReportesRoutingModule } from './reportes-routing.module';
import { ReportesComponent } from './pages/reportes.component';
import { ReporteVentasComponent } from './pages/reporte-ventas/rep-ventas.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [
    ReportesComponent,
    ReporteVentasComponent
  ],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    NavbarModule,
    MessagesModule,
    ToastModule,
    DropdownModule,
    ProgressBarModule,
    FormsModule,
    InputTextModule,
    CalendarModule
  ],
  providers: [DialogService,
    MessageService, MensajesService, DatePipe]
})
export class ReportesModule { }