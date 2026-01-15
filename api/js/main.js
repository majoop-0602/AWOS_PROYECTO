function buscarProductos() {
    $.get("servicio.php?productos", function (productos) {
        $("#tbodyProductos").html("")
    
        for (let x in productos) {
            const producto = productos[x]
    
            $("#tbodyProductos").append(`<tr>
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.nombreCategoria}</td>
                <td>${producto.precio}</td>
                <td>${producto.existencias}</td>
                <td>
                    <button class="btn btn-info btn-editar mb-1 me-1" data-id="${producto.id}">Editar</button>
                    <button class="btn btn-danger btn-eliminar" data-id="${producto.id}">Eliminar</button>
                </td>
            </tr>`)
        }
    })
}

buscarProductos()

$.get("servicio.php?categoriasCombo", function (categorias) {
    $("#cboCategoria").html("")

    for (let x in categorias) {
        const categoria = categorias[x]

        $("#cboCategoria").append(`<option value="${categoria.value}">
            ${categoria.label}
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
        $("#txtNombre").val(producto.nombre)
        $("#cboCategoria").val(producto.categoria)
        $("#txtPrecio").val(producto.precio)
        $("#txtExistencias").val(producto.existencias)
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
