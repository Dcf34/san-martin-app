import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subject, interval, takeUntil, filter, switchMap, map, of } from 'rxjs';
import { formatDate } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { SesionJWT } from 'src/app/shared/models/jwt.model';
import { ActivatedRoute, Router } from '@angular/router';
import { rutasAplicativo } from 'src/app/core/config';
import { AuthService } from 'src/app/modulos/login/services/auth.service';
import { NavbarService } from 'src/app/shared/services/navbar.items.service';
import { idUserCreacionToObject, idUserModificacionToObject, userIdToObject } from 'src/app/shared/models/functions/user-modification.function';
import { Cliente, FiltroCliente } from '../../models/clientes.models';
import { ClientesService } from '../../services/clientes.service';
import { DeleteClienteComponent } from '../../modals/delete-cliente.component';

@UntilDestroy()
@Component({
    selector: 'app-clientes-form',
    templateUrl: './clientes-form.component.html',
    styleUrls: ['./clientes-form.component.scss']
})
export class EdicionClientesComponent implements OnInit{
    rutaActual = rutasAplicativo.usuarios.edicion;
    cargando: boolean = false;
    modal: DynamicDialogRef | undefined;

    redirectUrl = '';
    sesion:SesionJWT = {};
    unsubscribe$: Subject<boolean> = new Subject<boolean>();

    idUsuario = this.route.snapshot.paramMap.get('id');
    filtroCliente: FiltroCliente = {};
    cliente: Cliente = { activo: true };

    esEdicion: boolean = false;
    datosMenu = {};
    
    datosMenuEdicion = 
    {
        itemsBreadCrumb: [
            {
            icon: 'pi pi-fw pi-users', 
            label: 'Clientes', 
            routerLink: '/inicio/clientes'
            },
            {
            icon: 'pi pi-fw pi-pencil', 
            label: 'Edición', 
            routerLink: '/inicio/clientes/edicion'
            }
        ],
        home: { label: 'Inicio', icon: 'pi pi-home', routerLink: '/' }
    };

    datosMenuAlta = 
    {
        itemsBreadCrumb: [
            {
                icon: 'pi pi-fw pi-user', 
                label: 'Clientes', 
                routerLink: '/inicio/clientes'
            },
            {
                icon: 'pi pi-fw pi-plus', 
                label: 'Alta', 
                routerLink: '/inicio/clientes/alta'
            }
        ],
        home: { label: 'Inicio', icon: 'pi pi-home', routerLink: '/' }
    };

    idPantalla?: number;
    
    constructor(
        private authService: AuthService,
        private router: Router,
        private dialogService: DialogService,
        private mensajesService: MensajesService,
        private NavbarService: NavbarService,
        private route: ActivatedRoute, 
        private clientesService: ClientesService
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

        const url = this.router.url;

        if (url.includes('edicion')) {            
            this.datosMenu = this.datosMenuEdicion;
            this.esEdicion = true;

            let id = this.route.snapshot.paramMap.get('id');

            if(id){
                const idCliente = parseInt(id);
                this.filtroCliente.id_cliente = idCliente;

                this.getClientes(this.filtroCliente);
            }

        } else if (url.includes('alta')) {
            this.datosMenu = this.datosMenuAlta;
        } else {
            this.navegarPortal();
        }

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

    enviarDatos() {
        if(this.datosMenu) {
            this.NavbarService.actualizarDatos(this.datosMenu);
        }else {
            console.log('datosMenu es undefined o no contiene los datos esperados.');
        }
    }

    guardar(){
        if(this.esEdicion){
            this.guardarCambios();
        }else{
            this.crearClienteForm();
        }
    }

    nuevaClave?: string;

    async guardarCambios(){
        const clienteModificacion: Cliente = {
            id_cliente: this.cliente.id_cliente,
            activo: this.cliente.activo,
            fecha_modificacion: new Date,
            nombre: this.cliente.nombre,
            telefono: this.cliente.telefono?.toString(),
            direccion: this.cliente.direccion
        };

        idUserModificacionToObject(clienteModificacion)

        await this.setCliente(clienteModificacion);
    }

    async setCliente(cliente: Cliente){
        this.cargando = true;

        this.clientesService
        .setCliente(cliente)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
            next: (ejecucion) => {
                if (ejecucion.exitoso) {
                    // Guardar mensaje en sessionStorage o localStorage
                    sessionStorage.setItem('mensajePostNavegacion', ejecucion.mensaje);

                    if(this.esEdicion){
                        location.reload();
                    }
                    else{
                        this.navegarClientes();
                    }
                }

                this.cargando = false; // Ocultar indicador de carga después de finalizar
            },
            error: (error) => {
            this.cargando = false; // Ocultar indicador de carga en caso de error
            }
        });
    }

    async crearClienteForm(){
        const clienteCreacion: Cliente = {
            activo: true,
            nombre: this.cliente.nombre,
            telefono: this.cliente.telefono?.toString(),
            direccion: this.cliente.direccion,
        };
        
        console.log(clienteCreacion);

        await this.setCliente(clienteCreacion);

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
    
    navegarClientes(){
        const navigateUrl = rutasAplicativo.clientes.inicio;
        this.router.navigateByUrl(navigateUrl);
    }

    desactivarBtnGuardar(){
        if((this.cliente.nombre == undefined || this.cliente.nombre == '' || this.cliente.nombre == null) ||
           (this.cliente.telefono == undefined || this.cliente.telefono == '' || this.cliente.telefono == null) ||
           (this.cliente.direccion == undefined || this.cliente.direccion == '' || this.cliente.direccion == null)
        ){
            return true;
        }

        return false;
    }

    abrirModalEliminarCliente(){
        const ref = this.dialogService.open(DeleteClienteComponent, {
          header: 'Eliminar Cliente',
          width: '40%',
          data: {
            cliente: this.cliente
          }
        });
    
        ref.onClose.subscribe((value: boolean) => {
          // Aquí puedes manejar la descripción que se recibe al cerrar el diálogo
          if(value == true){
            this.navegarClientes();
          }
          
        });
      }

    
}