import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { rutasAplicativo } from 'src/app/core/config';
import { AuthService } from '../../../modulos/login/services/auth.service';
import { NavbarService } from 'src/app/shared/services/navbar.items.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
    itemsBreadCrumb: MenuItem[] = [];
    home: MenuItem = {};
  constructor(
    private router:Router,
    private authService:AuthService,
    private datosMenuService: NavbarService
  ) {}
    
  sidebarVisible: boolean = false;

  ngOnInit(): void {
    this.datosMenuService.datosMenuActual.subscribe(
      datosMenu => {
        this.itemsBreadCrumb = datosMenu.itemsBreadCrumb || [];
        this.home = datosMenu.home || {};
        //this.mostrarEnConsola();
      }
    );

  }
  mostrarDropdown: boolean = false;

  mostrarBtnClose(){
    if(this.mostrarDropdown == true){
      this.mostrarDropdown = false;
    }else{
      this.mostrarDropdown = true;
    }
  }

  mostrarEnConsola() {
    console.log('Items de Breadcrumb:', this.itemsBreadCrumb);
    console.log('Home:', this.home);
  }

  navegarPortal() {
    const navigateUrl = rutasAplicativo.inicio;
    this.router.navigateByUrl(navigateUrl);
  }

  abrirModulo(modulo:string)
  {
    let ruta = '';
    
    if(modulo == 'usuarios') {
      ruta = rutasAplicativo.usuarios.inicio;
    }

    this.router.navigateByUrl(ruta);
  }

  cerrarSesion(){
    this.authService.limpiarSesion();
  }
  



}