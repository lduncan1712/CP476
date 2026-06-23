# CP476 Course Project

## Table Of Contents

- [Outline](#outline)
    - [Chosen](#chosen)
    - [Summary](#summary)
    - [Tools](#tools)
- [Progress](#progress)
    - [Kanban](https://github.com/users/lduncan1712/projects/1/views/1)
    - [Branches](https://github.com/lduncan1712/CP476/branches)
    - [Contributors](https://github.com/lduncan1712/CP476/graphs/contributors?selectedMetric=commits&all=1)
- [Documentation](#documentation)
    - [Wiki](./docs/WIKI.MD)
    - [Wireframes](./docs/FIGMA.MD) 
- [Setup](#setup)
    - [Requirements](#requirements)
    - [Instructions](#instructions)
    - [Confirmation](#confirmation)


## Outline

### Chosen: 
#### Personal Expense Tracker (Option #5)

### Summary:
#### A simple budgeting app to keep your spending on track. This app organizes your transactions, allowing you to set and monitor budgets, and provides analysis of your spending to help you reach your financial goals. 

### Tools:
- Container: Docker            (Verbally Approved)
- Frontend:  React             (Chapter 11)
- Backend:   PHP               (Chapter 12)
- Database:  PostgreSQL        (Verbally Approved)


## Progress:
#### Individual tasks and total progress were tracked through a shared [KANBAN](https://github.com/users/lduncan1712/projects/1/views/1). Individual contributions were created within git [BRANCHES](https://github.com/lduncan1712/CP476/branches), that upon completion of testing and review, were merged into this main branch. The entire contribution history for each member of this group can accordingly be found within this repository, and a summary of total contributions can be found within [CONTRIBUTORS](https://github.com/lduncan1712/CP476/graphs/contributors?selectedMetric=commits&all=1)




## Documentation
- [Wireframes](./docs/FIGMA.MD)
- [Wiki](./docs/WIKI.MD)



## Setup
#### NOTE: All instructions, requirements and commands below are OS unspecific, so work for Windows, Mac and Linux

### Requirements:
- Docker Desktop (4.6.1+)

### Instructions

#### 1. Create an '.env' file within the project folder, containing the following environment variables. Please note all are local, and can be set to any chosen value  
```
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
```
#### 2. Using specified environment variables, run the following command to create the docker container.
```
docker compose up --build
```

## Confirmation:
#### Confirm the frontend has been built correctly, and is running locally. Open the link below, the login page should be visible, and reactive to user input and button press.
http://localhost:3000
#### Confirm the backend has been correctly hosted, and linked to the database. Open the endpoint link below, its response should have status 200 
http://localhost:8080/health.php
#### Confirm the database has been correctly hosted and seeded. Run the following command through terminal, using your chosen environment variables. It should return a table of transaction category data
```
docker exec -it cp476-main-postgres-1 psql -U {POSTGRES_USER} -d {POSTGRES_DB} -c "SELECT * FROM transaction_categories;"
```