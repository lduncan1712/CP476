CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS entities(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TYPE durations AS ENUM (
    'DAILY',
    'WEEKLY',
    'MONTHLY',
    'YEARLY'
);


CREATE TABLE IF NOT EXISTS transaction_kinds(
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS transaction_categories(
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);


-- SEED DATA COPY
COPY transaction_kinds (id, name) FROM '/docker-entrypoint-initdb.d/seed/transaction_kinds.csv' WITH (FORMAT CSV, HEADER true);
COPY transaction_categories (id, name) FROM '/docker-entrypoint-initdb.d/seed/transaction_categories.csv' WITH (FORMAT CSV, HEADER true);