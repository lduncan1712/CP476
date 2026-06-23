## Database Schema
- Tables:

- Relationships:

- Constraints:

  
## ER Diagram: 
- The below entity-relationship diagram clearly defines the primary keys, foreign keys (where relevant), and constraints
- Put link/photo to ER diagram here.

## SQL Correctness & Clarity:
- View _init.sql_ under the database sub-folder: this showcases our CREATE statements and types/keys/constraints

## Possible Next Step Database Features:
- Logging (created, updated; transactions should probably be immutable)
- Shared budgets/goals? Family structure?
- Accounts (+Transfer Between)
- Authentication Stuff (JWT vs MSAL)

### Options For AUTH Impacts User Table: 
- 1: Custom JWT (id, username, password_hash)
- 2: MSAL: (id, email, oid)
