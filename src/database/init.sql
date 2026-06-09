CREATE TYPE durations AS ENUM (
    'DAILY',
    'WEEKLY',
    'MONTHLY',
    'YEARLY',
    'DECADE'
);

CREATE TABLE IF NOT EXISTS budget_durations(
    id                     INTEGER PRIMARY KEY,
    name                   VARCHAR(255) NOT NULL,
    days                   INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS transaction_categories(
    id                     INTEGER PRIMARY KEY,
    name                   VARCHAR(255) NOT NULL
);




CREATE TABLE IF NOT EXISTS users(
    id                     SERIAL PRIMARY KEY,
    name                   VARCHAR(255) NOT NULL,
    created_on             DATE NOT NULL DEFAULT CURRENT_DATE,
    updated_on             DATE NOT NULL DEFAULT CURRENT_DATE,
    current_to             DATE
);

CREATE TABLE IF NOT EXISTS entities(
    id                     SERIAL PRIMARY KEY,
    name                   VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions(
    id                     SERIAL PRIMARY KEY,
    category_id            INTEGER NOT NULL,
    user_id                INTEGER NOT NULL,
    entity_id              INTEGER NOT NULL,
    amount                 DECIMAL(10, 2) NOT NULL,
    transaction_date       DATE NOT NULL,

    FOREIGN KEY (category_id) REFERENCES transaction_categories(id),
    FOREIGN KEY (user_id)     REFERENCES users(id),
    FOREIGN KEY (entity_id)   REFERENCES entities(id),

    CONSTRAINT transaction_positive CHECK (amount > 0)
);

CREATE TABLE IF NOT EXISTS budgets(
    id                     SERIAL PRIMARY KEY,
    user_id                INTEGER NOT NULL,
    category_id            INTEGER,
    amount                 DECIMAL(10, 2) NOT NULL,
    duration_id            INTEGER NOT NULL,
    budget_start           DATE NOT NULL,
    budget_end             DATE,  
    
    FOREIGN KEY (user_id)     REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES transaction_categories(id),
    FOREIGN KEY (duration_id) REFERENCES budget_durations(id),

    CONSTRAINT budget_positive CHECK (amount > 0)
);










CREATE OR REPLACE FUNCTION budget_updates_user()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        UPDATE users SET updated_on = CURRENT_DATE WHERE id = OLD.user_id;
        RETURN OLD;
    ELSE
        UPDATE users SET updated_on = CURRENT_DATE WHERE id = NEW.user_id;
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION transaction_updates_user()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        UPDATE users 
        SET 
            updated_on = CURRENT_DATE 
            --current_to = stale? DESIGN DECISION: Push Back On Delete????
        WHERE id = OLD.user_id;
        RETURN OLD;
    ELSE
        UPDATE users
        SET
            updated_on = CURRENT_DATE,
            current_to = GREATEST(current_to, NEW.transaction_date)
        WHERE id = NEW.user_id;
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE TRIGGER trg_budgets_update_user
    AFTER INSERT OR UPDATE OR DELETE ON budgets
    FOR EACH ROW EXECUTE FUNCTION budget_updates_user();


CREATE OR REPLACE TRIGGER trg_transactions_update_user
    AFTER INSERT OR UPDATE OR DELETE ON transactions
    FOR EACH ROW EXECUTE FUNCTION transaction_updates_user();


COPY transaction_categories (id, name) FROM '/docker-entrypoint-initdb.d/seed/transaction_categories.csv' WITH (FORMAT CSV, HEADER true);
COPY budget_durations (id, name, days) FROM '/docker-entrypoint-initdb.d/seed/budget_durations.csv' WITH (FORMAT CSV, HEADER true);
COPY users (id, name) FROM '/docker-entrypoint-initdb.d/test/users.csv' WITH (FORMAT CSV, HEADER true);
COPY entities (id, name) FROM '/docker-entrypoint-initdb.d/test/entities.csv' WITH (FORMAT CSV, HEADER true);
COPY transactions (category_id, user_id, entity_id, amount, transaction_date) FROM '/docker-entrypoint-initdb.d/test/transactions.csv' WITH (FORMAT CSV, HEADER true);

SELECT setval('entities_id_seq', (SELECT MAX(id) FROM entities));