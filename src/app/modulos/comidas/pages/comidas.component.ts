import { rutasAplicativo } from './../../../core/config/routes.config';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { AuthService } from '../../login/services/auth.service'
import { NavbarService } from 'src/app/shared/services/navbar.items.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Comida, FiltroComida } from '../models/comidas.models';
import { ComidasService } from '../services/comidas.service';

@UntilDestroy()
@Component({
  selector: 'app-comidas',
  templateUrl: './comidas.component.html',
  styleUrls: ['./comidas.component.scss']
})
export class ComidasComponent implements OnInit {
  
  cargando = false;
  unsubscribe$: Subject<boolean> = new Subject<boolean>();

  redirectUrl = '';

  comidas: Comida[] = [];

  constructor(
    private authService:AuthService,
    private router:Router,
    private activadedRoute:ActivatedRoute,
    private mensajesService:MensajesService,
    private NavbarService: NavbarService,
    private comidasService: ComidasService
   )
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
        icon: 'pi pi-fw pi-apple', 
        label: 'Comidas', 
        routerLink: '/inicio/comidas'
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

    this.getComidas(this.filtroComida);

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

  filtroComida: FiltroComida = {
    activo: true
  };

  redirigirDetalleId(id_comida?: number){
        
    let url = '';

    if (id_comida) {
        url = rutasAplicativo.comidas.edicion + `/${id_comida}`;
    }
    
    this.router.navigateByUrl(url);
  }

  redirigirAlta(){
        
    let url = '';

    url = rutasAplicativo.comidas.alta;
    
    this.router.navigateByUrl(url);
  }

  getComidas(filtro: FiltroComida) {
    this.cargando = true;

    this.comidasService
      .getComidas(filtro)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
            if(data.length > 0){
                this.comidas = data;
                this.cargando = false;
            }
        },
        error: () => this.cargando = false
    });
}
  
}

