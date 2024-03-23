import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { localStorageKeys } from 'src/app/core/config';
import { FiltroUsuario, UsuarioDto, UsuarioPerfil } from 'src/app/modulos/usuarios/models/usuario.models';
import { UsuariosService } from 'src/app/modulos/usuarios/services/usuarios.service';


@Component({
  selector: 'app-edit-pefil',
  templateUrl: './modal-edit-perfil.component.html',
  styleUrls: ['./modal-edit-perfil.component.scss']
})
export class EditPerfilComponent implements OnInit{

  unsubscribe$: Subject<boolean> = new Subject<boolean>();
  cargando: boolean = false;

  usuario: UsuarioPerfil = {};

  constructor(
    private usuariosService: UsuariosService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef
  ) {}

  async ngOnInit(): Promise<void> {
    const idUsuarioString = localStorage.getItem(localStorageKeys.id_usuario);
    let idUsuario = 0;

    if(idUsuarioString){
      idUsuario = parseInt(idUsuarioString);
    }

    await this.getPerfilUsuarios(idUsuario);

    this.modificarHeader();
  }

  async getPerfilUsuarios(id_usuario: number) {
    if (id_usuario > 0) { // Asegúrate de que el id_usuario es válido
      this.cargando = true;
      this.usuariosService.getPerfilUsuarios(id_usuario)
        .subscribe({
          next: (data) => {
            this.usuario = data;
            this.cargando = false;
          },
          error: (error) => {
            console.error('Error al obtener perfil de usuario:', error);
            this.cargando = false;
          }
        });
    } else {
      console.error('ID de usuario no proporcionado o inválido');
    }
  }

  async actualizarDatos(value: boolean){
    this.cargando = true;

    const usuario: UsuarioPerfil = this.usuario;

    this.usuariosService
    .actualizarPerfilUsuario(usuario)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (ejecucion) => {
        if (ejecucion.exitoso) {
            this.cargando = false;
        }

        this.cerrar(value);
      },
      error: (error) => {
        this.cargando = false;
      }
    });
  }

  modificarHeader(){
    const dialogHeader = document.querySelector('.p-dialog-header') as HTMLElement;
    if (dialogHeader) {
      dialogHeader.classList.add('encabezado-busqueda');

      // Eliminar completamente el elemento del texto
      const dialogHeaderText = document.querySelector('.p-dialog-title') as HTMLElement;
      if (dialogHeaderText) {
        dialogHeaderText.remove();
      }

      // Mover el botón al lado derecho
      const closeButton = document.querySelector('.p-dialog-header-icon') as HTMLElement;
      if (closeButton) {
        closeButton.classList.add('moved-right'); // Agrega una clase para el botón
        dialogHeader.appendChild(closeButton); // Mueve el botón al final del encabezado
      }

      // Crear un div para el nuevo contenido (icono y texto)
      const newDiv = document.createElement('div');
      newDiv.className = 'custom-header-content'; // Clase para el nuevo div

      // Crear el icono de PrimeNG y el texto
      const iconElement = document.createElement('i');
      iconElement.className = 'pi pi-trash'; // Clase para el icono de búsqueda

      const textElement = document.createElement('span');
      textElement.innerText = 'Editar Usuario';

      // Agregar el icono y el texto al div
      newDiv.appendChild(iconElement);
      newDiv.appendChild(textElement);

      // Agregar el nuevo contenido al inicio del encabezado del diálogo
      dialogHeader.insertBefore(newDiv, dialogHeader.firstChild);
    }
  }

  cerrar(value: boolean) { 
    this.ref.close(value); 
  }

}