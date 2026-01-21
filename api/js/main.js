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