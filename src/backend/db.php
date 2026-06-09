<?php

/**
 * Returns A PDO Database Object Using Env Creds
 * 
 * @return PDO
**/
function get_db(): PDO {
    $dbname   = getenv('POSTGRES_DB');
    $user     = getenv('POSTGRES_USER');
    $password = getenv('POSTGRES_PASSWORD');

    $dsn = "pgsql:host=postgres;port=5432;dbname=$dbname";

    return new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);
}
