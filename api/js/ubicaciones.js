const API = "https://archive-drinking-wear-specialties.trycloudflare.com/AWOS_PROYECTO/Github/AWOS_PROYECTO/api"


function buscarDirecciones() {
    $.get(`${API}/servicio.php?buscarUbicaciones`, function (direcciones) {
        $("#tbodyDirecciones").html("")

        for (let x in direcciones) {
            const d = direcciones[x]

            $("#tbodyDirecciones").append(`
            <tr>
                <td>${d.id_direccion}</td>
                <td>${d.usuario}</td>
                <td>${d.calle}</td>
                <td>${d.ciudad}</td>
                <td>${d.estado}</td>
                <td>${d.codigo_postal}</td>
                <td>${d.descripcion}</td>
                <td>${d.latitud}</td>
                <td>${d.longitud}</td>
                <td>
                    <button class="btn btn-info btn-editar" data-id="${d.id_direccion}">
                        Modificar
                    </button>
                </td>
            </tr>`)
        }
    })
}

buscarDirecciones()

$.get(`${API}/servicio.php?usuarioCombo`, function (usuarios) {
    $("#cboUsuario").html(`
    <option value="" disabled selected hidden></option>
`)

    for (let x in usuarios) {
        const usuario = usuarios[x]

        $("#cboUsuario").append(`
            <option value="${usuario.value}">
                ${usuario.label}
            </option>
        `)
    }
})
$("#frmDirecciones").submit(function (event) {
    event.preventDefault()

    if ($("#txtid").val()) {
        $.post(`${API}/servicio.php?modificarDireccion`, $(this).serialize(), function (respuesta) {
            if (respuesta == "correcto") {
                alert("Direccion modificado correctamente")
                 window.location.href = "index.html"
            }
        })
        return
    }

    $.post(`${API}/servicio.php?agregarUbicacion`, $(this).serialize(), function (respuesta) {
        if (respuesta != "0") {
            alert("Direccion agregado correctamente")
            window.location.href = "index.html"
        }
    })
})

$(document).on("click", ".btn-editar", function (event) {
    const id = $(this).data("id")

    $.get(`${API}/servicio.php?editarDireccion`, {
        id: id
    }, function (direcciones) {
        const dire = direcciones[0]

        $("#txtid").val(dire.id_direccion)
        $("#cboUsuario").val(dire.id_usuario)
        $("#txtCalle").val(dire.calle)
        $("#txtCiudad").val(dire.ciudad)
        $("#cboEstado").val(dire.estado)
        $("#txtCodigoPostal").val(dire.codigo_postal)
        $("#txtDescripcion").val(dire.descripcion)
        $("#txtLatitud").val(dire.latitud)
        $("#txtLongitud").val(dire.longitud)
    })
})

//generarMapa(longitud, latitud)

 function generarMapa(longitud, latitud) {
                $("#divMapa iframe").remove() 
                $("#divMapa").append(`
                    <iframe 
                        width="100%" 
                        height="250" 
                        style="border:0;" 
                        loading="lazy" 
                        allowfullscreen 
                        src="https://maps.google.com/maps?q=${latitud},${longitud}&z=15&output=embed">
                    </iframe>
                `)
            }


              const options = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }

            function success(pos) {
                const crd = pos.coords
                generarMapa(crd.longitude, crd.latitude)
            }

            function error(err) {
                console.warn(`ERROR(${err.code}): ${err.message}`)
            }

generarMapa(longitud, latitud)
