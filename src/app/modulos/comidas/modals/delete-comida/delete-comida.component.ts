import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ComidasService } from '../../services/comidas.service';
import { Comida } from '../../models/comidas.models';

@Component({
  selector: 'app-delete-comida',
  templateUrl: './delete-comida.component.html',
  styleUrls: ['./delete-comida.component.scss']
})
export class DeleteComidaComponent implements OnInit{

  unsubscribe$: Subject<boolean> = new Subject<boolean>();
  cargando: boolean = false;

  comida: Comida = {};

  constructor(
    private comidasService: ComidasService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.comida = this.config.data.comida;

    this.modificarHeader();
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
      textElement.innerText = 'Eliminar Comida';

      // Agregar el icono y el texto al div
      newDiv.appendChild(iconElement);
      newDiv.appendChild(textElement);

      // Agregar el nuevo contenido al inicio del encabezado del diálogo
      dialogHeader.insertBefore(newDiv, dialogHeader.firstChild);
    }
  }

  async setComida(comida: Comida, value: boolean){
    this.cargando = true;

    comida.activo = false;

    this.comidasService
    .setComida(comida)
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

  async eliminarComida(value: boolean){
    const comida = this.comida;

    comida.activo = false;

    if(comida){
      await this.setComida(comida, value);
    }
    else{
      this.cerrar(value);
    }
  }

  cerrar(value: boolean) { 
    this.ref.close(value); 
  }

  

}