<?php

/**
 * Generates The Column String For INSERT Statements
 *
 * @param array $data
 * @return string
 */
function get_cols(array $data): string{
    return ' (' . implode(', ', array_keys($data)) . ') ';
}

/**
 * Generates The Placeholder String For INSERT Statements
 *
 * @param array $data
 * @return string
 */
function get_params(array $data): string{
    return '(' . implode(', ', array_map(fn($key) => ":$key", array_keys($data))) . ') ';
}

/**
 * Generate A Column=Placeholder String For UPDATE Statements
 *
 * @param array $data
 * @return string
 */
function get_pairs(array $data): string{
    return implode(', ', array_map(fn($key) => "$key = :$key", array_keys($data)));
}


/**
 * ==================================================
 *  ENDPOINTS BELOW
 * ==================================================
 */
function create_transaction(PDO $db, int $user_id, array $body): array|false {
    $body['user_id'] = $user_id;
    $statement = $db->prepare(
        'INSERT INTO transactions' . get_cols($body) .
        'VALUES ' . get_params($body) .
        'RETURNING *'
    );
    $statement->execute($body);
    return $statement->fetch();
}

function update_transaction(PDO $db, int $user_id, array $params, array $body): array|false
{
    $statement = $db->prepare(
        'UPDATE transactions SET ' . get_pairs($body) . ' ' .
        'WHERE 
            id = :id AND 
            user_id = :user_id 
        RETURNING *'
    );
    $body['user_id'] = $user_id;
    $body['id'] = $params['id'];
    $statement->execute($body);
    return $statement->fetch();
}

function delete_transaction(PDO $db, int $user_id, array $params): array|false
{
    $statement = $db->prepare(
        'DELETE FROM transactions
         WHERE 
            id = :id AND 
            user_id = :user_id 
        RETURNING *'
    );
    $params['user_id'] = $user_id;
    $statement->execute($params);
    return $statement->fetch();
}

function select_transactions(PDO $db, int $user_id, array $params): array {
    $params['user_id']     = $user_id;
    $params['id']          = (int)($params['id']          ?? 0);
    $params['category_id'] = (int)($params['category_id'] ?? 0);
    $params['entity_id']   = (int)($params['entity_id']   ?? 0);
    $params['start']       =       $params['start']       ?? '1899-01-01';
    $params['end']         =       $params['end']         ?? '2199-12-31';
    $params['min']         = (float)($params['min']       ??  0);
    $params['max']         = (float)($params['max']       ??  99999999.99);

    $statement = $db->prepare(
        "SELECT * FROM transactions
         WHERE
            (:id = 0 or id = :id) AND
            user_id = :user_id AND
            (:category_id = 0 OR category_id = :category_id) AND
            (:start <= transaction_date) AND 
            (:end   >= transaction_date) AND
            (:min   <= amount) AND
            (:max   >= amount) AND
            (:entity_id = 0 OR entity_id = :entity_id)
         ORDER BY transaction_date"
    );
    $statement->execute($params);
    return $statement->fetchAll();
}

function create_budget(PDO $db, int $user_id, array $body): array|false
{
    $body['user_id'] = $user_id;
    $statement = $db->prepare(
        'INSERT INTO budgets' . get_cols($body) .
        'VALUES ' . get_params($body) .
        'RETURNING *'
    );
    $statement->execute($body);
    return $statement->fetch();
}

function update_budget(PDO $db, int $user_id, array $params, array $body): array|false {
    $statement = $db->prepare(
        'UPDATE budgets SET ' . get_pairs($body) . ' ' .
        ' WHERE 
            id = :id AND 
            user_id = :user_id 
        RETURNING *'
    );
    $body['id'] = $params['id'];
    $body['user_id'] =  $user_id;
    $statement->execute($body);
    return $statement->fetch();
}

function delete_budget(PDO $db, int $user_id, array $params): array|false
{
    $statement = $db->prepare(
        'DELETE FROM budgets
         WHERE
            id = :id AND
            user_id = :user_id
        RETURNING *'
    );
    $params['user_id'] = $user_id;
    $statement->execute($params);
    return $statement->fetch();
}

function select_budgets(PDO $db, int $user_id, array $params): array
{
    $params['category_id'] = (int)($params['category_id'] ?? 0);
    $params['id'] = (int)($params['id'] ?? 0);
    $params['user_id'] = $user_id;

    $statement = $db->prepare(
        "SELECT * FROM budgets
         WHERE 
            (:user_id = user_id) AND
            (:id = 0 OR id = :id) AND
            (:category_id = 0 OR category_id = :category_id)
         ORDER BY budget_start"
    );
    $statement->execute($params);
    return $statement->fetchAll();
}


function create_entity(PDO $db, int $user_id, array $body): array|false {
    $body['name'] = strtoupper($body['name']);

    $statement = $db->prepare(
        'INSERT INTO entities ' . get_cols($body) .
        ' VALUES ' . get_params($body) .
        ' ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name' .
        ' RETURNING *'
    );
    $statement->execute($body);
    return $statement->fetch();
}

function select_entities(PDO $db, int $user_id, array $params): array {
    $params['name'] = $params['name'] ?? '';
    $params['id'] = (int)$params['id'] ?? 0;

    $statement = $db->prepare(
        "SELECT * FROM entities
         WHERE 
            (:name = '' OR name LIKE '%' || :name || '%') AND
            (:id = 0 OR :id = id)
         ORDER BY name"
    );
    $statement->execute($params);
    return $statement->fetchAll();
}