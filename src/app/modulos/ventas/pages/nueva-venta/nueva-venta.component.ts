import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subject, interval, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { rutasAplicativo } from 'src/app/core/config';
import { SesionJWT } from 'src/app/shared/models/jwt.model';
import { AuthService } from 'src/app/modulos/login/services/auth.service';
import { NavbarService } from 'src/app/shared/services/navbar.items.service';
import { Cliente, FiltroCliente } from 'src/app/modulos/clientes/models/clientes.models';
import { Comida, FiltroComida } from 'src/app/modulos/comidas/models/comidas.models';
import { ClientesService } from 'src/app/modulos/clientes/services/clientes.service';
import { ComidasService } from 'src/app/modulos/comidas/services/comidas.service';
import { DetalleVentaDTO, VentaDTO } from '../../models/ventas.models';
import Decimal from 'decimal.js';
import { idUserModificacionToObject } from 'src/app/shared/models/functions/user-modification.function';
import { VentasService } from '../../services/ventas.service';

@UntilDestroy()
@Component({
    selector: 'app-nueva-venta',
    templateUrl: './nueva-venta.component.html',
    styleUrls: ['./nueva-venta.component.scss']
})

export class NuevaVentaComponent implements OnInit{
    rutaActual = rutasAplicativo.ventas.nueva_venta;
    cargando: boolean = false;
    modal: DynamicDialogRef | undefined;
    itemsBreadCrumb: MenuItem[] | undefined;
    home: MenuItem | undefined;
    itemsMenu: MenuItem[] | undefined;
    redirectUrl = '';
    sesion:SesionJWT = {};
    unsubscribe$: Subject<boolean> = new Subject<boolean>();
    
    datosMenu = {
        itemsBreadCrumb: [
          {
            icon: 'fas fa-cash-register', 
            label: 'Ventas', 
            routerLink: '/inicio/ventas'
          },
          {
            icon: 'pi pi-plus', 
            label: 'Nueva Venta', 
            routerLink: '/inicio/ventas/alta'
          }
        ],
        home: { label: 'Inicio', icon: 'pi pi-home', routerLink: '/' }
    };

    clientes: Cliente[] = [];

    comidas: Comida[] = [];

    idComidaSeleccionada?: number;

    comidaSeleccionada: Comida = {};

    idClienteSeleccionado?: number;

    clienteSeleccionado: Cliente = {};

    subTotalComida?: string;

    cantidadComida?: number;

    elementosSeleccionados: DetalleVentaDTO[] = [];

    totalVenta: number = 0;

    constructor(
        private authService:AuthService,
        private router:Router,
        private dialogService: DialogService,
        private mensajesService : MensajesService,
        private NavbarService: NavbarService,
        private clientesService: ClientesService,
        private comidasService: ComidasService,
        private ventasService: VentasService,
        private cdRef: ChangeDetectorRef
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

        this.getClientes(this.filtroClientes);
        this.getComidas(this.filtroComidas);

        this.enviarDatos();
    }

    enviarDatos() {
        if(this.datosMenu) {
            this.NavbarService.actualizarDatos(this.datosMenu);
        }else {
            console.log('datosMenu es undefined o no contiene los datos esperados.');
        }
    }

    escogerCliente(){
        const idCliente = this.idClienteSeleccionado;

        if(idCliente){
            const cliente = this.clientes.find(x=> x.id_cliente == idCliente);

            this.clienteSeleccionado = cliente ?? {};
        }
    }

    escogerComida(){
        const idComida = this.idComidaSeleccionada;

        if(idComida){
            const comida = this.comidas.find(x=> x.id_comida == idComida);

            this.comidaSeleccionada = comida ?? {};

        }
    }

    actualizarSubtotal(){
        const cantidad = this.cantidadComida;
        let subtotal: number | undefined = undefined;

        if(cantidad){
            if(this.comidaSeleccionada && this.comidaSeleccionada.precio){
                subtotal = this.comidaSeleccionada.precio * cantidad;

                subtotal = this.roundTo2(subtotal);
                const subtotalString = subtotal.toFixed(2);

                this.subTotalComida = subtotalString;
            }
        }

    }

    filtroClientes: FiltroCliente = { activo: true };
    filtroComidas: FiltroComida = { activo: true };

    getClientes(filtro: FiltroCliente) {
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

    navegarVentas(){
        const navigateUrl = rutasAplicativo.ventas.inicio;
        this.router.navigateByUrl(navigateUrl);
    }

    cerrarSesion(){
        this.authService.limpiarSesion();
    }

    verificarDescuento(elemento: DetalleVentaDTO){
        // Verifica si el descuento no aplica
        if(elemento.aplica_desc === false){
            // Encuentra el índice del elemento en la lista por su id_comida
            const elementoDetalleIndex = this.elementosSeleccionados.findIndex(x => x.id_comida === elemento.id_comida);
            
            // Verifica si el índice es válido y diferente de -1
            if(elementoDetalleIndex !== -1){
                // Si el descuento no aplica, establece el descuento del elemento encontrado a undefined
                this.elementosSeleccionados[elementoDetalleIndex].descuento = undefined;
            }
        }
    }

    verificarSubtotal(elemento: DetalleVentaDTO): string {
        if (elemento.aplica_desc === true) {
            const elementoDetalleIndex = this.elementosSeleccionados.findIndex(x => x.id_comida === elemento.id_comida);
    
            if (elementoDetalleIndex !== -1) {
                const aplicaDesc = this.elementosSeleccionados[elementoDetalleIndex].aplica_desc;
                const descuento = this.elementosSeleccionados[elementoDetalleIndex].descuento;
                const precio = this.elementosSeleccionados[elementoDetalleIndex].precio;
                const cantidad = this.elementosSeleccionados[elementoDetalleIndex].cantidad;
    
                if (aplicaDesc && descuento !== undefined) {
                    if (descuento && precio && cantidad) {
                        // Usando Decimal.js para los cálculos
                        let nuevoSubtotal = new Decimal(precio).times(cantidad);
                        let nuevoDesc = nuevoSubtotal.times(descuento).div(100);
                        let nuevoSubtotalDesc = nuevoSubtotal.minus(nuevoDesc);
    
                        // Convertimos el resultado a number
                        this.elementosSeleccionados[elementoDetalleIndex].subtotal = nuevoSubtotalDesc.toNumber();
                        this.cdRef.markForCheck();
                        return nuevoSubtotalDesc.toFixed(2);
                    }
                } else {
                    if (precio && cantidad) {
                        let nuevoSubtotal = new Decimal(precio).times(cantidad);
    
                        this.elementosSeleccionados[elementoDetalleIndex].subtotal = nuevoSubtotal.toNumber();
                        this.cdRef.markForCheck();

                        return nuevoSubtotal.toFixed(2);
                    }
                }
            }
        }
    
        const elementoDetalleIndex = this.elementosSeleccionados.findIndex(x => x.id_comida === elemento.id_comida);
    
        if (elementoDetalleIndex !== -1) {
            const cantidad = this.elementosSeleccionados[elementoDetalleIndex].cantidad;
            const precio = this.elementosSeleccionados[elementoDetalleIndex].precio;
    
            if (cantidad && precio) {
                let nuevoSubtotal = new Decimal(cantidad).times(precio);
    
                this.elementosSeleccionados[elementoDetalleIndex].subtotal = nuevoSubtotal.toNumber();
                this.cdRef.markForCheck();

                return nuevoSubtotal.toFixed(2);
            }
        }
    
        return '0'; // Retornamos 0 como número, manteniendo la consistencia del tipo de retorno.
    }

    roundTo2(num: any): number {
        return +(Math.round(Number(num + "e+2")) + "e-2");
    }

    eliminarElemento(elemento: DetalleVentaDTO){
        const elementoDetalleIndex = this.elementosSeleccionados.findIndex(x => x.id_comida === elemento.id_comida);

        if(elementoDetalleIndex !== -1){
            this.elementosSeleccionados = this.elementosSeleccionados.filter(x=> x.id_comida !== elemento.id_comida);
        }
    }

    verificarTotalVenta(): string{
        let sumaVenta = 0;

        if(this.elementosSeleccionados.length > 0){
            this.elementosSeleccionados.forEach(element => {
                if(element.subtotal !== undefined){
                    sumaVenta += this.roundTo2(element.subtotal);
                }
            });

            const string = parseFloat(sumaVenta.toString()).toFixed(2);

            this.totalVenta = parseFloat(string);

            return sumaVenta.toFixed(2);
        }

        return '0';
    }

    agregarElemento(){
        
        const comida = this.comidaSeleccionada;

        const nuevoElemento: DetalleVentaDTO = {
            activo: true,
            id_comida: comida.id_comida,
            descripcion: comida.descripcion,
            precio: comida.precio,
            cantidad: this.cantidadComida,
            subtotal: (comida.precio ?? 0) * (this.cantidadComida ?? 0)
        };

        nuevoElemento.subtotal = this.roundTo2(nuevoElemento.subtotal);

        const existeDetalleIndex = this.elementosSeleccionados.findIndex(x => x.id_comida === nuevoElemento.id_comida);

        if(existeDetalleIndex !== -1){
            // Si el descuento no aplica, establece el descuento del elemento encontrado a undefined
            const cantidad = this.cantidadComida ?? 1;
            if(this.elementosSeleccionados[existeDetalleIndex] !== undefined){
                const cantidadOriginal = this.elementosSeleccionados[existeDetalleIndex].cantidad;
                const precioOriginal = this.elementosSeleccionados[existeDetalleIndex].precio;

                const nuevaCantidad = this.cantidadComida;

                if(cantidadOriginal !== undefined && nuevaCantidad !== undefined && precioOriginal !== undefined){
                    const suma = cantidadOriginal + nuevaCantidad;
                    const nuevoPrecio = suma * precioOriginal;

                    this.elementosSeleccionados[existeDetalleIndex].cantidad = suma;
                    this.elementosSeleccionados[existeDetalleIndex].subtotal = nuevoPrecio;

                }
            }
        }else{
            this.elementosSeleccionados.push(nuevoElemento);
        }

        this.comidaSeleccionada = {};
        this.idComidaSeleccionada = undefined;
        this.subTotalComida = undefined;
        this.cantidadComida = undefined;

    }
   
    async guardarVenta(){
        const nuevaVenta: VentaDTO = {
            activo: true,
            id_cliente: this.idClienteSeleccionado,
            fecha_venta: new Date,
            total: this.totalVenta,
            detalles_venta: this.elementosSeleccionados
        };

        idUserModificacionToObject(nuevaVenta);

        console.log(nuevaVenta);

        await this.crearVenta(nuevaVenta);
    }

    async crearVenta(venta: VentaDTO){
        this.cargando = true;

        this.ventasService
        .setVenta(venta)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
            next: (ejecucion) => {
                if (ejecucion.exitoso) {
                    // Guardar mensaje en sessionStorage o localStorage
                    sessionStorage.setItem('mensajePostNavegacion', ejecucion.mensaje);

                    this.navegarVentas();
                }

                this.cargando = false; // Ocultar indicador de carga después de finalizar
            },
            error: (error) => {
            this.cargando = false; // Ocultar indicador de carga en caso de error
            }
        });
    }


    verificarDescuentos(){
        let existeElemento: boolean = false;

        if(this.elementosSeleccionados.length > 0){
            this.elementosSeleccionados.forEach(element => {
                if(element.aplica_desc == true && element.descuento == undefined){
                    existeElemento = true;
                }
            });

            if(existeElemento && existeElemento == true){
                return false;
            }

            return true;
        }
        
        return false;
    }

    validarDescuentoTemporal(item: DetalleVentaDTO, valor: string): void {
        
        if(valor && (parseInt(valor) < 1 || parseInt(valor) > 100)) {
          item.descuento = parseInt(valor) < 1 ? undefined : (parseInt(valor) > 100 ? undefined : parseInt(valor));
        } else if(!valor) {
          // Temporalmente acepta el valor vacío o no numérico hasta que se pierda el foco.
          item.descuento = parseInt(valor);
        }

        if(valor.length > 3){
            item.descuento = undefined;
        }

        
      }
    
}

    

