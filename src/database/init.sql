-- ACTORS
-- ##############################################
CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS entities(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);


-- SUPPORT
-- #############################################
CREATE TYPE durations AS ENUM (
    'DAILY',
    'WEEKLY',
    'MONTHLY',
    'YEARLY'
);


-- BUDGETS & GOALS
-- #############################################
CREATE TABLE IF NOT EXISTS budgets(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    budget_start DATE NOT NULL,
    budget_end   DATE NOT NULL,
    budget_duration durations NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE budgets ADD CONSTRAINT budget_amount CHECK (amount > 0);


CREATE TABLE IF NOT EXISTS goals(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    balance DECIMAL(10, 2) NOT NULL,
    goal_date DATE NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id)
);





-- TRANSACTIONS
-- #############################################
CREATE TABLE IF NOT EXISTS transaction_kinds(
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS transaction_categories(
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions(
    id SERIAL PRIMARY KEY,
    kind_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    user_id INTEGER NOT NULL,
    entity_id INTEGER NOT NULL,

    amount DECIMAL(10, 2) NOT NULL,
    transaction_date DATE NOT NULL,

    FOREIGN KEY (kind_id) REFERENCES transaction_kinds(id),
    FOREIGN KEY (category_id) REFERENCES transaction_categories(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (entity_id) REFERENCES entities(id)
);

ALTER TABLE transactions ADD CONSTRAINT transaction_amount CHECK (amount > 0);



-- SEED DATA
-- ######################################
COPY transaction_kinds (id, name) FROM '/docker-entrypoint-initdb.d/seed/transaction_kinds.csv' WITH (FORMAT CSV, HEADER true);
COPY transaction_categories (id, name) FROM '/docker-entrypoint-initdb.d/seed/transaction_categories.csv' WITH (FORMAT CSV, HEADER true);