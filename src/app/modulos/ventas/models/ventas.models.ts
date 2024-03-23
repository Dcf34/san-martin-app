export interface VentaDAO {
    id_venta?: number;
    activo?: boolean;
    fecha_modificacion?: Date;
    id_usuario_modificacion?: number;
    fecha_creacion?: Date;
    id_usuario_creacion?: number;
    id_cliente?: number;
    codigo_venta?: string;
    fecha_venta?: Date;
    total?: number;
  }
  
  export interface VentaDTO {
    activo?: boolean;
    id_usuario_modificacion?: number;
    id_cliente?: number;
    fecha_venta?: Date;
    total?: number;
    codigo_venta?: string;
    detalles_venta?: DetalleVentaDTO[];
  }
  
  export interface DetalleVentaDAO {
    id_detalle_venta?: number;
    activo?: boolean;
    fecha_modificacion?: Date;
    id_usuario_modificacion?: number;
    fecha_creacion?: Date;
    id_usuario_creacion?: number;
    id_venta?: number;
    id_comida?: number;
    descripcion?: string;
    precio?: number;
    cantidad?: number;
    aplica_desc?: boolean;
    descuento?: number;
    subtotal?: number;
    orden?: number;
  }
  
  export interface DetalleVentaDTO {
    activo?: boolean;
    id_usuario_modificacion?: number;
    id_venta?: number;
    id_comida?: number;
    descripcion?: string;
    precio?: number;
    cantidad?: number;
    aplica_desc?: boolean;
    descuento?: number;
    subtotal?: number;
  }
  
  export interface FiltroVentas {
    id_venta?: number;
    activo?: boolean;
    fecha_desde?: Date;
    fecha_hasta?: Date;
    id_cliente?: number;
    total_desde?: number;
    total_hasta?: number;
  }
  
  export interface FiltroDetalleVenta {
    id_venta?: number;
    activo?: boolean;
  }