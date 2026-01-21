<?php


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
  "servidor"   => "82.180.168.1",
  "bd"         => "u760464709_24005242_bd",
  "usuario"    => "u760464709_24005242_usr",
  "contrasena" => "u7?Jpkt>Y*E7"
));

if (isset($_GET ["agre_pagos"])) {
  $insert = $con->insert("pagos","id_pedido, monto, estado_pago, referencia_paypal");
  $insert->value($_POST["txtid_pedido"]);
  $insert->value($_POST["txtMonto"]);
  $insert->value($_POST["cboEstadoPago"]);
  $insert->value($_POST["txtReferenciaPaypal"]);
  $insert->execute();

  
  $id = $con->lastInsertId();

  if (is_numeric($id)) {
    echo $id;
    } else {
    echo "0";
   }
}

elseif (isset($_GET ["pagos"])) {
  $select = $con->select("pagos","id_pago, detalle_pedido.id_pedido AS pedido, productos.titulo AS productonombre, monto, estado_pago, fecha_pago, DATE_FORMAT(pagos.fecha_pago, '%Y') AS year, DATE_FORMAT(pagos.fecha_pago, '%m') AS mes,
  DATE_FORMAT(pagos.fecha_pago, '%d') AS day, referencia_paypal");
  $select->innerjoin("detalle_pedido USING (id_pedido)");
  $select->innerjoin("productos USING (id_producto)");
  $select->orderBy("id_pago","DESC");
  $select->limit(10);

  header("Content-Type: application/json");
  echo json_encode($select->execute());
 
}

elseif (isset($_GET ["obt_id_pedido"])) {
  $select = $con->select("detalle_pedido", "detalle_pedido.id_pedido, productos.titulo AS nombre, pedidos.total AS total");
  $select->innerjoin("productos USING (id_producto)");
  $select->innerjoin("pedidos USING (id_pedido)");
   $select->orderby("detalle_pedido.id_pedido","DESC");
  $select->limit(10);

  header("Content-Type: application/json");
  echo json_encode($select->execute());
}



?>
