import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  private datosMenuSource = new BehaviorSubject<any>({});
  datosMenuActual = this.datosMenuSource.asObservable();

  constructor() {}

  actualizarDatos(datosMenu: any) {
    this.datosMenuSource.next(datosMenu);
  }
}