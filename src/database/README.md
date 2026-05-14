## POSSIBLE NEXT STEP DATABASE FEATURES:
- Logging (created, updated) (transactions should probably be immutable)
- Shared budgets/goals?, family structure
- Accounts (+Transfer Between)
- Auth Stuff (JWT vs MSAL)

### Options For AUTH Impacts User Table: 
- 1: Custom JWT (id, username, password_hash)
- 2: MSAL: (id, email, oid)