import { rutasAplicativo } from './../../../core/config/routes.config';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { AuthService } from '../../login/services/auth.service'
import { NavbarService } from 'src/app/shared/services/navbar.items.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Cliente, FiltroCliente } from '../models/clientes.models';
import { ClientesService } from '../services/clientes.service';

@UntilDestroy()
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
  
  cargando = false;
  unsubscribe$: Subject<boolean> = new Subject<boolean>();

  redirectUrl = '';

  clientes: Cliente[] = [];

  constructor(
    private authService:AuthService,
    private router:Router,
    private activadedRoute:ActivatedRoute,
    private mensajesService:MensajesService,
    private NavbarService: NavbarService,
    private clientesService: ClientesService)
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
        icon: 'pi pi-fw pi-users', 
        label: 'Clientes', 
        routerLink: '/inicio/clientes'
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

    this.getClientes(this.filtroClientes);

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

  filtroClientes: FiltroCliente = {
    activo: true
  };

  redirigirDetalleId(id_usuario?: number){
        
    let url = '';

    if (id_usuario) {
        url = rutasAplicativo.clientes.edicion + `/${id_usuario}`;
    }
    
    this.router.navigateByUrl(url);
  }

  redirigirAlta(){
        
    let url = '';

    url = rutasAplicativo.clientes.alta;
    
    this.router.navigateByUrl(url);
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
            }
        },
        error: () => this.cargando = false
    });
}
  
}

