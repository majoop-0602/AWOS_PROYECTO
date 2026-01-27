<?php

require "conexion.php";

$con = new Conexion(array(
  "tipo"       => "mysql",
  "servidor"   => "82.180.168.1",
  "bd"         => "u760464709_24005242_bd",
  "usuario"    => "u760464709_24005242_usr",
  "contrasena" => "u7?Jpkt>Y*E7"
));

if (isset($_GET["agregarUbicacion"])) {
    $descripcion = $_POST["txtDescripcion"];
    $latitud     = $_POST["hidLatitud"];
    $longitud    = $_POST["hidLongitud"];

    $insert = $con->insert("reportes", "descripcion, latitud, longitud");
    $insert->value($descripcion);
    $insert->value($latitud);
    $insert->value($longitud);
    $insert->execute();

    echo $con->lastInsertId();
}
elseif (isset($_GET["buscarUbicaciones"])) {
    $select = $con->select("reportes");
    header("Content-Type: application/json");
    echo json_encode($select->execute());
}
elseif (isset($_GET["editarUbicacion"])) {
    $select = $con->select("reportes");
    $select->where("idReporte", "=", $_GET["id"]);
    header("Content-Type: application/json");
    echo json_encode($select->execute());
}

?>