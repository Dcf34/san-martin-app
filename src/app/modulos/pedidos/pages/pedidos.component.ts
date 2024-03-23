import { rutasAplicativo } from './../../../core/config/routes.config';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { AuthService } from '../../login/services/auth.service'
import { NavbarService } from 'src/app/shared/services/navbar.items.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FiltroPedido, PedidoDAO } from '../models/pedidos.models';
import { PedidosService } from '../services/pedidos.service';

@UntilDestroy()
@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {
  
  cargando = false;
  unsubscribe$: Subject<boolean> = new Subject<boolean>();

  redirectUrl = '';

  pedidos: PedidoDAO[] = [];

  constructor(
    private authService:AuthService,
    private router:Router,
    private activadedRoute:ActivatedRoute,
    private mensajesService:MensajesService,
    private NavbarService: NavbarService,
    private pedidosService: PedidosService
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
        icon: 'fas fa-edit', 
        label: 'Pedidos', 
        routerLink: '/inicio/pedidos'
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

    this.getPedidos(this.filtroPedidos);

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

  filtroPedidos: FiltroPedido = {
    activo: true
  };

  redirigirDetalleVenta(id_venta?: number){
        
    let url = '';

    if (id_venta) {
        url = rutasAplicativo.ventas.historial_ventas.detalle + `/${id_venta}`;
    }
    
    this.router.navigateByUrl(url);
  }

  getPedidos(filtro: FiltroPedido) {
    this.cargando = true;

    this.pedidosService
      .getPedidos(filtro)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
            if(data.length > 0){
                this.pedidos = data;
                this.cargando = false;
            }
        },
        error: () => this.cargando = false
    });
  }

//   orderColumn: string = 'id_pedido'; // Columna por la que se ordena inicialmente
//   orderType: number = 1; // -1 para descendente, 1 para ascendente

//   esOrderIdComidaAsc: boolean = false;
//   esOrderIdComidaDesc: boolean = false; // Comienza en orden descendente

//   esOrderNombreAsc: boolean = false;
//   esOrderNombreDesc: boolean = false;

//   esOrderCodigoAsc: boolean = false;
//   esOrderCodigoDesc: boolean = false;

//   esOrderPrecioAsc: boolean = false;
//   esOrderPrecioDesc: boolean = false;

//   esOrderDescripcionAsc: boolean = false;
//   esOrderDescripcionDesc: boolean = false;

//   orderTable(columna: string) {
//     // Reiniciar valores para todas las columnas excepto la seleccionada
//     this.resetOrderFlags(columna);

//     // Alternar entre ascendente y descendente para la columna seleccionada
//     if (this.orderColumn === columna) {
//       // Si la columna seleccionada ya era la columna de orden, invertimos el orden
//       this.orderType *= -1;
//     } else {
//       // Si seleccionamos una nueva columna, por defecto ordenamos ascendente
//       this.orderType = 1;
//     }

//     this.orderColumn = columna;
    
//     // Actualizar las variables booleanas basadas en orderColumn y orderType
//     this.updateOrderFlags(columna);
//   }

//   resetOrderFlags(columna: string) {
//     this.esOrderIdComidaAsc = this.esOrderIdComidaDesc = this.esOrderNombreAsc = this.esOrderNombreDesc = this.esOrderCodigoAsc = this.esOrderCodigoDesc = this.esOrderPrecioAsc = this.esOrderPrecioDesc = this.esOrderDescripcionAsc = this.esOrderDescripcionDesc = false;
//   }

//   updateOrderFlags(columna: string) {
//     // Basado en la columna y orderType, actualizamos la bandera correspondiente
//     switch (columna) {
//       case 'id_comida':
//         if (this.orderType === 1) this.esOrderIdComidaAsc = true;
//         else this.esOrderIdComidaDesc = true;
//         break;
//       case 'nombre':
//         if (this.orderType === 1) this.esOrderNombreAsc = true;
//         else this.esOrderNombreDesc = true;
//         break;
//       case 'codigo':
//         if (this.orderType === 1) this.esOrderCodigoAsc = true;
//         else this.esOrderCodigoDesc = true;
//         break;
//       case 'precio':
//         if (this.orderType === 1) this.esOrderPrecioAsc = true;
//         else this.esOrderPrecioDesc = true;
//         break;
//       case 'descripcion':
//         if (this.orderType === 1) this.esOrderDescripcionAsc = true;
//         else this.esOrderDescripcionDesc = true;
//         break;
//     }
//   }
  
}

