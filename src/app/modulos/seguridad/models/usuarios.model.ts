export interface Usuario {
    Id_Usuario:              number;
    Activo:                  number;
    Id_Usuario_Modificacion:    number;
    Fecha_Modificacion?:        Date;
    Id_Usuario_Creacion?:                 number;
    Fecha_Creacion?:             Date;
    Cuenta_Usuario?: string;
    Nombre?: string;
    Correo?: string;
    Telefono?: string;
}
