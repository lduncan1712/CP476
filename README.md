# CP476

## LINKS:
### [KANBAN](https://github.com/users/lduncan1712/projects/1/views/1)


## DETAILS:

### Chosen Idea: Personal Expense Tracker (5)

### Stack:
- Container: Docker      (Verbally Approved)
- Frontend:  React       (Chapter 11)
- Backend:   PHP/Node    (Chapter 12,13)   (TBD)
- Database:  Postgres    (Verbally Approved)

## SETUP (Windows)

### Requirements:
- Docker Desktop

### Setup Instructions
Create an .env file with the following fields
```
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
```
Build the docker container with:
```
docker compose up --build
```
Confirm the frontend runs with:
```
http://localhost:3000
```
Confirm the database has been setup and seeded properly with:
```
docker exec -it cp476-postgres-1 psql -U {POSTGRES_USER} -d {POSTGRES_DB}-c "SELECT * FROM transaction_categories;"
```