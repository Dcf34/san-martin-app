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
import { Comida, FiltroComida } from '../../models/comidas.models';
import { ComidasService } from '../../services/comidas.service';
import { DeleteComidaComponent } from '../../modals/delete-comida/delete-comida.component';

@UntilDestroy()
@Component({
    selector: 'app-comidas-form',
    templateUrl: './comidas-form.component.html',
    styleUrls: ['./comidas-form.component.scss']
})
export class EdicionComidasComponent implements OnInit{
    rutaActual = rutasAplicativo.comidas.edicion;
    cargando: boolean = false;
    modal: DynamicDialogRef | undefined;

    redirectUrl = '';
    sesion:SesionJWT = {};
    unsubscribe$: Subject<boolean> = new Subject<boolean>();

    idComida = this.route.snapshot.paramMap.get('id');
    filtroComida: FiltroComida = {};
    comida: Comida = { activo: true };

    esEdicion: boolean = false;
    datosMenu = {};
    
    datosMenuEdicion = 
    {
        itemsBreadCrumb: [
            {
            icon: 'pi pi-fw pi-apple', 
            label: 'Comidas', 
            routerLink: '/inicio/comidas'
            },
            {
            icon: 'pi pi-fw pi-pencil', 
            label: 'Edición', 
            routerLink: '/inicio/comidas/edicion'
            }
        ],
        home: { label: 'Inicio', icon: 'pi pi-home', routerLink: '/' }
    };

    datosMenuAlta = 
    {
        itemsBreadCrumb: [
            {
                icon: 'pi pi-fw pi-apple', 
                label: 'Comidas', 
                routerLink: '/inicio/comidas'
            },
            {
                icon: 'pi pi-fw pi-plus', 
                label: 'Alta', 
                routerLink: '/inicio/comidas/alta'
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
        private comidasService: ComidasService
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
                const idComida = parseInt(id);
                this.filtroComida.id_comida = idComida;

                this.getComidas(this.filtroComida);
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

      getComidas(filtro: FiltroComida) {
        this.cargando = true;
    
        this.comidasService
          .getComidas(filtro)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: (data) => {
                if(data.length > 0){
                    this.comida = data[0];
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
            this.crearComidaForm();
        }
    }

    async guardarCambios(){
        const comidaModificacion: Comida = {
            id_comida: this.comida.id_comida,
            activo: this.comida.activo,
            fecha_modificacion: new Date,
            nombre: this.comida.nombre,
            precio: this.comida.precio,
            codigo: this.comida.codigo,
            descripcion: this.comida.descripcion
        };

        idUserModificacionToObject(comidaModificacion)

        await this.setComida(comidaModificacion);
    }

    async setComida(comida: Comida){
        this.cargando = true;

        this.comidasService
        .setComida(comida)
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
                        this.navegarComidas();
                    }
                }

                this.cargando = false; // Ocultar indicador de carga después de finalizar
            },
            error: (error) => {
            this.cargando = false; // Ocultar indicador de carga en caso de error
            }
        });
    }

    async crearComidaForm(){
        const comidaCreacion: Comida = {
            activo: true,
            nombre: this.comida.nombre,
            codigo: this.comida.codigo,
            precio: this.comida.precio,
            descripcion: this.comida.descripcion
        };
        
        await this.setComida(comidaCreacion);

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
    
    navegarComidas(){
        const navigateUrl = rutasAplicativo.comidas.inicio;
        this.router.navigateByUrl(navigateUrl);
    }

    desactivarBtnGuardar(){
        if((this.comida.nombre == undefined || this.comida.nombre == '' || this.comida.nombre == null) ||
           (this.comida.codigo == undefined || this.comida.codigo == '' || this.comida.codigo == null) ||
           (this.comida.precio == undefined || this.comida.precio == 0 || this.comida.precio == null)
        ){
            return true;
        }

        return false;
    }

    abrirModalEliminarComida(){
        const ref = this.dialogService.open(DeleteComidaComponent, {
          header: 'Eliminar Comida',
          width: '40%',
          data: {
            comida: this.comida
          }
        });
    
        ref.onClose.subscribe((value: boolean) => {
          // Aquí puedes manejar la descripción que se recibe al cerrar el diálogo
          if(value == true){
            this.navegarComidas();
          }
          
        });
    }

    
}