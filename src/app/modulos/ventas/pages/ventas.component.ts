import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subject, interval, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { rutasAplicativo } from '../../../core/config/routes.config';
import { DatePipe, formatDate } from '@angular/common';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { NavbarService } from '../../../shared/services/navbar.items.service';
import { SesionJWT } from '../../login/models/jwt.model';
import { AuthService } from '../../login/services/auth.service';

@UntilDestroy()
@Component({
    selector: 'app-ventas',
    templateUrl: './ventas.component.html',
    styleUrls: ['./ventas.component.scss']
})

export class VentasComponent implements OnInit{
    rutaActual = rutasAplicativo.ventas.inicio;
    cargando: boolean = false;
    modal: DynamicDialogRef | undefined;
    itemsBreadCrumb: MenuItem[] | undefined;
    home: MenuItem | undefined;
    itemsMenu: MenuItem[] | undefined;
    redirectUrl = '';
    sesion:SesionJWT = {};
    unsubscribe$: Subject<boolean> = new Subject<boolean>();
    
    datosMenu = {
        itemsBreadCrumb: [
          {
            icon: 'fas fa-cash-register', 
            label: 'Ventas', 
            routerLink: '/portal/ventas'
          }
        ],
        home: { label: 'Inicio', icon: 'pi pi-home', routerLink: '/' }
    };
    
    constructor(
        private authService:AuthService,
        private router:Router,
        private dialogService: DialogService,
        private mensajesService : MensajesService,
        private NavbarService: NavbarService
    ) {};

    async ngOnInit(): Promise<void> {
        interval(1000).pipe(untilDestroyed(this)).subscribe();
        
        //Verifica si hay una sesion activa, si no existe redirige al login
        interval(1000)
        .pipe(
            untilDestroyed(this),
            takeUntil(this.unsubscribe$)
        )
        .subscribe(() => {
            if (!this.authService.autenticado()) {
                this.navegarLogin();
            }
            
        });

        this.enviarDatos();

        this.imprimirMensaje();
    }

    async imprimirMensaje(){

        setTimeout(() => {
          const mensaje = sessionStorage.getItem('mensajePostNavegacion');
          if (mensaje) {
              this.mensajesService.exitoso('Exitoso', mensaje);
          }
    
          sessionStorage.removeItem('mensajePostNavegacion');
        }, 0);
    
      }

    enviarDatos() {
        if(this.datosMenu) {
            this.NavbarService.actualizarDatos(this.datosMenu);
        }else {
            console.log('datosMenu es undefined o no contiene los datos esperados.');
        }
    }

    // Función para formatear la fecha
    formatDate(date: Date): string {
        return formatDate(date, 'dd/MM/yyyy', 'en-US');
    }

    toMayus(name: string) : string {
        return name.toUpperCase();
    }

    navegarLogin() {
        const navigateUrl = this.redirectUrl ? this.redirectUrl : rutasAplicativo.login;
        this.router.navigateByUrl(navigateUrl);
    }

    navegarPortal() {
        const navigateUrl = rutasAplicativo.inicio;
        this.router.navigateByUrl(navigateUrl);
    }

    abrirModulo(modulo:string)
    {
        let ruta = '';
        
        if(modulo == 'nueva-venta') {
          ruta = rutasAplicativo.ventas.nueva_venta;
        }
        else if(modulo == 'historial') {
          ruta = rutasAplicativo.ventas.historial_ventas.inicio;
        }
        else{
            ruta = rutasAplicativo.inicio;
        }
    
        if(ruta != this.rutaActual) {
          this.router.navigateByUrl(ruta);
        }
    }

    cerrarSesion(){
        this.authService.limpiarSesion();
    }



   
    
    
}

    
