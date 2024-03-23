import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subject, interval, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { NombreReportes, rutasAplicativo } from 'src/app/core/config';
import { SesionJWT } from 'src/app/shared/models/jwt.model';
import { AuthService } from 'src/app/modulos/login/services/auth.service';
import { NavbarService } from 'src/app/shared/services/navbar.items.service';
import { FiltroVentas } from 'src/app/modulos/ventas/models/ventas.models';
import { Cliente, FiltroCliente } from 'src/app/modulos/clientes/models/clientes.models';
import { ClientesService } from 'src/app/modulos/clientes/services/clientes.service';
import { ReportesService } from '../../services/reportes.service';
import { saveAs } from 'file-saver';

@UntilDestroy()
@Component({
    selector: 'app-reporte-ventas',
    templateUrl: './rep-ventas.component.html',
    styleUrls: ['./rep-ventas.component.scss']
})

export class ReporteVentasComponent implements OnInit{
    rutaActual = rutasAplicativo.reportes.inicio;
    cargando: boolean = false;
    modal: DynamicDialogRef | undefined;
    itemsBreadCrumb: MenuItem[] | undefined;
    home: MenuItem | undefined;
    itemsMenu: MenuItem[] | undefined;
    redirectUrl = '';
    sesion:SesionJWT = {};
    unsubscribe$: Subject<boolean> = new Subject<boolean>();
    filtroVentas: FiltroVentas = { activo: true};
    filtroClientes: FiltroCliente = { activo: true};
    clientes: Cliente[] = [];

    fechasRango: Date[] = [];

    datosMenu = {
        itemsBreadCrumb: [
          {
            icon: 'fas fa-file-pdf', 
            label: 'Reportes', 
            routerLink: '/inicio/reportes'
          },
          {
            icon: 'fas fa-cash-register', 
            label: 'Ventas', 
            routerLink: '/inicio/reportes/ventas'
          }
        ],
        home: { label: 'Inicio', icon: 'pi pi-home', routerLink: '/' }
    };
    
    constructor(
        private authService:AuthService,
        private router:Router,
        private dialogService: DialogService,
        private mensajesService : MensajesService,
        private NavbarService: NavbarService,
        private clientesService: ClientesService,
        private reportesService: ReportesService
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

        this.getClientes(this.filtroClientes);
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

    cerrarSesion(){
        this.authService.limpiarSesion();
    }


    getClientes(filtro: any) {
        this.cargando = true;
    
        this.clientesService
          .getClientes(filtro)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: (data) => {
                if(data.length > 0){
                    this.clientes = data;
                    this.cargando = false;

                    this.clientes = this.clientes.map(cliente => ({
                        ...cliente,
                        idYNombre: `${cliente.id_cliente} - ${cliente.nombre}`
                      }));
                }
            },
            error: () => this.cargando = false
        });
    }

    async descargarReporte(){
        if(this.fechasRango.length > 0){
            this.guardarRangoFechas();
        }

        await this.downloadReporteFile(this.filtroVentas);
    }

    async downloadReporteFile(filtro: FiltroVentas){
        this.cargando = true;

        this.reportesService
        .downloadReporteVentas(filtro)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (archivoBlob) => {
            if (archivoBlob && archivoBlob.size > 0) {
              saveAs(archivoBlob, NombreReportes.ventas);
            }

            this.cargando = false;

          },
          error: (error) => {
            this.mensajesService.httpError(error);
          }
        });
    }

    limpiarFiltros(){
        this.fechasRango = [];
        this.filtroVentas = {activo: true};
    }
    

    guardarRangoFechas() {        
        const fechaDesde = this.fechasRango[0];
        const fechaHasta = this.fechasRango[1];
    
        this.filtroVentas.fecha_desde = new Date (fechaDesde);
        this.filtroVentas.fecha_hasta = new Date (fechaHasta);
    
    }
    
   
    
    
}

    


