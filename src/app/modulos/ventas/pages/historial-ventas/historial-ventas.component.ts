import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subject, interval, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { rutasAplicativo } from 'src/app/core/config';
import { SesionJWT } from 'src/app/shared/models/jwt.model';
import { AuthService } from 'src/app/modulos/login/services/auth.service';
import { NavbarService } from 'src/app/shared/services/navbar.items.service';
import { Cliente, FiltroCliente } from 'src/app/modulos/clientes/models/clientes.models';
import { Comida, FiltroComida } from 'src/app/modulos/comidas/models/comidas.models';
import { ClientesService } from 'src/app/modulos/clientes/services/clientes.service';
import { ComidasService } from 'src/app/modulos/comidas/services/comidas.service';
import { DetalleVentaDTO, FiltroVentas, VentaDAO, VentaDTO } from '../../models/ventas.models';
import Decimal from 'decimal.js';
import { idUserModificacionToObject } from 'src/app/shared/models/functions/user-modification.function';
import { VentasService } from '../../services/ventas.service';

@UntilDestroy()
@Component({
    selector: 'app-historial-ventas',
    templateUrl: './historial-ventas.component.html',
    styleUrls: ['./historial-ventas.component.scss']
})

export class HistorialVentasComponent implements OnInit{
    rutaActual = rutasAplicativo.ventas.nueva_venta;
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
            routerLink: '/inicio/ventas'
          },
          {
            icon: 'fas fa-history', 
            label: 'Historial', 
            routerLink: '/inicio/ventas/historial'
          }
        ],
        home: { label: 'Inicio', icon: 'pi pi-home', routerLink: '/' }
    };

    ventas: VentaDAO[] = [];

    constructor(
        private authService:AuthService,
        private router:Router,
        private dialogService: DialogService,
        private mensajesService : MensajesService,
        private NavbarService: NavbarService,
        private ventasService: VentasService
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

        this.getVentas(this.filtroVentas);

        this.enviarDatos();
    }

    enviarDatos() {
        if(this.datosMenu) {
            this.NavbarService.actualizarDatos(this.datosMenu);
        }else {
            console.log('datosMenu es undefined o no contiene los datos esperados.');
        }
    }

    filtroVentas: FiltroVentas = { activo: true };

    getVentas(filtro: FiltroVentas) {
        this.cargando = true;
    
        this.ventasService
          .getVentas(filtro)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: (data) => {
                if(data.length > 0){
                    this.ventas = data;
                    this.cargando = false;
                }
            },
            error: () => this.cargando = false
        });
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

    navegarVentas(){
        const navigateUrl = rutasAplicativo.ventas.inicio;
        this.router.navigateByUrl(navigateUrl);
    }

    cerrarSesion(){
        this.authService.limpiarSesion();
    }

    redirigirDetalleId(id_venta?: number){
        
        let url = '';
    
        if (id_venta) {
            url = rutasAplicativo.ventas.historial_ventas.detalle + `/${id_venta}`;
        }
        
        this.router.navigateByUrl(url);
      }
    
}

    

