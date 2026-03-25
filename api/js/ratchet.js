function agregarMensaje(data) {
    const mensaje = JSON.parse(data)

    $(".div-chat").append(`
        <div class="mensaje propio" 
            style="background: ${mensaje.colorFondo}; color: ${mensaje.colorTexto};">
            <strong>${mensaje.usuario ? mensaje.usuario + ": " : ""}</strong>
            ${mensaje.mensaje}
        </div>
    `)

    $(".div-chat").scrollTop($(".div-chat")[0].scrollHeight);
}
// Then some JavaScript in the browser:
const conn = new WebSocket("ws://localhost:8080/chat")
conn.onmessage = function (e) {
    const data = e.data
    console.log(data)
    agregarMensaje(data)
}
conn.onopen = function (e) {
    conn.send(JSON.stringify({
        colorFondo: "yellow",
        colorTexto: "black",
        usuario: "",
        mensaje: "Alguien se unió al chat."
    }))
}

$("#frmMensaje").submit(function (event) {
    event.preventDefault()
    const mensaje = {
        colorFondo: $("#colBg").val(),
        colorTexto: $("#colTexto").val(),
        usuario: $("#txtUsuario").val(),
        mensaje: $("#txtMensaje").val()
    }
    const data = JSON.stringify(mensaje)
    conn.send(data)
    agregarMensaje(data)
    $("#txtMensaje").val("")
})