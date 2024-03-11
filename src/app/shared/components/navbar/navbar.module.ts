import { SidebarModule } from 'primeng/sidebar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { ProgressBarModule } from 'primeng/progressbar';

@NgModule({
  declarations: [NavbarComponent],
  exports: [NavbarComponent],
  imports: [CommonModule,
    SidebarModule,
    DividerModule,
    ButtonModule,
    ToastModule,
    MessagesModule,
    BreadcrumbModule,
    ProgressBarModule,
    SidebarModule
  ]
})
export class NavbarModule { }