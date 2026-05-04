<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "koneksi.php";

$json_data = file_get_contents("php://input");
$data = json_decode($json_data, true);

if (isset($data['nama_barang']) && isset($data['harga'])) {
    $nama  = $data['nama_barang'];
    $harga = (int) $data['harga']; // cast ke integer supaya aman

    // ✅ Pakai prepared statement
    $stmt = $koneksi->prepare("INSERT INTO barang (nama_barang, harga) VALUES (?, ?)");
    $stmt->bind_param("si", $nama, $harga);

    if ($stmt->execute()) {
        echo json_encode(["status" => "sukses", "pesan" => "Data berhasil ditambahkan"]);
    } else {
        echo json_encode(["status" => "error", "pesan" => "Gagal: " . $stmt->error]);
    }
    $stmt->close();
} else {
    echo json_encode(["status" => "error", "pesan" => "Data tidak lengkap"]);
}
?>