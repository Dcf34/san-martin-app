import { commonColumns, localStorageKeys } from "src/app/core/config/sesion.config";

export function userToObject(object:any) {

    if(object) {      
      let id = localStorage.getItem(localStorageKeys.id_usuario);
      if(id)
      object[commonColumns.id_usuario_modificacion] = id; //await this.getUsername();
    }
}

export function idUserCreacionToObject(object:any) {

  if(object) {      
    let id = localStorage.getItem(localStorageKeys.id_usuario);
    if(id){
      const idMod = parseInt(id);
      object[commonColumns.id_usuario_creacion] = idMod; //await this.getUsername();
    }
  }
}

export function idUserModificacionToObject(object:any) {

  if(object) {      
    let id = localStorage.getItem(localStorageKeys.id_usuario);
    if(id){
      const idMod = parseInt(id);
      object[commonColumns.id_usuario_modificacion] = idMod; //await this.getUsername();
    }
  }
}
export function usuarioToObject(object:any) {

  if(object) {      
    let user = localStorage.getItem(localStorageKeys.usuario);
    if(user)
    object[commonColumns.usuario] = user; //await this.getUsername();
  }
}

export function userIdToObject(object:any) {

  if(object) {      
    let id = localStorage.getItem(localStorageKeys.id_usuario);
    if(id) {
      object[commonColumns.id_usuario] = parseInt(id); //await this.getUsername();
    }
    
  }
}

export function userToForm(form:FormData) {
    if(form) {
      form.append(commonColumns.usuario_modificacion, `${localStorage.getItem(localStorageKeys.usuario)}`);
    }
  }

  export function asignDates(object:any){
    if(object) {      
      let newDate = new Date;
      if(newDate){
        object[commonColumns.fecha_creacion] = newDate;
        object[commonColumns.fecha_modificacion] = newDate;

      }
    }
  }

export function userToList(list:any[] = []) {
    if(list && list.length > 0){
      list.forEach(
        (object) => { userToObject(object); }
      );
    }
}