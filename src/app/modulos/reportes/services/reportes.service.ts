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
import { asignDates, idUserCreacionToObject, idUserModificacionToObject, 
userIdToObject, userToForm, userToObject, usuarioToObject } from 'src/app/shared/models/functions/user-modification.function';
import { FiltroVentas } from '../../ventas/models/ventas.models';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  seccion = '/reportes';
  rutasInicio = rutasAplicativo.inicio;
  jwt:JwtHelperService = new JwtHelperService();

  unsubscribe$: Subject<boolean> = new Subject<boolean>();
  
  constructor(
    private api:ApiService,
    private router:Router,
    private mensajesService:MensajesService
  ) { }

  
  public downloadReporteVentas(filtros: FiltroVentas){
    const url = `${this.seccion}/ventas?`+
                `id_venta=${cleanParamNum(filtros?.id_venta)}` +
                `&activo=${cleanParamBool(filtros?.activo)}` +
                `&fecha_desde=${cleanParamDate(filtros?.fecha_desde)}` +
                `&fecha_hasta=${cleanParamDate(filtros?.fecha_hasta)}` +
                `&id_cliente=${cleanParamNum(filtros?.id_cliente)}` +
                `&total_desde=${cleanParamNum(filtros?.total_desde)}` +
                `&total_hasta=${cleanParamNum(filtros?.total_hasta)}` 
    ;
    
    return this.api.getHttpBlob(url);
  }

}
