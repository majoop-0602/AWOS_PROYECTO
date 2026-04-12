<?php

use Symfony\Component\Routing\Requirement\Requirement;

ini_set("display_errors", 1);
ini_set("display_startup_errors", 1);
error_reporting(E_ALL & ~E_DEPRECATED);

header("Cache-Control: no-cache, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Allow: GET, POST, OPTIONS");

if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
  http_response_code(200);
  exit;
}

if (isset($_GET["PING"])) {
  exit;
}

date_default_timezone_set("America/Matamoros");

if (isset($_GET["DATETIME"])) {
  echo date("Y-m-d H:i:s");
  exit;
}


// ------------------------------------------------------
// ------------------------------------------------------
// Debajo de este comentario irá la configuración a la BD
// y las funciones del servicio para la aplicación móvil.

require "conexion.php";
require "enviarCorreo.php";

$con = new Conexion(array(
  "tipo"       => "mysql",
  "servidor"   => "46.28.42.226",
  "bd"         => "u760464709_24005242_bd",
  "usuario"    => "u760464709_24005242_usr",
  "contrasena" => "u7?Jpkt>Y*E7"
));

require "firebase-php-jwt/vendor/autoload.php";

$headers = getallheaders();

$token = "";
if (isset($headers["Authorization"])) {
  $token = str_replace("Bearer ", "", $headers["Authorization"]);
}

try {
  # el segundo parametro es la clave para codificar y decodificar el JWT
  # debe ser una string no corta, por eso rellené de guiones
  $decoded = Firebase\JWT\JWT::decode($token, new Firebase\JWT\Key("Test12345-----------------------------------------------", "HS256"));

  # $usuario puede ser usada para validaciones
  $usuario = explode("/", $decoded->sub);
  $id      = $usuario[0];
  $usr     = $usuario[1];
  $tipo    = $usuario[2];

  # $login puede ser usada para validaciones
  $login = true;
}
catch (Exception $error) {
  $usuario = array();
  $login   = false;
}
$esAdmin = $login && $tipo == "1";

# en cada endpoint podemos hacer uso de la variable login para seguridad
# tenemos la variable login y usuario para realizar más validaciones


///// PAGOS
if (isset($_GET ["agre_pagos"]) && $login) {


  $prepare = $con->prepare("CALL AgregarPagos(:id_pedido,:monto,:estado_pago,:referencia_paypal, @NUEVOid_pago, @NUEVOid_pedido, @NUEVOmonto, @NUEVOestado_pago, @NUEVOreferencia_paypal)");
  $prepare->bindParam(":id_pedido", $_POST["txtid_pedido"]);
  $prepare->bindParam(":monto", $_POST["txtMonto"]);
  $prepare->bindParam(":estado_pago", $_POST["cboEstadoPago"]);
  $prepare->bindParam(":referencia_paypal", $_POST["txtReferenciaPaypal"]);
  $prepare->execute();

  $pagoAgregado = array();

  foreach($con->query("SELECT @NUEVOid_pago, @NUEVOid_pedido, @NUEVOmonto, @NUEVOestado_pago,
   @NUEVOreferencia_paypal;") as $pagos){
    $pagoAgregado = $pagos;
  }
  
  //$id = $con->lastInsertId();

  header("Content-Type: application/json");
  echo json_encode($pagoAgregado);
}

elseif (isset($_GET ["pagos"])&& $esAdmin) {


  $select = $con->select("view_InfoPagos");
  $select->orderBy("id_pago","DESC");
  $select->limit(10);

  header("Content-Type: application/json");
  echo json_encode($select->execute());
 
}

elseif (isset($_GET ["obt_id_pedido"])&& $login) {

  $select = $con->select("view_obt_id_pedido");
  $select->where("estado", "<>", "Pagado");
  $select->orderby("id_pedido","DESC");
  $select->limit(10);

  header("Content-Type: application/json");
  echo json_encode($select->execute());
}

///// PEDIDOS
elseif (isset($_GET["pedidos"])&& $esAdmin) {
  $select = $con->select("view_pedidos");
  $select->orderby("id_pedido DESC");

  header("Content-Type: application/json");
  echo json_encode($select->execute());
}
elseif (isset($_GET["pedidosCombo"])&& $esAdmin) {
    $select = $con->select("usuarios", "id_usuario AS value, nombre AS label");
    $select->orderby("nombre ASC");
    $select->limit(10);

    $array = array(
        array("value" => "", "label" => "Selecciona una opción")
    );

    foreach ($select->execute() as $comprador) {
        $array[] = array(
            "value" => $comprador["value"],
            "label" => $comprador["label"]
        );
    }

    header("Content-Type: application/json");
    echo json_encode($array);
}

elseif (isset($_GET["editarPedido"])&& $esAdmin) {
  $select = $con->select("pedidos", "*");
  $select->where("id_pedido", "=", $_GET["id"]);

  header("Content-Type: application/json");
  echo json_encode($select->execute());
}


elseif (isset($_GET["modificarPedido"])&& $esAdmin) {
  $prepare = $con->prepare("CALL ModificarPedido(:id_pedido,:id_comprador,:total,:estado)");
  $prepare->bindParam(":id_pedido", $_POST["txtId"]);
  $prepare->bindParam(":id_comprador", $_POST["cboComprador"]);
  $prepare->bindParam(":total", $_POST["txtTotal"]);
  $prepare->bindParam(":estado", $_POST["cboEstado"]);
  $prepare->execute();

  if($prepare->execute()) {
    echo "correcto";
  }
  else {
    echo "error";
  }
}
elseif(isset($_GET["agreg_pedido"]) && $login){
  $prepare = $con->prepare("CALL AgregarPedidoReal(:id_comprador,:total,:estado, @NUEVOid_pedido, @NUEVOid_comprador, @NUEVOtotal, @NUEVOestado)");
  $prepare->bindParam(":id_comprador", $_POST["cboComprador"]);
  $prepare->bindParam(":total", $_POST["txtTotal"]);
  $prepare->bindParam(":estado", $_POST["cboEstado"]);
  $prepare->execute();

  $pedidoAgregado = array();

  foreach($con->query("SELECT @NUEVOid_pedido, @NUEVOid_comprador, @NUEVOtotal, @NUEVOestado;") as $pedidos){
    $pedidoAgregado = $pedidos;
  }
  
  //$id = $con->lastInsertId();

  header("Content-Type: application/json");
  echo json_encode($pedidoAgregado);
}
///// PRODUCTOS
elseif (isset($_GET["productos"]) && $login) {
  $select = $con->select("view_productos");
  $select->orderby("id DESC");
  $select->limit(10);

  header("Content-Type: application/json");
  echo json_encode($select->execute());
}
elseif (isset($_GET["productosDisponibles"]) && $login) {
  $select = $con->select("view_productos");
  $select->where("disponible", "=", "1");
  $select->orderby("id DESC");
  $select->limit(10);

  header("Content-Type: application/json");
  echo json_encode($select->execute());
}
elseif (isset($_GET["eliminarProducto"])&& $esAdmin) {
  $prepare = $con->prepare("CALL EliminarProducto(:idProducto)");
    $prepare->bindParam(":idProducto", $_POST["txtId"]);
    $prepare->execute();
    $prepare->closeCursor();

    echo "correcto";

}
elseif (isset($_GET["agregarProducto"]) && $login) {
  $nombreImagen = "";

  if(isset($_FILES["txtimagen"]) && $_FILES["txtimagen"]["error"] == 0){
      $nombreImagen =  time() . "_" . $_FILES["txtimagen"]["name"];
      $ruta = "images/" . $nombreImagen;
      move_uploaded_file($_FILES["txtimagen"]["tmp_name"], $ruta);
  }

  $prepare = $con->prepare("CALL AgregarProducto(:titulo,:descripcion,:precio,:imagen,:talla,:estado,:categoria,:vendedor,:disponible, @NUEVOid_producto, @NUEVOtitulo, @NUEVOdescripcion, @NUEVOprecio, @NUEVOimagen, @NUEVOTalla, @NUEVOestado, @NUEVOid_categoria, @NUEVOid_vendedor, @NUEVOdisponible)");
  $prepare->bindParam(":titulo", $_POST["txtTitulo"]);
  $prepare->bindParam(":descripcion", $_POST["txtDescripcion"]);
  $prepare->bindParam(":precio", $_POST["txtPrecio"]);
  $prepare->bindParam(":imagen", $ruta);
  $prepare->bindParam(":talla", $_POST["txtTalla"]);
  $prepare->bindParam(":estado", $_POST["cboEstado"]);
  $prepare->bindParam(":categoria", $_POST["cboIdCat"]);
  $prepare->bindParam(":vendedor", $_POST["cboIdVendedor"]);
  $prepare->bindParam(":disponible", $_POST["cboDisponible"]);
  $prepare->execute();

  $productoAgregado = array();

  foreach($con->query("SELECT 
    @NUEVOid_producto, 
    @NUEVOtitulo, 
    @NUEVOdescripcion, 
    @NUEVOprecio,
    @NUEVOimagen,
    @NUEVOTalla, 
    @NUEVOestado, 
    @NUEVOid_categoria, 
    @NUEVOid_vendedor, 
    @NUEVOdisponible") as $productos){
    $productoAgregado = $productos;
  }
   header("Content-Type: application/json");
    echo json_encode($productoAgregado);

}
elseif (isset($_GET["categoriasCombo"]) && $login) {
    $select = $con->select("categorias", "id_categoria AS value, nombre_categoria AS label");
    $select->orderby("nombre_categoria ASC");
    $select->limit(10);

    $array = array(
        array("value" => "", "label" => "Selecciona una opción")
    );

    foreach ($select->execute() as $categoria) {
        $array[] = array(
            "value" => $categoria["value"],
            "label" => $categoria["label"]
        );
    }

    header("Content-Type: application/json");
    echo json_encode($array);
}
elseif (isset($_GET["vendedorCombo"])&& $login) {
    $select = $con->select("usuarios", "id_usuario AS value, nombre AS label");
    $select->orderby("nombre ASC");
    $select->limit(10);

    $array = array(
        array("value" => "", "label" => "Selecciona una opción")
    );

    foreach ($select->execute() as $vendedor) {
        $array[] = array(
            "value" => $vendedor["value"],
            "label" => $vendedor["label"]
        );
    }

    header("Content-Type: application/json");
    echo json_encode($array);
}


/////DETALLE PEDIDO
elseif(isset($_GET["detalle_pedido"])&& $esAdmin) {
  $select = $con->select("view_detalle_pedido");
  $select->orderby("id_detalle","DESC");
  $select->limit(10);

  header("Content-Type: application/json");
  echo json_encode($select->execute());
}
elseif(isset($_GET["agregardetalle_pedido"]) && $login) {
  $prepare = $con->prepare("CALL AgregarDetalle(:id_pedido,:id_producto,:cantidad,:precio_unitario, @NUEVOid_detalle, @NUEVOid_pedido, @NUEVOid_producto, @NUEVOcantidad, @NUEVOprecio_unitario)");
  $prepare->bindParam(":id_pedido", $_POST["cboPedido"]);
  $prepare->bindParam(":id_producto", $_POST["cboProducto"]);
  $prepare->bindParam(":cantidad", $_POST["txtcantidad"]);
  $prepare->bindParam(":precio_unitario", $_POST["txtprecio_unitario"]);
  $prepare->execute();

  $detalleAgregado = array();

  foreach($con->query("SELECT @NUEVOid_detalle, @NUEVOid_pedido, @NUEVOid_producto, @NUEVOcantidad, @NUEVOprecio_unitario;") as $detalles){
    $detalleAgregado = $detalles;
  }
   header("Content-Type: application/json");
    echo json_encode($detalleAgregado);

}
elseif (isset($_GET["PeCombo"])&& $login) {
    $select = $con->select("pedidos", "id_pedido AS value, id_pedido AS label");
    $select->orderby("id_pedido ASC");
    $select->limit(10);

    $array = array(
        array("value" => "", "label" => "Selecciona una opción")
    );

    foreach ($select->execute() as $pe) {
        $array[] = array(
            "value" => $pe["value"],
            "label" => $pe["label"]
        );
    }

    header("Content-Type: application/json");
    echo json_encode($array);
}
elseif (isset($_GET["ProCombo"])&& $login) {
    $select = $con->select("productos", "id_producto AS value, titulo AS label");
    $select->orderby("titulo ASC");
    $select->limit(10);

    $array = array(
        array("value" => "", "label" => "Selecciona una opción")
    );

    foreach ($select->execute() as $pro) {
        $array[] = array(
            "value" => $pro["value"],
            "label" => $pro["label"]
        );
    }

    header("Content-Type: application/json");
    echo json_encode($array);
}
elseif(isset($_GET["editardetalle_pedido"])&& $esAdmin) {
  $select = $con->select("detalle_pedido", "*");
  $select->where("id_detalle", "=", $_GET["id"]);

  header("Content-Type: application/json");
  echo json_encode($select->execute());

}
elseif(isset($_GET["modificardetalle_pedido"])&& $esAdmin) {
  $prepare = $con->prepare("CALL ModificarDetallePedido(:id_detalle,:id_pedido,:id_producto,:cantidad,:precio_unitario)");
  $prepare->bindParam(":id_detalle", $_POST["txtid_detalle"]);
  $prepare->bindParam(":id_pedido", $_POST["cboPedido"]);
  $prepare->bindParam(":id_producto", $_POST["cboProducto"]);
  $prepare->bindParam(":cantidad", $_POST["txtcantidad"]);
  $prepare->bindParam(":precio_unitario", $_POST["txtprecio_unitario"]);
  $prepare->execute();

  if($prepare->execute()) {
    echo "correcto";
  }
  else {
    echo "error";
  }

}

elseif (isset($_GET["eliminardetalle_pedido"])&& $esAdmin) {
  $prepare = $con->prepare("CALL eliminarDetalle(:id_detalle)");
    $prepare->bindParam(":id_detalle", $_POST["txtid_detalle"]);
    $prepare->execute();
    $prepare->closeCursor();

    echo "correcto";
}



/////USUARIOS
elseif (isset($_GET["editarusuario"])&& $esAdmin){
  $select = $con->select("usuarios", "*");
  $select->where("id_usuario", "=", $_GET["id"]);

  header("Content-Type: application/json");
  echo json_encode($select->execute());

}
elseif (isset($_GET["modificarusuario"])&& $esAdmin){
  $prepare = $con->prepare("CALL ModificarUsuarioReal(:id_usuario,:nombre,:email,:telefono,:contrasena)");
  $prepare->bindParam(":id_usuario", $_POST["txtIdUsuario"]);
  $prepare->bindParam(":nombre", $_POST["txtNombre"]);
  $prepare->bindParam(":email", $_POST["txtEmail"]);
  $prepare->bindParam(":telefono", $_POST["txtTelefono"]);
  $prepare->bindParam(":contrasena", $_POST["txtContrasena"]);
  $prepare->execute();

  if($prepare->execute()) {
    echo "correcto";
  }
  else {
    echo "error";
  }

}
elseif (isset($_GET["usuarios"])&& $esAdmin) {
  $select = $con->select("view_usuarios");
  $select->orderby("id_usuario DESC");

  header("Content-Type: application/json");
  echo json_encode($select->execute());
}
elseif (isset($_GET["eliminarUsuario"])&& $esAdmin) {
  $prepare = $con->prepare("CALL eliminar_usuario(:idUsuario)");
    $prepare->bindParam(":idUsuario", $_POST["txtIdUsuario"]);
    $prepare->execute();
    $prepare->closeCursor();

    echo "correcto";
}
elseif (isset($_GET["agregarUsuario"])&& $esAdmin) {
  $prepare = $con->prepare("CALL AgregarUsuario(:nombre,:email,:telefono,:contrasena, @NUEVOid_usuario, @NUEVOnombre, @NUEVOemail, @NUEVOtelefono, @NUEVOcontrasena)");
  $prepare->bindParam(":nombre", $_POST["txtNombre"]);
  $prepare->bindParam(":email", $_POST["txtEmail"]);
  $prepare->bindParam(":telefono", $_POST["txtTelefono"]);
  $prepare->bindParam(":contrasena", $_POST["txtContrasena"]);;
  $prepare->execute();

  $usuarioAgregado = array();

  foreach($con->query("SELECT @NUEVOid_usuario, @NUEVOnombre, @NUEVOemail, @NUEVOtelefono, @NUEVOcontrasena;") as $usuarios){
    $usuarioAgregado = $usuarios;
  }
   header("Content-Type: application/json");
    echo json_encode($usuarioAgregado);
}
?>
