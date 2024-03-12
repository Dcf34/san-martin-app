import { rutasAplicativo } from './../../../core/config/routes.config';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { AuthService } from '../../login/services/auth.service'
import { NavbarService } from 'src/app/shared/services/navbar.items.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FiltroUsuario, UsuarioDto } from '../models/usuario.models';
import { UsuariosService } from '../services/usuarios.service';

@UntilDestroy()
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  
  cargando = false;
  unsubscribe$: Subject<boolean> = new Subject<boolean>();

  redirectUrl = '';

  usuarios: UsuarioDto[] = [];

  constructor(
    private authService:AuthService,
    private router:Router,
    private activadedRoute:ActivatedRoute,
    private mensajesService:MensajesService,
    private NavbarService: NavbarService,
    private usuariosService: UsuariosService)
    { 
      this.activadedRoute.queryParamMap.subscribe((params) => {
      const redirectUrl = params.get('redirectUrl');
      
      if(redirectUrl) 
      {
        this.redirectUrl = redirectUrl;
      }
    });
  }

  datosMenu = {
    itemsBreadCrumb: [
      { 
        icon: 'pi pi-fw pi-user', 
        label: 'Usuarios', 
        routerLink: '/inicio/usuarios'
      }
    ],

    home: { label: 'Inicio', icon: 'pi pi-home', routerLink: '/' }
  };


  ngOnInit(): void {
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

    this.getUsuarios(this.filtroUsr);

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
    if (this.datosMenu) {
      this.NavbarService.actualizarDatos(this.datosMenu);
    } else {
      console.log('datosMenu es undefined o no contiene los datos esperados.');
    }
  }

  navegarLogin() {
    const navigateUrl = this.redirectUrl ? this.redirectUrl : rutasAplicativo.login;
    this.router.navigateByUrl(navigateUrl);
  }

  navegarPortal() {
    const navigateUrl = this.redirectUrl ? this.redirectUrl : rutasAplicativo.inicio;
    this.router.navigateByUrl(navigateUrl);
  }

  filtroUsr: FiltroUsuario = {
    activo: true
  };

  redirigirDetalleId(id_usuario?: number){
        
    let url = '';

    if (id_usuario) {
        url = rutasAplicativo.usuarios.edicion + `/${id_usuario}`;
    }
    
    this.router.navigateByUrl(url);
  }

  redirigirPermisosId(id_usuario?: number){
        
    let url = '';

    if (id_usuario) {
        url = rutasAplicativo.usuarios.permisos + `/${id_usuario}`;
    }
    
    this.router.navigateByUrl(url);
  }

  redirigirAlta(){
        
    let url = '';

    url = rutasAplicativo.usuarios.alta;
    
    this.router.navigateByUrl(url);
  }

  getUsuarios(filtro: FiltroUsuario) {
    this.cargando = true;

    this.usuariosService
      .getUsuarios(filtro)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
            if(data.length > 0){
                this.usuarios = data;
                this.cargando = false;
            }
        },
        error: () => this.cargando = false
    });
  }

  orderColumn: string = 'id_usuario'; // Columna por la que se ordena inicialmente
  orderType: number = 1; // -1 para descendente, 1 para ascendente

  esOrderIdUsuarioAsc: boolean = false;
  esOrderIdUsuarioDesc: boolean = false; // Comienza en orden descendente

  esOrderNombreAsc: boolean = false;
  esOrderNombreDesc: boolean = false;

  esOrderCorreoAsc: boolean = false;
  esOrderCorreoDesc: boolean = false;

  esOrderTelefonoAsc: boolean = false;
  esOrderTelefonoDesc: boolean = false;

  esOrderUsuarioAsc: boolean = false;
  esOrderUsuarioDesc: boolean = false;

  orderTable(columna: string) {
    // Reiniciar valores para todas las columnas excepto la seleccionada
    this.resetOrderFlags(columna);

    // Alternar entre ascendente y descendente para la columna seleccionada
    if (this.orderColumn === columna) {
      // Si la columna seleccionada ya era la columna de orden, invertimos el orden
      this.orderType *= -1;
    } else {
      // Si seleccionamos una nueva columna, por defecto ordenamos ascendente
      this.orderType = 1;
    }

    this.orderColumn = columna;
    
    // Actualizar las variables booleanas basadas en orderColumn y orderType
    this.updateOrderFlags(columna);
  }

  resetOrderFlags(columna: string) {
    this.esOrderIdUsuarioAsc = this.esOrderIdUsuarioDesc = this.esOrderNombreAsc = this.esOrderNombreDesc = this.esOrderCorreoAsc = this.esOrderCorreoDesc = this.esOrderTelefonoAsc = this.esOrderTelefonoDesc = this.esOrderUsuarioAsc = this.esOrderUsuarioDesc = false;
  }

  updateOrderFlags(columna: string) {
    // Basado en la columna y orderType, actualizamos la bandera correspondiente
    switch (columna) {
      case 'id_usuario':
        if (this.orderType === 1) this.esOrderIdUsuarioAsc = true;
        else this.esOrderIdUsuarioDesc = true;
        break;
      case 'nombre':
        if (this.orderType === 1) this.esOrderNombreAsc = true;
        else this.esOrderNombreDesc = true;
        break;
      case 'correo':
        if (this.orderType === 1) this.esOrderCorreoAsc = true;
        else this.esOrderCorreoDesc = true;
        break;
      case 'telefono':
        if (this.orderType === 1) this.esOrderTelefonoAsc = true;
        else this.esOrderTelefonoDesc = true;
        break;
      case 'cuenta_usuario':
        if (this.orderType === 1) this.esOrderUsuarioAsc = true;
        else this.esOrderUsuarioDesc = true;
        break;
    }
  }
}
