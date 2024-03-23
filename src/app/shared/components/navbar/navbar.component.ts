import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { rutasAplicativo } from 'src/app/core/config';
import { AuthService } from '../../../modulos/login/services/auth.service';
import { NavbarService } from 'src/app/shared/services/navbar.items.service';
import { DialogService } from 'primeng/dynamicdialog';
import { EditPerfilComponent } from './modal-edit-perfil/modal-edit-perfil.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
    itemsBreadCrumb: MenuItem[] = [];
    home: MenuItem = {};
    mostrarBtnUser: boolean = true;
    mostrarBtnMenu: boolean = true;

  constructor(
    private router:Router,
    private authService:AuthService,
    private datosMenuService: NavbarService,
    private dialogService: DialogService
  ) {
    this.checkScreenWidth();
  }
    
  visibleSidebar: boolean = false;
  
  ngOnInit(): void {
    this.datosMenuService.datosMenuActual.subscribe(
      datosMenu => {
        this.itemsBreadCrumb = datosMenu.itemsBreadCrumb || [];
        this.home = datosMenu.home || {};
        //this.mostrarEnConsola();
      }
    );

    window.addEventListener('resize', this.checkScreenWidth.bind(this));
    this.checkScreenWidth();

  }
  mostrarDropdown: boolean = false;

  mostrarBtnClose(){
    if(this.mostrarDropdown == true){
      this.mostrarDropdown = false;
    }else{
      this.mostrarDropdown = true;
    }
  }

  checkScreenWidth() {
    this.mostrarBtnUser = window.innerWidth >= 1000;
    this.mostrarBtnMenu = window.innerWidth < 1000;

    if(window.innerWidth >= 1000 && this.visibleSidebar == true){
      this.visibleSidebar = false;
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

  cargando: boolean = false;

  abrirModulo(modulo:string)
  {
    let ruta = '';
    
    if(modulo == 'usuarios') {
      ruta = rutasAplicativo.usuarios.inicio;
    }
    else if(modulo == 'clientes') {
      ruta = rutasAplicativo.clientes.inicio;
    }
    else if(modulo == 'comidas') {
      ruta = rutasAplicativo.comidas.inicio;
    }
    else if(modulo == 'configuracion') {
      ruta = rutasAplicativo.configuracion.inicio;
    }
    else if(modulo == 'ventas') {
      ruta = rutasAplicativo.ventas.inicio;
    }
    else if(modulo == 'pedidos') {
      ruta = rutasAplicativo.pedidos.inicio;
    }
    else if(modulo == 'reportes') {
      ruta = rutasAplicativo.reportes.inicio;
    }

    this.router.navigateByUrl(ruta);
  }

  cerrarSesion(){
    this.authService.limpiarSesion();
  }
  
  abrirModalPerfil(){
    const ref = this.dialogService.open(EditPerfilComponent, {
      header: 'Editar Perfil',
      width: '40%',
      data: {
      }
    });

    ref.onClose.subscribe((value: boolean) => {
      // Aquí puedes manejar la descripción que se recibe al cerrar el diálogo
      if(value == true){
        location.reload();
      }
      
    });
}


}