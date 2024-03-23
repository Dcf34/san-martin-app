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

  orderColumn: string = 'id_cliente'; // Columna por la que se ordena inicialmente
  orderType: number = 1; // -1 para descendente, 1 para ascendente

  esOrderIdClienteAsc: boolean = false;
  esOrderIdClienteDesc: boolean = false; // Comienza en orden descendente

  esOrderNombreAsc: boolean = false;
  esOrderNombreDesc: boolean = false;

  esOrderTelefonoAsc: boolean = false;
  esOrderTelefonoDesc: boolean = false;

  esOrderDireccionAsc: boolean = false;
  esOrderDireccionDesc: boolean = false;

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
    this.esOrderIdClienteAsc = this.esOrderIdClienteDesc = this.esOrderNombreAsc = this.esOrderNombreDesc = this.esOrderTelefonoAsc = this.esOrderTelefonoDesc = this.esOrderDireccionAsc = this.esOrderDireccionDesc = false;
  }

  updateOrderFlags(columna: string) {
    // Basado en la columna y orderType, actualizamos la bandera correspondiente
    switch (columna) {
      case 'id_cliente':
        if (this.orderType === 1) this.esOrderIdClienteAsc = true;
        else this.esOrderIdClienteDesc = true;
        break;
      case 'nombre':
        if (this.orderType === 1) this.esOrderNombreAsc = true;
        else this.esOrderNombreDesc = true;
        break;
      case 'telefono':
        if (this.orderType === 1) this.esOrderTelefonoAsc = true;
        else this.esOrderTelefonoDesc = true;
        break;
      case 'direccion':
        if (this.orderType === 1) this.esOrderDireccionAsc = true;
        else this.esOrderDireccionDesc = true;
        break;
    }
  }
  
}

