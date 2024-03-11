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
import { ComidasRoutingModule } from './comidas-routing.module';
import { ComidasComponent } from './pages/comidas.component';
import { ComidasFormModule } from './pages/comidas-form/comidas-form.module';

@NgModule({
  declarations: [
    ComidasComponent
  ],
  imports: [
    ComidasRoutingModule,
    CommonModule,
    ProgressBarModule,
    CheckboxModule,
    ToastModule,
    ButtonModule, 
    FormsModule,
    NavbarModule,
    TableModule,
    MessagesModule,
    ComidasFormModule
  ],
  providers: [DialogService,
    MessageService, MensajesService, DatePipe]
})
export class ComidasModule { }