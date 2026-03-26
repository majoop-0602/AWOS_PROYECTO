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

require "conexion.php";

$con = new Conexion(array(
  "tipo"       => "mysql",
  "servidor"   => "46.28.42.226",
  "bd"         => "u760464709_24005242_bd",
  "usuario"    => "u760464709_24005242_usr",
  "contrasena" => "u7?Jpkt>Y*E7"
));

require "firebase-php-jwt/vendor/autoload.php";

if (isset($_GET["agregarUbicacion"])) {
    $usuario = $_POST["cboUsuario"];
    $calle = $_POST["txtCalle"];
    $ciudad = $_POST["txtCiudad"];
    $estado = $_POST["cboEstado"];
    $codigo_postal = $_POST["txtCodigoPostal"];
    $descripcion = $_POST["txtDescripcion"];
    $latitud     = $_POST["txtLatitud"];
    $longitud    = $_POST["txtLongitud"];

    $insert = $con->insert("direcciones", "id_usuario, calle, ciudad, estado, codigo_postal, descripcion, latitud, longitud");
    $insert->value($usuario);
    $insert->value($calle);
    $insert->value($ciudad);
    $insert->value($estado);
    $insert->value($codigo_postal);
    $insert->value($descripcion);
    $insert->value($latitud);
    $insert->value($longitud);
    $insert->execute();

    echo $con->lastInsertId();
}
elseif (isset($_GET["usuarioCombo"])) {
    $select = $con->select("usuarios", "id_usuario AS value, nombre AS label");
    $select->orderby("nombre ASC");
    $select->limit(10);

    $array = array(
        array("value" => "", "label" => "Selecciona una opción")
    );

    foreach ($select->execute() as $usuario) {
        $array[] = array(
            "value" => $usuario["value"],
            "label" => $usuario["label"]
        );
    }

    header("Content-Type: application/json");
    echo json_encode($array);
}

elseif (isset($_GET["buscarUbicaciones"])) {
     $select = $con->select("direcciones","id_direccion, usuarios.nombre AS usuario, calle, ciudad, 
  estado, codigo_postal, descripcion, latitud, longitud");
  $select->innerjoin("usuarios USING (id_usuario)");
  $select->orderBy("id_direccion","DESC");
  $select->limit(10);

  header("Content-Type: application/json");
  echo json_encode($select->execute());
}
elseif (isset($_GET["editarDireccion"])) {
  $select = $con->select("direcciones", "*");
  $select->where("id_direccion", "=", $_GET["id"]);

  header("Content-Type: application/json");
  echo json_encode($select->execute());
}


elseif (isset($_GET["modificarDireccion"])) {
  $update = $con->update("direcciones");
  $update->set("calle", $_POST["txtCalle"]);
  $update->set("ciudad", $_POST["txtCiudad"]);
  $update->set("estado", $_POST["cboEstado"]);
  $update->set("codigo_postal", $_POST["txtCodigoPostal"]);
  $update->set("descripcion", $_POST["txtDescripcion"]);
  $update->set("latitud", $_POST["txtLatitud"]);
  $update->set("longitud", $_POST["txtLongitud"]);
  $update->where("id_direccion", "=", $_POST["txtid"]);

  echo $update->execute() ? "correcto" : "error";
}

elseif (isset($_GET["obtenerUltimaUbicacion"])) {
    $select = $con->select("direcciones", "latitud, longitud");
    $select->orderBy("id_direccion", "DESC");
    $select->limit(1);

    header("Content-Type: application/json");
    echo json_encode($select->execute());
}

?>