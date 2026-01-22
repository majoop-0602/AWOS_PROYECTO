///////PAGOS
function buscarPagos(){
    $.get("servicio.php?pagos", function (pagos){
    $("#tbodyPagos").html("")

    for(let x in pagos){
        const pago = pagos[x]

        $("#tbodyPagos").append(` 
                 <tr>
                    <td>${pago.id_pago}</td>
                    <td>${pago.pedido}</td>
                    <td>${pago.productonombre}</td>
                    <td>${pago.monto}</td>
                    <td>${pago.estado_pago}</td>
                    <td>${pago.fecha_pago}</td>
                    <td>${pago.year}</td>
                    <td>${pago.mes}</td>
                    <td>${pago.day}</td>
                    <td>${pago.referencia_paypal}</td>
                </tr>
            `)   
    }
    })
}

function cargarPedidos(){
    $.get("servicio.php?obt_id_pedido", function (cargaID){
    $("#tbodyObtID").html("")

    for(let x in cargaID){
        const carga= cargaID[x]

        $("#tbodyObtID").append(` 
                 <tr>
                    <td>${carga.id_pedido}</td>
                    <td>${carga.nombre}</td>
                    <td>${carga.total}</td>
                    <td>
                         <button class="btn btn-info btn-pagar mb-1 me-1" data-id="${carga.id_pedido}">Pagar</button>
                    </td>
                    
                </tr>
            `)   
    }
    })

}




cargarPedidos()
buscarPagos()


$("#frmPagos").submit(function (event) {
    event.preventDefault();

    $.post("servicio.php?agre_pagos", $(this).serialize(),function (respuesta) {
        if (respuesta != "0") {
            alert("Pago registrado correctamente.")
            $("#frmPagos").get(0).reset()
            buscarPagos()
        }
    })
    return
})

$(document).on("click", ".btn-pagar", function (event) {
    const id = ($(this).data("id"))

    $("#txtid_pedido").val(id);
})

///////////PEDIDOS

function buscarPedidos() {
    $.get("servicio.php?pedidos", function (pedidos) {
        $("#tbodyPedidos").html("")

        for (let x in pedidos) {
            const p = pedidos[x]

            $("#tbodyPedidos").append(`
            <tr>
                <td>${p.id_pedido}</td>
                <td>${p.id_comprador}</td>
                <td>${p.fecha_pedido}</td>
                <td>${p.total}</td>
                <td>${p.estado}</td>
                <td>
                    <button class="btn btn-info btn-editar" data-id="${p.id_pedido}">
                        Modificar
                    </button>
                </td>
            </tr>`)
        }
    })
}

buscarPedidos()

$.get("servicio.php?pedidosCombo", function (compradores) {
    $("#cboComprador").html("")

    for (let x in compradores) {
        const comprador = compradores[x]

        $("#cboComprador").append(`<option value="${comprador.value}">
            ${comprador.label}
        </option>`)
    }
})


$("#frmPedido").submit(function (e) {
    e.preventDefault()

    $.post("servicio.php?modificarPedido", $(this).serialize(), function (r) {
        if (r == "correcto") {
            alert("Pedido modificado correctamente")
            $("#frmPedido").get(0).reset()
            buscarPedidos()
        }
    })
})

$(document).on("click", ".btn-editar", function () {
    const id = $(this).data("id")

    $.get("servicio.php?editarPedido", { id }, function (pedido) {
        const p = pedido[0]

        $("#txtId").val(p.id_pedido)
        $("#cboComprador").val(p.id_comprador)
        $("#txtTotal").val(p.total)
        $("#cboEstado").val(p.estado)
    })
})

///////////PRODUCTOS
function buscarProductos() {
    $.get("servicio.php?productos", function (productos) {
        $("#tbodyProductos").html("")
    
        for (let x in productos) {
            const producto = productos[x]
    
            $("#tbodyProductos").append(`<tr>
                <td>${producto.id}</td>
                <td>${producto.titulo}</td>
                <td>${producto.descripcion}</td>
                <td>${producto.precio}</td>
                <td>${producto.talla}</td>
                <td>${producto.estado}</td>
                <td>${producto.id_categoria}</td>
                <td>${producto.id_vendedor}</td>
                <td>${producto.disponible}</td>
                <td>
                    <button class="btn btn-danger btn-eliminar" data-id="${producto.id}">Eliminar</button>
                </td>
            </tr>`)
        }
    })
}

buscarProductos()

$.get("servicio.php?categoriasCombo", function (categorias) {
    $("#cboIdCat").html("")

    for (let x in categorias) {
        const categoria = categorias[x]

        $("#cboIdCat").append(`<option value="${categoria.value}">
            ${categoria.label}
        </option>`)
    }
})
$.get("servicio.php?vendedorCombo", function (vendedores) {
    $("#cboIdVendedor").html("")

    for (let x in vendedores) {
        const vendedor = vendedores[x]

        $("#cboIdVendedor").append(`<option value="${vendedor.value}">
            ${vendedor.label}
        </option>`)
    }
})

$("#frmProducto").submit(function (event) {
    event.preventDefault()

    if ($("#txtId").val()) {
        $.post("servicio.php?modificarProducto", $(this).serialize(), function (respuesta) {
            if (respuesta == "correcto") {
                alert("Producto modificado correctamente")
                $("#frmProducto").get(0).reset()
                buscarProductos()
            }
        })
        return
    }

    $.post("servicio.php?agregarProducto", $(this).serialize(), function (respuesta) {
        if (respuesta != "0") {
            alert("Producto agregado correctamente")
            $("#frmProducto").get(0).reset()
            buscarProductos()
        }
    })
})

$(document).on("click", ".btn-editar", function (event) {
    const id = $(this).data("id")

    $.get("servicio.php?editarProducto", {
        id: id
    }, function (productos) {
        const producto = productos[0]

        $("#txtId").val(producto.id)
        $("#txtTitulo").val(producto.titulo)
        $("#txtDescripcion").val(producto.descripcion)
        $("#txtPrecio").val(producto.precio)
        $("#txtTalla").val(producto.talla)
        $("#txtEstado").val(producto.estado)
        $("#txtIdCat").val(producto.id_categoria)
        $("#txtIdVendedor").val(producto.id_vendedor)
        $("#txtDisponible").val(producto.disponible)
    })
})

$(document).on("click", ".btn-eliminar", function (event) {
    const id = $(this).data("id")

    if (!confirm("Deseas eliminar este producto?")) {
        return
    }

    $.post("servicio.php?eliminarProducto", {
        txtId: id
    }, function (respuesta) {
        if (respuesta == "correcto") {
            alert("Producto eliminado correctamente")
            buscarProductos()
        }
    })
})


///////////DETALLE_PEDIDO
function buscardetalle_pedido() {
    $.get("servicio.php?detalle_pedido", function (detalles){
    $("#tbodyDetalle").html("")

    for(let x in detalles){
        const detalle = detalles[x]

        $("#tbodyDetalle").append(` 
                 <tr>
                    <td>${detalle.id_detalle}</td>
                    <td>${detalle.id_pedido}</td>
                    <td>${detalle.id_producto}</td>
                    <td>${detalle.productonombre}</td>
                    <td>${detalle.cantidad}</td>
                    <td>${detalle.precio_unitario}</td>
                 <td>
                    <button class="btn btn-info btn-editar" data-id="${detalle.id_detalle}">
                        Modificar
                    </button>
                </td>
            </tr>
            `)   
    }
    })

}
buscardetalle_pedido()
$.get("servicio.php?PeCombo", function (pediditos) {
    $("#cboPedido").html("")

    for (let x in pediditos) {
        const pedidito = pediditos[x]

        $("#cboPedido").append(`<option value="${pedidito.value}">
            ${pedidito.label}
        </option>`)
    }
})
$.get("servicio.php?ProCombo", function (productitos) {
    $("#cboProducto").html("")

    for (let x in productitos) {
        const productito = productitos[x]

        $("#cboProducto").append(`<option value="${productito.value}">
            ${productito.label}
        </option>`)
    }
})
$("#frmDetalle").submit(function (event) {
    event.preventDefault()

    if ($("#txtid_detalle").val()) {
        $.post("servicio.php?modificardetalle_pedido", $(this).serialize(), function (respuesta) {
            if (respuesta == "correcto") {
                alert("Producto modificado correctamente")
                $("#frmDetalle").get(0).reset()
                buscardetalle_pedido()
            }
        })
        return
    }

    $.post("servicio.php?agregardetalle_pedido", $(this).serialize(), function (respuesta) {
        if (respuesta != "0") {
            alert("Producto agregado correctamente")
            $("#frmDetalle").get(0).reset()
            buscardetalle_pedido()
        }
    })
})
$(document).on("click", ".btn-editar", function () {
    const id = $(this).data("id")

    $.get("servicio.php?editardetalle_pedido", { id }, function (detallito) {
        const de = detallito[0]

        $("#txtid_detalle").val(de.id_detalle)
        $("#cboPedido").val(de.id_pedido)
        $("#cboProducto").val(de.id_producto)
        $("#txtcantidad").val(de.cantidad)
        $("#txtprecio_unitario").val(de.precio_unitario)
    })
})

