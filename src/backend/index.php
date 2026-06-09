<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

require 'db.php';
require 'controller.php';
require 'router.php';

try {
    route();
} catch(\Throwable $e) {
    error_log($e);
    respond_error(500, "Internal Server Error Mid Query");
}
