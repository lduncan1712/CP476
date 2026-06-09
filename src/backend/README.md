## Backend

### Testing 
You can now confirm the database and backend are running using http://localhost:8080/health.php
You can now confirm the (transaction, budget, entity) endpoints are working as expected
```
.\tests\demo.sh
```

### Endpoint URLs
For now all tokens are sent via 'index.php' at (http://localhost:8080/index.php) and required an `Authorization: Bearer <token>` base64-encoded JSON header (For testing for now im using `{"user_id":1}` -> `eyJ1c2VyX2lkIjoxfQ==`, please see tests/demo.sh)

```
GET    http://localhost:8080/health.php

# Transactions
GET     BASE/transactions?id?&category_id?&entity_id?&start?&end?&min?&max?
POST    BASE/transactions                 body: { category_id, entity_id, amount, transaction_date }
PUT     BASE/transactions?id              body: { category_id?, entity_id?, amount?, transaction_date? }
DELETE  BASE/transactions?id

# Budgets
GET     BASE/budgets?id?&category_id?
POST    BASE/budgets                      body: { category_id, duration_id, amount, budget_start, budget_end? }
PUT     BASE/budgets?id                   body: { category_id?, duration_id?, amount?, budget_start?, budget_end? }
DELETE  BASE/budgets?id

# Entities
GET     BASE/entities?id?&name?
POST    BASE/entities                     body: { name }
```