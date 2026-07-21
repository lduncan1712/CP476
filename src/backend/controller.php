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
 * Validates That Required Fields Are Present + Non-Empty
 * Responds 400 And Exits If Any Are Missing (Lightweight Guard)
 *
 * @param array $body
 * @param array $required
 * @return void
 */
function require_fields(array $body, array $required): void {
    foreach ($required as $field) {
        if (!isset($body[$field]) || trim((string)$body[$field]) === '') {
            respond_error(400, "Missing Or Empty Required Field: $field");
        }
    }
}


/**
 * Creates A New Transaction For Token Authenticated User
 *
 * @param PDO $db
 * @param int $user_id
 * @param array $body 
 * @return array|false
 */
function create_transaction(PDO $db, int $user_id, array $body): array|false {
    require_fields($body, ['category_id', 'entity_id', 'amount', 'transaction_date']);

    $body['user_id'] = $user_id;
    $statement = $db->prepare(
        'WITH row AS (
            INSERT INTO transactions' . get_cols($body) .
        '   VALUES ' . get_params($body) .
        '   RETURNING *
        )
        SELECT row.*,
               e.name  AS entity_name,
               tc.name AS category_name
        FROM row
        LEFT JOIN entities               e  ON e.id  = row.entity_id
        LEFT JOIN transaction_categories tc ON tc.id = row.category_id'
    );
    $statement->execute($body);
    return $statement->fetch();
}


/**
 * Updates A Transaction Owned For Token Authenticated User
 *
 * @param PDO $db
 * @param int $user_id
 * @param array $params
 * @param array $body  
 * @return array|false
 */
function update_transaction(PDO $db, int $user_id, array $params, array $body): array|false {
    $statement = $db->prepare(
        'WITH row AS (
            UPDATE transactions SET ' . get_pairs($body) .
        '   WHERE
                id = :id AND
                user_id = :user_id
            RETURNING *
        )
        SELECT row.*,
            e.name  AS entity_name,
            tc.name AS category_name
        FROM row
        LEFT JOIN entities               e  ON e.id  = row.entity_id
        LEFT JOIN transaction_categories tc ON tc.id = row.category_id'
    );
    $body['user_id'] = $user_id;
    $body['id'] = $params['id'];
    $statement->execute($body);
    return $statement->fetch();
}


/**
 * Deletes A Transaction For The Authenticated User
 *
 * @param PDO $db
 * @param int $user_id
 * @param array $params
 * @return array|false
 */
function delete_transaction(PDO $db, int $user_id, array $params): array|false {
    require_fields($params, ['id']);

    $statement = $db->prepare(
        'WITH row AS (
            DELETE FROM transactions
            WHERE
                id = :id AND
                user_id = :user_id
            RETURNING *
        )
        SELECT row.*,
            e.name  AS entity_name,
            tc.name AS category_name
        FROM row
        LEFT JOIN entities               e  ON e.id  = row.entity_id
        LEFT JOIN transaction_categories tc ON tc.id = row.category_id'
    );
    $params['user_id'] = $user_id;
    $statement->execute($params);
    return $statement->fetch();
}



/**
 * Selects Transactions Owned By The Authenticated User, With Optional Filters
 *
 * @param PDO $db
 * @param int $user_id
 * @param array $params
 * @return array
 */
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
        "SELECT t.*,
                e.name  AS entity_name,
                tc.name AS category_name
         FROM transactions t
         LEFT JOIN entities               e  ON e.id  = t.entity_id
         LEFT JOIN transaction_categories tc ON tc.id = t.category_id
         WHERE
            (:id = 0 OR t.id = :id) AND
            t.user_id = :user_id AND
            (:category_id = 0 OR t.category_id = :category_id) AND
            (:start <= t.transaction_date) AND
            (:end   >= t.transaction_date) AND
            (:min   <= t.amount) AND
            (:max   >= t.amount) AND
            (:entity_id = 0 OR t.entity_id = :entity_id)
         ORDER BY t.transaction_date"
    );
    $statement->execute($params);
    return $statement->fetchAll();
}

/**
 * Creates A New Budget For The Authenticated User
 *
 * @param PDO $db
 * @param int $user_id
 * @param array $body 
 * @return array|false
 */
function create_budget(PDO $db, int $user_id, array $body): array|false {
    require_fields($body, ['category_id', 'duration_id', 'amount', 'budget_start']);

    $body['user_id'] = $user_id;
    $statement = $db->prepare(
        'WITH row AS (
            INSERT INTO budgets' . get_cols($body) .
        '   VALUES ' . get_params($body) .
        '   RETURNING *
        )
        SELECT row.*,
               bd.name AS duration_name,
               tc.name AS category_name
        FROM row
        LEFT JOIN budget_durations       bd ON bd.id = row.duration_id
        LEFT JOIN transaction_categories tc ON tc.id = row.category_id'
    );
    $statement->execute($body);
    return $statement->fetch();
}

/**
 * Updates A Budget Owned By The Authenticated User
 *
 * @param PDO $db
 * @param int $user_id
 * @param array $params
 * @param array $body  
 * @return array|false
 */
function update_budget(PDO $db, int $user_id, array $params, array $body): array|false {
    $statement = $db->prepare(
        'WITH row AS (
            UPDATE budgets SET ' . get_pairs($body) .
        '   WHERE
                id = :id AND
                user_id = :user_id
            RETURNING *
        )
        SELECT row.*,
               bd.name AS duration_name,
               tc.name AS category_name
        FROM row
        LEFT JOIN budget_durations       bd ON bd.id = row.duration_id
        LEFT JOIN transaction_categories tc ON tc.id = row.category_id'
    );
    $body['id'] = $params['id'];
    $body['user_id'] =  $user_id;
    $statement->execute($body);
    return $statement->fetch();
}


/**
 * Deletes A Budget Owned By The Authenticated User
 *
 * @param PDO $db
 * @param int $user_id
 * @param array $params
 * @return array|false
 */
function delete_budget(PDO $db, int $user_id, array $params): array|false {
    require_fields($params, ['id']);

    $statement = $db->prepare(
        'WITH row AS (
            DELETE FROM budgets
            WHERE
                id = :id AND
                user_id = :user_id
            RETURNING *
        )
        SELECT row.*,
               bd.name AS duration_name,
               tc.name AS category_name
        FROM row
        LEFT JOIN budget_durations       bd ON bd.id = row.duration_id
        LEFT JOIN transaction_categories tc ON tc.id = row.category_id'
    );
    $params['user_id'] = $user_id;
    $statement->execute($params);
    return $statement->fetch();
}


/**
 * Selects Budgets Owned By The Authenticated User, With Optional Filters
 *
 * @param PDO $db
 * @param int $user_id
 * @param array $params 
 * @return array
 */
function select_budgets(PDO $db, int $user_id, array $params): array {
    $params['category_id'] = (int)($params['category_id'] ?? 0);
    $params['id'] = (int)($params['id'] ?? 0);
    $params['user_id'] = $user_id;

    $statement = $db->prepare(
        "SELECT b.*,
                tc.name AS category_name
         FROM budgets b
         LEFT JOIN transaction_categories tc ON tc.id = b.category_id
         WHERE
            (:user_id = b.user_id) AND
            (:id = 0 OR b.id = :id)  AND
            (:category_id = 0 OR b.category_id = :category_id)
         ORDER BY b.budget_start"
    );
    $statement->execute($params);
    return $statement->fetchAll();
}

/**
 * Creates A New Entity 
 * 
 * Note: (Rejects Duplicate Names)
 *
 * @param PDO $db
 * @param int $user_id
 * @param array $body  
 * @return array|false
 */
function create_entity(PDO $db, int $user_id, array $body): array|false {
    $body['name'] = strtoupper($body['name']);

    $check_name = $db->prepare('SELECT id FROM entities WHERE name = :name');
    $check_name->execute(['name' => $body['name']]);
    if ($check_name->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'Entity with this name already exists']);
        exit;
    } else {

        $statement = $db->prepare(
            'INSERT INTO entities ' . get_cols($body) .
            ' VALUES ' . get_params($body) .
            ' RETURNING *'
        );
        $statement->execute($body);
        return $statement->fetch();
    }
}

/**
 * Deletes An Entity By Id
 *
 * @param PDO $db
 * @param array $params 
 * @return array|false
 */
function delete_entity(PDO $db, int $user_id, array $params): array|false {
    require_fields($params, ['id']);

    $statement = $db->prepare(
        'DELETE FROM entities WHERE id = :id RETURNING *'
    );
    $statement->execute(['id' => (int)($params['id'] ?? 0)]);
    return $statement->fetch();
}

/**
 * Selects Entities, With Optional Name/Id Filters
 *
 * @param PDO $db
 * @param int $user_id
 * @param array $params
 * @return array
 */
function select_entities(PDO $db, int $user_id, array $params): array {
    $params['name'] = $params['name'] ?? '';
    $params['id'] = (int)($params['id'] ?? 0);

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

/**
 * Creates A New User
 *
 * @param PDO $db
 * @param array $body
 * @return array|false
 */
function create_user(PDO $db, array $body): array|false {
    require_fields($body, ['name', 'username', 'password']);

    $username_check = $db->prepare('SELECT id FROM users WHERE username = :username');
    $username_check->execute(['username' => $body['username']]);

    if ($username_check->fetch()) {
        respond_error(409, 'Username Taken');
    } else {

        $statement = $db->prepare(
            'INSERT INTO users' . get_cols($body) .
            'VALUES ' . get_params($body) .
            'RETURNING id'
        );
        $statement->execute($body);
        $user =  $statement->fetch();

        $token = base64_encode(json_encode(['user_id' => $user['id']]));
        http_response_code(200);
        echo json_encode(['token' => $token]);
        exit;
    }
}

/**
 * Selects The Currently Authenticated User's Own Record
 *
 * @param PDO $db
 * @param int $user_id
 * @return array|false
 */
function select_user(PDO $db, int $user_id): array|false {
    $statement = $db->prepare(
        'SELECT * FROM users WHERE id = :id'
    );
    $statement->execute(['id' => $user_id]);
    return $statement->fetch();
}

/**
 * Updates The Authenticated User's Own Record (Currently Just Name)
 *
 * @param PDO $db
 * @param int $user_id
 * @param array $body
 * @return array|false
 */
function update_user(PDO $db, int $user_id, array $body): array|false {
    require_fields($body, ['name']);

    // Whitelist The Editable Fields + Always Bump updated_on
    $clean = [
        'name'       => trim($body['name'])
    ];

    $statement = $db->prepare(
        'UPDATE users SET ' . get_pairs($clean) . ' ' .
        'WHERE id = :id
        RETURNING *'
    );
    $clean['id'] = $user_id;
    $statement->execute($clean);
    return $statement->fetch();
}

/**
 * Deletes The Authenticated User's Own Record
 * 
 * NOTE: Will Fail (FK Constraint) If The User Still Has Transactions/Budgets
 *
 * @param PDO $db
 * @param int $user_id
 * @return array|false
 */
function delete_user(PDO $db, int $user_id): array|false {
    $statement = $db->prepare(
        'DELETE FROM users WHERE id = :id RETURNING *'
    );
    $statement->execute(['id' => $user_id]);
    return $statement->fetch();
}


/**
 * Authenticates A User And Returns A Token If Credentials Found
 *
 * @param PDO $db
 * @param array $body
 * @return array
 */
function login_user(PDO $db, array $body): array {
    require_fields($body, ['username', 'password']);

    $statement = $db->prepare(
        'SELECT id FROM users WHERE username = :username AND password = :password'
    );
    $statement->execute($body);

    $response = $statement->fetch();

    if ($response) {

        $token = base64_encode(json_encode(['user_id' => $response['id']]));
        http_response_code(200);
        echo json_encode(['token' => $token]);
        exit;

    } else {
        respond_error(401, 'Invalid Account Details');
    }

}

/**
 * Selects All Transaction Categories
 *
 * @param PDO $db
 * @param int $user_id
 * @return array
 */
function select_categories(PDO $db, int $user_id): array {
    $statement = $db->prepare(
        "SELECT * FROM transaction_categories ORDER BY name"
    );
    $statement->execute();
    return $statement->fetchAll();
}