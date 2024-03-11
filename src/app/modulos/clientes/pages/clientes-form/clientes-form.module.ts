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
import { TableModule } from 'primeng/table';
import { NavbarModule } from 'src/app/shared/components/navbar/navbar.module';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { EdicionClientesComponent } from './clientes-form.component';
import { InputTextareaModule } from 'primeng/inputtextarea';

@NgModule({
  declarations: [
    EdicionClientesComponent,
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
    InputTextModule,
    MessagesModule, 
    ProgressBarModule,
    InputTextareaModule
  ],
  providers: [DialogService,
    MessageService, MensajesService, DatePipe]
})
export class ClientesFormModule { }