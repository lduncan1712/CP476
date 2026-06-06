<?php

/**
 * Endpoint Response For Single Row
 * 
 * @param array|false $data 
 * @return never
 */
function respond_one(array|false $data): never {
    if (!$data) {
        http_response_code(404);
        echo json_encode(['error' => 'Resource Not Found']);
        exit;
    }
    http_response_code(200);
    echo json_encode($data);
    exit;
}
/**
 * Endpoint Response For 0-N Rows
 * 
 * @param array $data
 * @return never
 */
function respond_any(array $data): never {
    http_response_code(200);
    echo json_encode($data);
    exit;
}

/**
 * Endpoint Response For Caught Error
 * 
 * @param int $code
 * @param string $message
 * @return never
 */
function respond_error(int $code, string $message): never {
    http_response_code($code);
    echo json_encode(['error' => $message]);
    exit;
};





/**
 * Method That Routes The Endpoint Call
 *
 * NOTE TODO: Currently No AUTH Enforcement, Just Assuming Passing Encrypted user_id Dict As Token
 * NOTE TODO: Currently No Body Or Paramater Validation, Just Passing As Is, Assuming Inclusion Of Correct Fields
 */
function route(): void {

    //METHOD
    $method = $_SERVER['REQUEST_METHOD'];

    if($method === 'OPTIONS'){
        http_response_code(204);
        exit;
    }
    

    //REQUESTED URL (path + query=>params (a=1&b=2...))
    $url =    $_SERVER['REQUEST_URI'];
    $path   = str_replace('/index.php', '', parse_url($url, PHP_URL_PATH));
    $query  = parse_url($url, PHP_URL_QUERY) ?? '';
    parse_str($query, $params);

    //DATABASE
    $db = get_db();
    
    //BODY
    $body = json_decode(file_get_contents('php://input'), true) ?? [];

    //AUTH
    $header  = apache_request_headers()['Authorization'] ?? '';
    $token = substr($header, 7);
    $decoded = json_decode(base64_decode($token), true);
    $user_id = (int) $decoded['user_id'];

    switch($path) {
        case '/transactions':
            switch($method){
                case 'GET':    respond_any(select_transactions($db, $user_id, $params));
                case 'POST':   respond_one(create_transaction($db, $user_id, $body));
                case 'DELETE': respond_one(delete_transaction($db, $user_id, $params));
                case 'PUT':    respond_one(update_transaction($db, $user_id, $params, $body));
                default: respond_error(405, "Method Not Allowed");    
            }
            break;
        case '/budgets':
            switch($method){
                case 'GET':    respond_any(select_budgets($db, $user_id, $params));
                case 'POST':   respond_one(create_budget($db, $user_id, $body));
                case 'DELETE': respond_one(delete_budget($db, $user_id, $params));
                case 'PUT':    respond_one(update_budget($db, $user_id, $params, $body));
                default: respond_error(405, "Method Not Allowed");
            }
            break;
        case '/entities':
            switch($method){
                case 'GET': respond_any(select_entities($db, $user_id, $params));
                case 'POST':respond_one(create_entity($db, $user_id, $body));
                default: respond_error(405, "Method Not Allowed");
            }
            break;        
        default: respond_error(404, "Path Not Found");
    }
}