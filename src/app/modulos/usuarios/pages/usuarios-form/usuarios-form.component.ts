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
import { FiltroUsuario, UsuarioActualizacionDto, UsuarioCreacionDto, UsuarioDto } from '../../models/usuario.models';
import { AuthService } from 'src/app/modulos/login/services/auth.service';
import { NavbarService } from 'src/app/shared/services/navbar.items.service';
import { UsuariosService } from '../../services/usuarios.service';
import { idUserCreacionToObject, idUserModificacionToObject, userIdToObject } from 'src/app/shared/models/functions/user-modification.function';

@UntilDestroy()
@Component({
    selector: 'app-usuarios-form',
    templateUrl: './usuarios-form.component.html',
    styleUrls: ['./usuarios-form.component.scss']
})
export class EdicionUsuariosComponent implements OnInit{
    rutaActual = rutasAplicativo.usuarios.edicion;
    cargando: boolean = false;
    modal: DynamicDialogRef | undefined;

    redirectUrl = '';
    sesion:SesionJWT = {};
    unsubscribe$: Subject<boolean> = new Subject<boolean>();

    idUsuario = this.route.snapshot.paramMap.get('id');
    filtroUsuario: FiltroUsuario = {};
    usuario: UsuarioDto = { activo: true };

    esEdicion: boolean = false;
    datosMenu = {};
    
    datosMenuEdicion = 
    {
        itemsBreadCrumb: [
            {
            icon: 'pi pi-fw pi-user', 
            label: 'Usuarios', 
            routerLink: '/inicio/usuarios'
            },
            {
            icon: 'pi pi-fw pi-pencil', 
            label: 'Edición', 
            routerLink: '/inicio/usuarios/edicion'
            }
        ],
        home: { label: 'Inicio', icon: 'pi pi-home', routerLink: '/' }
    };

    datosMenuAlta = 
    {
        itemsBreadCrumb: [
            {
                icon: 'pi pi-fw pi-user', 
                label: 'Usuarios', 
                routerLink: '/inicio/usuarios'
            },
            {
                icon: 'pi pi-fw pi-plus', 
                label: 'Alta', 
                routerLink: '/inicio/usuarios/alta'
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
        private usuariosService: UsuariosService
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
                const idUsuario = parseInt(id);
                this.filtroUsuario.id_usuario = idUsuario;

                this.getUsuarios(this.filtroUsuario);
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

    getUsuarios(filtro: FiltroUsuario) {
        this.cargando = true;
    
        this.usuariosService
          .getUsuarios(filtro)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: (data) => {
                if(data.length > 0){
                    this.usuario = data[0];
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
            this.crearUsuarioForm();
        }
    }

    nuevaClave?: string;

    async guardarCambios(){
        const usuarioModificacion: UsuarioActualizacionDto = {
            id_usuario: this.usuario.id_usuario,
            activo: this.usuario.activo,
            fecha_modificacion: new Date,
            nombre: this.usuario.nombre,
            correo: this.usuario.correo,
            telefono: this.usuario.telefono?.toString(),
            cuenta_usuario: this.usuario.cuenta_usuario,
            clave: btoa(this.nuevaClave ?? "")
        };

        await this.actualizarUsuario(usuarioModificacion);
    }

    async actualizarUsuario(usuarioModificacion: UsuarioActualizacionDto){
        this.usuariosService
        .updateUsuario(usuarioModificacion)
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
                        this.navegarUsuarios();
                    }
                }

                this.cargando = false; // Ocultar indicador de carga después de finalizar
            },
            error: (error) => {
            this.cargando = false; // Ocultar indicador de carga en caso de error
            }
        });
    }

    async crearUsuarioForm(){
        const usuarioCreacion: UsuarioCreacionDto = {
            activo: true,
            nombre: this.usuario.nombre,
            correo: this.usuario.correo,
            telefono: this.usuario.telefono?.toString(),
            cuenta_usuario: this.usuario.cuenta_usuario,
            clave: this.nuevaClave
        };
        
        console.log(usuarioCreacion);

        await this.crearUsuario(usuarioCreacion);

    }

    async crearUsuario(usuarioCreacion: UsuarioCreacionDto){
        this.usuariosService
        .crearUsuario(usuarioCreacion)
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
                        this.navegarUsuarios();
                    }
                }

                this.cargando = false; // Ocultar indicador de carga después de finalizar
            },
            error: (error) => {
            this.cargando = false; // Ocultar indicador de carga en caso de error
            }
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

    cerrarSesion(){
        this.authService.limpiarSesion();
    }
    
    navegarUsuarios(){
        const navigateUrl = rutasAplicativo.usuarios.inicio;
        this.router.navigateByUrl(navigateUrl);
    }

    desactivarBtnGuardar(){
        if((this.usuario.nombre == undefined || this.usuario.nombre == '' || this.usuario.nombre == null) ||
           (this.usuario.correo == undefined || this.usuario.correo == '' || this.usuario.correo == null) ||
           (this.usuario.telefono == undefined || this.usuario.telefono == '' || this.usuario.telefono == null) ||
           (this.usuario.cuenta_usuario == undefined || this.usuario.cuenta_usuario == '' || this.usuario.cuenta_usuario == null) ||
           (this.nuevaClave == undefined || this.nuevaClave == '' || this.nuevaClave == null)
        ){
            return true;
        }

        return false;
    }

    
}