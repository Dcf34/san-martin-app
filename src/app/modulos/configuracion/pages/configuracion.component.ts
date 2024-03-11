import { rutasAplicativo } from './../../../core/config/routes.config';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { AuthService } from '../../login/services/auth.service'
import { NavbarService } from 'src/app/shared/services/navbar.items.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Configuracion } from '../models/configuracion.models';
import { ConfiguracionService } from '../services/configuracion.services';

@UntilDestroy()
@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss']
})
export class ConfiguracionComponent implements OnInit {
  
  cargando = false;
  unsubscribe$: Subject<boolean> = new Subject<boolean>();

  redirectUrl = '';

  datosEmpresa: Configuracion = {};

  constructor(
    private authService:AuthService,
    private router:Router,
    private activadedRoute:ActivatedRoute,
    private mensajesService:MensajesService,
    private NavbarService: NavbarService,
    private configuracionService: ConfiguracionService
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
        icon: 'pi pi-fw pi-cog', 
        label: 'Configuracion', 
        routerLink: '/inicio/configuracion'
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

    this.getDatos();

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

  getDatos() {
    this.cargando = true;

    this.configuracionService
      .getDatos()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
            if(data.length > 0){
                this.datosEmpresa = data[0];
                this.cargando = false;
            }
        },
        error: () => this.cargando = false
    });
}

    guardar(){
        const configuracion = this.datosEmpresa;

        this.cargando = true;

        this.configuracionService
        .setDatos(configuracion)
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
    }
  
}

