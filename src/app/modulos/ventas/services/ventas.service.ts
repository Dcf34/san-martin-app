import { localStorageKeys } from './../../../core/config/sesion.config';
import { Ejecucion } from '../../../shared/models/ejecucion.models';
import { ApiService } from '../../../core/services/api.service';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { SesionJWT } from '../../login/models/jwt.model';
import {  Subject, takeUntil, lastValueFrom, firstValueFrom } from 'rxjs';
import { rutasAplicativo } from '../../../core/config/routes.config';
import { MensajesService } from '../../../core/services/mensajes.service';
import { cleanParam, cleanParamBool, cleanParamDate, cleanParamNum } from 'src/app/shared/models/functions/params.function';
import { asignDates, idUserCreacionToObject, idUserModificacionToObject, userIdToObject, userToForm, userToObject, usuarioToObject } from 'src/app/shared/models/functions/user-modification.function';
import { DetalleVentaDAO, FiltroDetalleVenta, FiltroVentas, VentaDAO, VentaDTO } from '../models/ventas.models';


@Injectable({
  providedIn: 'root'
})
export class VentasService {

  seccion = '/ventas';
  rutasInicio = rutasAplicativo.inicio;
  jwt:JwtHelperService = new JwtHelperService();

  unsubscribe$: Subject<boolean> = new Subject<boolean>();
  
  constructor(
    private api:ApiService,
    private router:Router,
    private mensajesService:MensajesService
  ) { }

  public getVentas(filtro: FiltroVentas) {
    const url = `${this.seccion}?`+
                `id_venta=${cleanParamNum(filtro?.id_venta)}` +
                `&activo=${cleanParamBool(filtro?.activo)}` +
                `&fecha_desde=${cleanParamDate(filtro?.fecha_desde)}` +
                `&fecha_hasta=${cleanParamDate(filtro?.fecha_hasta)}` +
                `&id_cliente=${cleanParamNum(filtro?.id_cliente)}` +
                `&total_desde=${cleanParamNum(filtro?.total_desde)}` +
                `&total_hasta=${cleanParamNum(filtro?.total_hasta)}`
    ;

    return this.api.getHttp<VentaDAO[]>(url);
  }

  public getDetallesVenta(filtro: FiltroDetalleVenta) {
    const url = `${this.seccion}/detalles?`+
                `id_venta=${cleanParamNum(filtro?.id_venta)}` +
                `&activo=${cleanParamBool(filtro?.activo)}`
    ;

    return this.api.getHttp<DetalleVentaDAO[]>(url);
  }

  public setVenta(venta: VentaDTO){
    const url = `${this.seccion}/nueva-venta?`;

    idUserModificacionToObject(venta);

    if(venta.detalles_venta){
        venta.detalles_venta.forEach(detalle=> {
            idUserModificacionToObject(detalle);

            if(detalle.aplica_desc == undefined){
                detalle.aplica_desc = false;
            }
        })
    }

    return this.api.postHttp<Ejecucion>(url, venta);
  }

  

  
}
