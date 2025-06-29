<?php
// Set header agar bisa diakses oleh web client (CORS & JSON)
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

// Cek method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
  exit;
}

// Ambil input JSON
$input = json_decode(file_get_contents('php://input'), true);
$hwid = $input['hwid'] ?? null;
$durationHours = $input['duration'] ?? 24;

// Validasi input
if (!$hwid) {
  http_response_code(400);
  echo json_encode(['status' => 'error', 'message' => 'HWID is required']);
  exit;
}

// Hitung waktu expired (dalam UNIX timestamp detik)
$expires = time() + ($durationHours * 3600);

// Firebase Realtime Database endpoint
$firebaseUrl = 'https://xzuyaxhubkey-default-rtdb.asia-southeast1.firebasedatabase.app/keys/' . urlencode($hwid) . '.json';

// Data yang akan dikirim
$data = json_encode([
  'expires' => $expires,
  'method' => 'verify.php'
]);

// Kirim data ke Firebase (pakai cURL)
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $firebaseUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT'); // pakai PUT untuk overwrite
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
$error = curl_error($ch);
curl_close($ch);

// Respon Firebase
if ($response && !$error) {
  echo json_encode(['status' => 'success', 'expires' => $expires]);
} else {
  echo json_encode(['status' => 'error', 'message' => $error ?: 'Failed to save key']);
}
?>
