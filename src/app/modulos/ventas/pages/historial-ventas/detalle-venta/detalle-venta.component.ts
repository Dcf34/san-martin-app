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
import Decimal from 'decimal.js';
import { idUserModificacionToObject } from 'src/app/shared/models/functions/user-modification.function';
import { DetalleVentaDAO, FiltroDetalleVenta, FiltroVentas, VentaDAO } from '../../../models/ventas.models';
import { VentasService } from '../../../services/ventas.service';

@UntilDestroy()
@Component({
    selector: 'app-detalle-venta',
    templateUrl: './detalle-venta.component.html',
    styleUrls: ['./detalle-venta.component.scss']
})

export class DetalleVentaComponent implements OnInit{
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
          },
          {
            icon: 'fas fa-edit', 
            label: 'Detalle', 
            routerLink: '/inicio/ventas/historial/edicion'
          }
        ],
        home: { label: 'Inicio', icon: 'pi pi-home', routerLink: '/' }
    };

    venta: VentaDAO = {};

    detallesVenta: DetalleVentaDAO[] = [];

    cliente: Cliente = {};

    constructor(
        private authService:AuthService,
        private router:Router,
        private dialogService: DialogService,
        private mensajesService : MensajesService,
        private NavbarService: NavbarService,
        private ventasService: VentasService,
        private clientesService: ClientesService,
        private route: ActivatedRoute
    ) {};

    filtroClientes: FiltroCliente = {activo: true};

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

        let id = this.route.snapshot.paramMap.get('id');

        if(id){
            const idVenta = parseInt(id);
            this.filtroVentas.id_venta = idVenta;

            this.getVentas(this.filtroVentas);
        }

        this.enviarDatos();
    }

    enviarDatos() {
        if(this.datosMenu) {
            this.NavbarService.actualizarDatos(this.datosMenu);
        }else {
            console.log('datosMenu es undefined o no contiene los datos esperados.');
        }
    }

    getClientes(filtro: FiltroCliente) {
        this.cargando = true;
    
        this.clientesService
          .getClientes(filtro)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: (data) => {
                if(data.length > 0){
                    this.cliente = data[0];
                    this.cargando = false;
                }
            },
            error: () => this.cargando = false
        });
    }

    filtroDetallesVenta: FiltroDetalleVenta = { activo: true};

    getDetallesVenta(filtro: FiltroDetalleVenta) {
        this.cargando = true;
    
        this.ventasService
          .getDetallesVenta(filtro)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: (data) => {
                if(data.length > 0){
                    this.detallesVenta = data;
                    this.cargando = false;
                }
            },
            error: () => this.cargando = false
        });
    }

    filtroVentas: FiltroVentas = { activo: true };

    totalVenta: string = '0';

    getVentas(filtro: FiltroVentas) {
        this.cargando = true;
    
        this.ventasService
          .getVentas(filtro)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: (data) => {
                if(data.length > 0){
                    this.venta = data[0];
                    this.cargando = false;

                    this.filtroClientes.id_cliente == data[0].id_cliente;

                    this.getClientes(this.filtroClientes);

                    this.filtroDetallesVenta.id_venta = data[0].id_venta;

                    this.getDetallesVenta(this.filtroDetallesVenta);

                    const totalVenta = data[0].total?.toFixed(2);

                    if(totalVenta){
                        this.totalVenta = totalVenta;
                    }
                }
            },
            error: () => this.cargando = false
        });
    }

    obtenerFechaVenta(){
        const fechaVenta = this.venta.fecha_venta;
        let fechaFormat: string = '';

        if(fechaVenta){
            fechaFormat = this.formatDate(fechaVenta);
        }

        return fechaFormat;
    }

    obtenerSubtotalDecimal(number: number): string{
        let numberString = '';

        numberString = number.toFixed(2);

        return numberString;
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

    
    
}

    

