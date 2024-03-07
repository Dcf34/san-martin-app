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
import { asignDates, idUserCreacionToObject, idUserModificacionToObject, userIdToObject } from 'src/app/shared/models/functions/user-modification.function';
import { Permiso, PermisoUsuario } from '../../models/permiso.models';
import { PermisosService } from '../../services/permisos-service';

@UntilDestroy()
@Component({
    selector: 'app-usuarios-permisos',
    templateUrl: './usuarios-permisos.component.html',
    styleUrls: ['./usuarios-permisos.component.scss']
})
export class EdicionUsuariosPermisosComponent implements OnInit{
    rutaActual = rutasAplicativo.usuarios.edicion;
    cargando: boolean = false;
    modal: DynamicDialogRef | undefined;

    redirectUrl = '';
    sesion:SesionJWT = {};
    unsubscribe$: Subject<boolean> = new Subject<boolean>();
    
    datosMenu = 
    {
        itemsBreadCrumb: [
            {
            icon: 'pi pi-fw pi-user', 
            label: 'Usuarios', 
            routerLink: '/inicio/usuarios'
            },
            {
            icon: 'fas fa-key', 
            label: 'Permisos', 
            routerLink: '/inicio/usuarios/permisos'
            }
        ],
        home: { label: 'Inicio', icon: 'pi pi-home', routerLink: '/' }
    };

    idUsuario?: number;
    
    constructor(
        private authService: AuthService,
        private router: Router,
        private dialogService: DialogService,
        private mensajesService: MensajesService,
        private NavbarService: NavbarService,
        private route: ActivatedRoute, 
        private usuariosService: UsuariosService,
        private permisosService: PermisosService
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

        this.getPermisos();

        const url = this.router.url;
        
        let id = this.route.snapshot.paramMap.get('id');

        if(id){
            const idUsuario = parseInt(id);
            this.idUsuario = idUsuario;

            this.getPermisosUsuario(this.idUsuario);
        }

        this.enviarDatos();

        this.imprimirMensaje();

    }

    permisos: Permiso[] = [];
    permisosUsuario: PermisoUsuario[] = [];

    async getPermisos(){
        this.cargando = true;
    
        this.permisosService
            .getPermisos()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
            next: (data) => {
                if(data.length > 0){
                    this.permisos = data;
                    this.cargando = false;
                }
            },
            error: () => this.cargando = false
        });
    }

    permisosUsuariosInactivos: PermisoUsuario[] = [];

    async getPermisosUsuario(id_usuario: number){
        this.cargando = true;
    
        this.usuariosService
            .getPermisosUsuario(id_usuario)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
            next: (data) => {
                if(data.length > 0){
                    this.permisosUsuario = data.filter(x => x.activo == true);
                    this.permisosUsuariosInactivos = data.filter(x => x.activo == false);

                    this.cargando = false;

                    this.permisosUsuario.forEach(x => {
                        const idPermiso = x.id_permiso;

                        if(idPermiso){
                            this.permisosSelected.push(idPermiso);
                        }

                    });
                }
            },
            error: () => this.cargando = false
        });
    }
    permisosSelected: number[] = [];

    async imprimirMensaje(){

        setTimeout(() => {
          const mensaje = sessionStorage.getItem('mensajePostNavegacion');
          if (mensaje) {
              this.mensajesService.exitoso('Exitoso', mensaje);
          }
    
          sessionStorage.removeItem('mensajePostNavegacion');
        }, 0);
    
      }

    // getUsuarios(filtro: FiltroUsuario) {
    //     this.cargando = true;
    
    //     this.usuariosService
    //       .getUsuarios(filtro)
    //       .pipe(takeUntil(this.unsubscribe$))
    //       .subscribe({
    //         next: (data) => {
    //             if(data.length > 0){
    //                 this.usuario = data[0];
    //                 this.cargando = false;
    //             }
    //         },
    //         error: () => this.cargando = false
    //     });
    // }

    enviarDatos() {
        if(this.datosMenu) {
            this.NavbarService.actualizarDatos(this.datosMenu);
        }else {
            console.log('datosMenu es undefined o no contiene los datos esperados.');
        }
    }

    guardar(){
        console.log('selected', this.permisosSelected);
        console.log('deleted', this.permisosEliminados);

        //Mandamos solo los nuevos permisos y los que se vayan a eliminar

        const permisosUsuario: PermisoUsuario[] = [];

        if(this.permisosSelected.length > 0 ){
            this.permisosSelected.forEach(x => {
                const estabaAsignado = this.permisosUsuario.find(y => y.id_permiso === x);
    
                if(!estabaAsignado){
                    const permisoUsuario: PermisoUsuario = {
                        id_permiso: x,
                        id_usuario: this.idUsuario,
                        activo: true
                    };

                    const permisoInactivo = this.permisosUsuariosInactivos.find(x => x.id_permiso == permisoUsuario.id_permiso && x.id_usuario == permisoUsuario.id_usuario);

                    if(permisoInactivo !== undefined){
                        permisoUsuario.id_permiso_usuario = permisoInactivo.id_permiso_usuario;
                    }

                    idUserModificacionToObject(permisoUsuario);
                    idUserCreacionToObject(permisoUsuario);

                    asignDates(permisoUsuario);
    
                    permisosUsuario.push(permisoUsuario);
                }
            });
        }

        if(this.permisosEliminados.length > 0 )
        {
            this.permisosEliminados.forEach(permiso => {
                const permisoUsuario = this.permisosUsuario.find(x => x.id_permiso == permiso);
    
                if(permisoUsuario !== undefined){
                    const permisoDeleteUsuario: PermisoUsuario = {
                        id_permiso_usuario: permisoUsuario.id_permiso_usuario,
                        id_permiso: permisoUsuario.id_permiso,
                        id_usuario: this.idUsuario,
                        activo: false
                    };

                    idUserModificacionToObject(permisoDeleteUsuario);
    
                    permisosUsuario.push(permisoDeleteUsuario);
                }
            });
        }

        this.usuariosService
        .setPermisosUsuario(permisosUsuario)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
            next: (ejecucion) => {
                if (ejecucion.exitoso) {
                    // Guardar mensaje en sessionStorage o localStorage
                    sessionStorage.setItem('mensajePostNavegacion', ejecucion.mensaje);

                    location.reload();
                }

                this.cargando = false; // Ocultar indicador de carga después de finalizar
            },
            error: (error) => {
            this.cargando = false; // Ocultar indicador de carga en caso de error
            }
        });

        console.log('permisos a mandar', permisosUsuario);
    }

    // async actualizarUsuario(usuarioModificacion: UsuarioActualizacionDto){
    //     this.usuariosService
    //     .updateUsuario(usuarioModificacion)
    //     .pipe(takeUntil(this.unsubscribe$))
    //     .subscribe({
    //         next: (ejecucion) => {
    //             if (ejecucion.exitoso) {
    //                 // Guardar mensaje en sessionStorage o localStorage
    //                 sessionStorage.setItem('mensajePostNavegacion', ejecucion.mensaje);

    //                 if(this.esEdicion){
    //                     location.reload();
    //                 }
    //                 else{
    //                     this.navegarUsuarios();
    //                 }
    //             }

    //             this.cargando = false; // Ocultar indicador de carga después de finalizar
    //         },
    //         error: (error) => {
    //         this.cargando = false; // Ocultar indicador de carga en caso de error
    //         }
    //     });
    // }

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

    tienePermiso(id_permiso: number) : boolean {
        const tienePermiso = this.permisosUsuario.find(x => x.id_permiso === id_permiso);

        if(tienePermiso !== undefined){
            return true;
        }

        return false;
    }

    permisosEliminados: number[] = [];

    onCheckboxChange(event: any, idPermiso: number) {
        if (event.target.checked) {
          // Si el checkbox es marcado, añade el idPermiso al array
          this.permisosSelected.push(idPermiso);

          const estabaAsignado = this.permisosUsuario.find(x => x.id_permiso === idPermiso);

          if(estabaAsignado){
            this.permisosEliminados = this.permisosEliminados.filter(id => id != idPermiso);
          }
        } else {
          // Si el checkbox es desmarcado, remueve el idPermiso del array
          this.permisosSelected = this.permisosSelected.filter(id => id != idPermiso);

          const estabaAsignado = this.permisosUsuario.find(x => x.id_permiso === idPermiso);

          if(estabaAsignado){
            this.permisosEliminados.push(idPermiso);
          }
        }
    }

    
}