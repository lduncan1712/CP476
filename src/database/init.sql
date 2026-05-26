CREATE TABLE IF NOT EXISTS users(
    id                     SERIAL PRIMARY KEY,
    name                   VARCHAR(255) NOT NULL,
    created_on             DATE NOT NULL,
    updated_on             DATE NOT NULL,
    current_to             DATE
);

CREATE TABLE IF NOT EXISTS entities(
    id                     SERIAL PRIMARY KEY,
    name                   VARCHAR(255) NOT NULL
);

CREATE TYPE durations AS ENUM (
    'DAILY',
    'WEEKLY',
    'MONTHLY',
    'YEARLY',
    'DECADE'
);

CREATE TABLE IF NOT EXISTS transaction_kinds(
    id                     INTEGER PRIMARY KEY,
    name                   VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS transaction_categories(
    id                     INTEGER PRIMARY KEY,
    name                   VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS transactions(
    /*
        OUT:      (user -> entity),
        IN:       (entity -> user),
        TRANSFER: (user -> ), (-> user)    
    */
    id                     SERIAL PRIMARY KEY,
    kind_id                INTEGER NOT NULL,
    category_id            INTEGER NOT NULL,
    user_id                INTEGER NOT NULL,
    entity_id              INTEGER NOT NULL,
    amount                 DECIMAL(10, 2) NOT NULL,
    transaction_date       DATE NOT NULL,

    FOREIGN KEY (kind_id)     REFERENCES transaction_kinds(id),
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
    duration               durations NOT NULL,
    budget_start           DATE NOT NULL,
    budget_end             DATE,  
    
    FOREIGN KEY (user_id)     REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES transaction_categories(id),

    CONSTRAINT budget_positive CHECK (amount > 0)
);

CREATE TABLE IF NOT EXISTS goals(
    id                     SERIAL PRIMARY KEY,
    user_id                INTEGER NOT NULL,
    balance                DECIMAL(10, 2) NOT NULL,
    goal_date              DATE NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE OR REPLACE FUNCTION goal_updates_user()
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
        UPDATE users SET updated_on = CURRENT_DATE WHERE id = OLD.user_id;
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



CREATE TRIGGER trg_budgets_update_user
    AFTER INSERT OR UPDATE OR DELETE ON budgets
    FOR EACH ROW EXECUTE FUNCTION budget_updates_user();

CREATE TRIGGER trg_goals_update_user
    AFTER INSERT OR UPDATE OR DELETE ON goals
    FOR EACH ROW EXECUTE FUNCTION goal_updates_user();

CREATE TRIGGER trg_transactions_update_user
    AFTER INSERT OR UPDATE OR DELETE ON transactions
    FOR EACH ROW EXECUTE FUNCTION transaction_updates_user();


COPY transaction_kinds (id, name) FROM '/docker-entrypoint-initdb.d/seed/transaction_kinds.csv' WITH (FORMAT CSV, HEADER true);
COPY transaction_categories (id, name) FROM '/docker-entrypoint-initdb.d/seed/transaction_categories.csv' WITH (FORMAT CSV, HEADER true);