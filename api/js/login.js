const API = "https://accepting-johns-diffs-mod.trycloudflare.com/AWOS_PROYECTO/Github/AWOS_PROYECTO/api"

$.ajaxSetup({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`
    }
})

const modalErrorLogin = new bootstrap.Modal("#exampleModal",{
    keyboard: false
})

$.get(`${API}/servicioInicioSesion.php?sesion`, function(sesion){
        if (sesion.length){
             
            return
        }


})


$("#frmlogin").submit(function (event) {
    event.preventDefault()

    $.post(`${API}/servicioInicioSesion.php?iniciarSesion`, $(this).serialize(), function (respuesta) {
        if (respuesta == "error") {
            modalErrorLogin.show()
            return
        }

        localStorage.setItem("jwt", respuesta)

        // decodificar JWT
        const payload = JSON.parse(atob(respuesta.split('.')[1]))
        const tipo = payload.sub.split("/")[2]

        localStorage.setItem("tipo", tipo)

        $.ajaxSetup({
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        })

      

        $.get(`${API}/servicioInicioSesion.php?sesion`, function (sesion) {

            const rol = parseInt(sesion[2])

           

            if (rol === 1) {
                window.location = "index_admin.html"
            } else if (rol === 2) {
                window.location = "productitos.html"
            }

        })
    })
})