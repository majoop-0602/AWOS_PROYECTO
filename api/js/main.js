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