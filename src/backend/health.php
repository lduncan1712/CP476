<?php
require_once 'db.php';

header('Content-Type: application/json');

/**
 * This Is A Simple Endpoint Confirming Backend + Database Health
 */
try {
    $pdo = get_db();
    $pdo->query('SELECT 1');
    echo json_encode(['status' => 'ok']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Unable To Reach Database']);
}
