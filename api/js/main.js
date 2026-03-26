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
                    <td>${pago.YEAR}</td>
                    <td>${pago.MONTH}</td>
                    <td>${pago.DAY}</td>
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
        if (Object.keys(respuesta).length) {
            alert(`Pago del pedido ${respuesta["@NUEVOid_pedido"]} fue agregado correctamente`)
            $("#frmPagos").get(0).reset()
            buscarPagos()



            conn.send("buscar-pagos")
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
                <td>${p.nombre_comprador}</td>
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
/* FALTAR CAMBIAR EL SERVICIO Y LOS DATOS
  function cargarPedidosUsuario(){
    $.get("servicio.php?", function (pedidop){
        $("#container-pedidos").html("")

        for(let x in pedidop){
            const pedido = pedidop[x]

            $("#container-pedidos").append(`
                <div class="col-md-4 mb-4">
                    <div class="producto-card">
                            <img src="${producto.imagen}" alt="${producto.titulo}" class="producto-img">

                            <div class="producto-body">
                                <div class="producto-nombre">${producto.titulo}</div>
                                <div class="producto-talla">Talla: ${producto.talla}</div>
                                <div class="producto-precio">$${producto.precio}</div>

                                <div class="botones">
                                    <button class="btn btn-pedir" onclick="window.location.href='pago.html'">Pagar</button>
                                </div>

                            </div>
                    </div>
                </div>
            `)
        }
    })
}
cargarPedidosUsuario()
*/

buscarPedidos()

$.get("servicio.php?pedidosCombo", function (compradores) {
    $("#cboComprador").html(`
    <option value="" disabled selected hidden></option>
`)

    for (let x in compradores) {
        const comprador = compradores[x]

        $("#cboComprador").append(`<option value="${comprador.value}">
            ${comprador.label}
        </option>`)
    }
})


$("#frmPedido").submit(function (e) {
    e.preventDefault()

    if ($("#txtId").val()){
        $.post("servicio.php?modificarPedido", $(this).serialize(), function (respuesta){
            if(respuesta == "correcto"){
                alert("Pedido modificado correctamente")
                $("#frmPedido").get(0).reset()
                buscarPedidos()

            }
        })
        return
    }
    $.post("servicio.php?agreg_pedido", $(this).serialize(), function (respuesta){
        if (Object.keys(respuesta).length){
            alert(`Pedido ${respuesta["@NUEVOid_pedido"]} fue agregado correctamente`)
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
                <td>
                    <img src="${producto.imagen}" class="img-tabla">
                </td>
                <td>${producto.talla}</td>
                <td>${producto.estado}</td>
                <td>${producto.id_categoria}</td>
                <td>${producto.id_vendedor}</td>
                <td>${producto.disponible}</td>
                <td>
                    <button class="btn btn-danger btn-eliminar-producto" data-id="${producto.id}">Eliminar</button>
                </td>
            </tr>`)
        }
    })
}

function cargarProductos(){
    $.get("servicio.php?productos", function (productos){
        $("#container-productos").html("")

        for(let x in productos){
            const producto = productos[x]

            $("#container-productos").append(`
                <div class="col-md-4 mb-4">
                    <div class="producto-card">
                            <img src="${producto.imagen}" alt="${producto.titulo}" class="producto-img">

                            <div class="producto-body">
                                <div class="producto-nombre">${producto.titulo}</div>
                                <div class="producto-talla">Talla: ${producto.talla}</div>
                                <div class="producto-precio">$${producto.precio}</div>

                                <div class="botones">
                                    <button class="btn btn-pedir" onclick="window.location.href='pedido.html'">Pedir</button>
                                    <button class="btn btn-chat" onclick="window.location.href='ratchet.html'">Chat</button>
                                </div>

                            </div>
                    </div>
                </div>
            `)
        }
    })
}
cargarProductos()
buscarProductos()

$.get("servicio.php?categoriasCombo", function (categorias) {
    $("#cboIdCat").html(`
    <option value="" disabled selected hidden></option>
`)

    for (let x in categorias) {
        const categoria = categorias[x]

        $("#cboIdCat").append(`<option value="${categoria.value}">
            ${categoria.label}
        </option>`)
    }
})
$.get("servicio.php?vendedorCombo", function (vendedores) {
    $("#cboIdVendedor").html(`
    <option value="" disabled selected hidden></option>
`)

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
        const formData = new FormData(this);

                $.ajax({
            url: "servicio.php?agregarProducto",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            dataType: "json", // 👈 IMPORTANTE
            success: function(respuesta){
                if (respuesta["@NUEVOtitulo"]) {
                    alert(`El producto ${respuesta["@NUEVOtitulo"]} fue agregado correctamente`)
                    $("#frmProducto").get(0).reset()
                    buscarProductos()
                    conn.send("buscar-productos")
                }
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

$(document).on("click", ".btn-eliminar-producto", function (event) {
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
            conn.send("buscar-productos")
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
                    <button class="btn btn-danger btn-eliminar-detalle" data-id="${detalle.id_detalle}">
                        Eliminar
                    </button>

                </td>
            </tr>
            `)   
    }
    })

}
buscardetalle_pedido()
$.get("servicio.php?PeCombo", function (pediditos) {
    $("#cboPedido").html(`
    <option value="" disabled selected hidden></option>
`)

    for (let x in pediditos) {
        const pedidito = pediditos[x]

        $("#cboPedido").append(`<option value="${pedidito.value}">
            ${pedidito.label}
        </option>`)
    }
})
$.get("servicio.php?ProCombo", function (productitos) {
    $("#cboProducto").html(`
    <option value="" disabled selected hidden></option>
`)

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
                alert("Detalle modificado correctamente")
                $("#frmDetalle").get(0).reset()
                buscardetalle_pedido()
            }
        })
        return
    }

    $.post("servicio.php?agregardetalle_pedido", $(this).serialize(), function (respuesta) {
        if (Object.keys(respuesta).length) {
           alert(`Detalle pedido ${respuesta["@NUEVOid_detalle"]} del pedido ${respuesta["@NUEVOid_pedido"]} fue agregado correctamente`)
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
$(document).on("click", ".btn-eliminar-detalle", function (event) {
    const id = $(this).data("id")

    if (!confirm("Deseas eliminar este detalle?")) {
        return
    }

    $.post("servicio.php?eliminardetalle_pedido", {
        txtid_detalle: id
    }, function (respuesta) {
        if (respuesta == "correcto") {
            alert("Detalle eliminado correctamente")
            buscardetalle_pedido()
        }
    })
})

/////////USUARIOS
function buscarUsuarios() {
    $.get("servicio.php?usuarios", function (usuarios) {
        $("#tbodyUsuarios").html("")
    
        for (let x in usuarios) {
            const usuario = usuarios[x]
    
            $("#tbodyUsuarios").append(`<tr>
                <td>${usuario.id_usuario}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.email}</td>
                <td>${usuario.telefono}</td>
                <td>${usuario.contrasena}</td>
                <td>${usuario.fecha_registro}</td>
                <td>    
                    <button class="btn btn-info btn-editar" data-id="${usuario.id_usuario}">
                        Modificar
                    </button>          
                    <button class="btn btn-danger btn-eliminar-usuario" data-id="${usuario.id_usuario}">Eliminar</button>
                </td>
            </tr>`)
        }
    })
}

buscarUsuarios()

$("#frmUsuario").submit(function (event) {
    event.preventDefault()

    if($("#txtIdUsuario").val()){
        $.post("servicio.php?modificarusuario", $(this).serialize(),function(respuesta){
            if(respuesta =="correcto") {
                alert("Usuario modificado correctamente")
                $("#frmUsuario").get(0).reset()
                 buscarUsuarios()
            }
        })
        return
    }
    $.post("servicio.php?agregarUsuario", $(this).serialize(), function (respuesta){
        if (Object.keys(respuesta).length){
            alert(`Usuario ${respuesta["NUEVOnombre"]} fue agregado correctamente`)
            $("#frmUsuario").get(0).reset()
            buscarUsuarios()
        }
    })
})
$(document).on("click", ".btn-editar", function () {
    const id = $(this).data("id")

    $.get("servicio.php?editarusuario", { id }, function (usuario) {
        const us = usuario[0]

        $("#txtIdUsuario").val(us.id_usuario)
        $("#txtNombre").val(us.nombre)
        $("#txtEmail").val(us.email)
        $("#txtTelefono").val(us.telefono)
        $("#txtContrasena").val(us.contrasena)
    })
})


$(document).on("click", ".btn-eliminar-usuario", function (event) {
    const id = $(this).data("id")

    if (!confirm("Deseas eliminar este Usuario?")) {
        return
    }

    $.post("servicio.php?eliminarUsuario", {
        txtIdUsuario: id
    }, function (respuesta) {
        if (respuesta == "correcto") {
            alert("Usuario eliminado correctamente")
            buscarUsuarios()
        }
    })
})

const conn = new WebSocket("ws://localhost:8080/chat")
conn.onmessage = function (e) {
    const comando = e.data
    console.log(comando)
    if (comando == "buscar-pagos") {
        // Asincrono (Dentro de la APP)
        buscarPagos()

        const toastLiveExample = document.getElementById("liveToast")
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
        toastBootstrap.show()
    }else if (comando == "buscar-productos") {
        // Asincrono (Dentro de la APP)
        buscarProductos()

        const toastLiveExample = document.getElementById("liveToast")
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
        toastBootstrap.show()
}
conn.onopen = function (e) {
    conn.send("Conexión WebSocket Correcta")
}
}


