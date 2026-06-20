# CP476

A simple budgeting app to keep your spending on track. This app organizes your transactions, 
allows you to set and monitor budgets, and provides analysis of your spending to help you reach
your financial goals. 

## LINKS:
### [KANBAN](https://github.com/users/lduncan1712/projects/1/views/1)
### See ./docs for [Wiki](./docs/WIKI.MD) and [Wireframes](./docs/FIGMA.MD) 


## DETAILS:

### Chosen Idea: Personal Expense Tracker (5)

### Stack:
- Container: Docker      (Verbally Approved)
- Frontend:  React       (Chapter 11)
- Backend:   PHP
- Database:  Postgres/PostgreSQL     (Verbally Approved)

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
Build the Docker container with:
```
docker compose up --build
```
Confirm the frontend runs with:
```
http://localhost:3000
```
Confirm the database has been setup and seeded properly with:
```
docker exec -it cp476-main-postgres-1 psql -U {POSTGRES_USER} -d {POSTGRES_DB}-c "SELECT * FROM transaction_categories;"
```
