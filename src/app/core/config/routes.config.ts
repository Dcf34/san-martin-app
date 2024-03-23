export const rutasAplicativo = {
    login: '/login',
    inicio: '/inicio',
    usuarios: {
        inicio: '/inicio/usuarios',
        alta: '/inicio/usuarios/alta',
        edicion: '/inicio/usuarios/edicion',
        permisos: '/inicio/usuarios/permisos'
    },
    clientes: {
        inicio: '/inicio/clientes',
        alta: '/inicio/clientes/alta',
        edicion: '/inicio/clientes/edicion',
    },
    comidas: {
        inicio: '/inicio/comidas',
        alta: '/inicio/comidas/alta',
        edicion: '/inicio/comidas/edicion',
    },
    configuracion: {
        inicio: '/inicio/configuracion'
    },
    ventas: {
        inicio: '/inicio/ventas',
        nueva_venta: '/inicio/ventas/nueva-venta',
        historial_ventas: {
            inicio: '/inicio/ventas/historial',
            detalle: '/inicio/ventas/historial/detalle'
        }
    },
    reportes: {
        inicio: '/inicio/reportes',
        ventas: '/inicio/reportes/ventas',
        ventaDetalle: '/inicio/reportes/ventas-detalle',
        clientes: '/inicio/reportes/clientes',
        comidas: '/inicio/reportes/comidas',
        pedidos: '/inicio/reportes/pedidos'
    },
    pedidos: {
        inicio: '/inicio/pedidos'
    }
}