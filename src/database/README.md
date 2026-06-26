## Database Schema
### Tables:
- **users** – stores user information (name and id) and audit fields (created_on, updated_on, current_to).
- **transactions** – stores individual expense transactions, including the user, category, entity (vendor), amount, and transaction date.
- **budgets** – stores spending budgets for users, optionally by category, over a specified time period.
- **transaction_categories** – reference table containing predefined expense categories (e.g., Food, Housing, Entertainment).
- **budget_durations** – reference table defining supported budget durations (e.g., Daily, Weekly, Monthly, Yearly).
- **entities** – stores vendors/payees associated with transactions (e.g., CIBC, Tangerine, TD).
  
### Relationships:
- One **user** can have zero to many **transactions**; each transaction belongs to exactly one user.
- One **user** can have zero to many **budgets**; each budget belongs to exactly one user.
- One **transaction category** can be associated with zero to many **transactions**; each transaction belongs to exactly one category.
- One **transaction category** can be associated with zero to many **budgets**; each budget may optionally belong to one transaction category.
- One **entity** (vendor/payee) can be associated with zero to many **transactions**; each transaction references exactly one entity.
- One **budget duration** can be associated with zero to many **budgets**; each budget uses exactly one budget duration.

### Constraints:
- Primary keys uniquely identify each record in every table.
- Foreign keys enforce referential integrity between related tables.
- Transaction and budget amounts must be greater than zero using `CHECK (amount > 0)`.
- Entity names must be unique.
- Required fields are enforced using `NOT NULL` constraints where appropriate; See **transactions** and **budget** tables.
- `budgets.category_id` is nullable/optionable, allowing users to create overall budgets that apply to all spending categories rather than being tied to a specific transaction category.
	
## ER Diagram
The entity-relationship diagram below illustrates the database schema, including all entities, primary keys, foreign keys (where relevant), relationships, and key constraints. In the ER diagram, the "*" icon represents a mandatory field (not NULL), and the outwards arrow "↗" represents a foreign key icon.

See the full ER diagram here:
- [ER Diagram](./CP476%20-%20ER%20Diagram.pdf)

## SQL Correctness & Clarity: 
See `database/init.sql` for the complete database implementation, including:
- `CREATE TABLE` statements
- Primary and foreign keys
- Constraints (`PRIMARY KEY`, `FOREIGN KEY`, `CHECK`, `UNIQUE`, `NOT NULL`)
- PostgreSQL-specific data types and schema definitions

## Possible Next Step Database Features:
- Logging (created, updated; transactions should probably be immutable)
- Shared budgets/goals? Family structure?
- Accounts (+Transfer Between)
- Authentication Stuff (JWT vs MSAL)

### Options For AUTH Impacts User Table: 
- 1: Custom JWT (id, username, password_hash)
- 2: MSAL: (id, email, oid)
