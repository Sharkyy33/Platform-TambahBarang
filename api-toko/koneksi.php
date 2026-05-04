<?php

$host = "localhost";
$user = "root";
$pass = ""; 
$db = "db_toko";

$koneksi = mysqli_connect($host, $user, $pass, $db);

if (!$koneksi) {
    die(json_encode(["status" => "error", "pesan" => "koneksi ke database gagal"]));
}

mysqli_set_charset($koneksi, "utf8mb4"); // ← tambah ini
?>