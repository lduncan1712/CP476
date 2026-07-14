# Wiki & Group Meeting Notes
Our group has been meeting weekly after Tuesday class. The summary of these meetings is recorded below.

## Tuesday May 12th, 2026 (1 hour)
##### Minutes:
- Decided on the topic based on a vote.
- Brainstormed some project requirements.
- Gracie Heer nominated as team leader.
- Weekly meeting schedule set.

##### Important decisions:
- We decided that we will build the budget app with the following technologies, all running in a Docker container:
    - Database: Postgres SQL
    - Backend: PHP
    - Frontend: React

## Thursday, May 14th, 2026 (30 minutes)
##### Minutes:
- The group was split up into 3 teams **(Proposal team, wireframes team, and data planning team)**
- Everyone (regardless of team) is responsible for working on the user stories.
- Team plan to be handled by group leader (Gracie Heer)
- GitHub setup done by Lucas Duncan.
- Wiki to be maintained by Charlie Carter.
- Discussions around acceptance criteria began
- Went through the requirements we all made over the past 2 days, and decided on green (must have) and yellow (Nice to have).
- Yusra made a shared Figma for Wireframes
##### Team building:
- Softball talk.
##### Milestone 1 Teams:
| Project Proposal | Wireframes     | Data Planning     |
|------------------|----------------|-------------------|
| Owen Macgowan    | Charlie Carter | Lucas Duncan      |
| Adam Bondi       | Yursa Hassan   | Jordan Franschman |
| Gracie Heer      | Jamie Beatty   |                   |
| Evan Parisotto   | Janaki Patel   |                   |


## Tuesday, May 19th, 2026 (30 minutes)
##### Minutes:
- Initial, high-level user stories were discussed. These need to be broken down into smaller, more detailed user stories.
- Laying out the initial website page designs on paper to support the wireframe team
- Discussed the bare minimum of functionalities.
##### Team building:
- Discussed our long weekends. Lucas trimmed the flowers.

### Tuesday, May 26th, 2026 (30 minutes)
##### Minutes:
- Received updates from each subteam
- **Wireframe team updates:**
    - Added an overall budget view to the landing page
    - Landing page now includes:
        - Overall spending
        - Recent transactions
        - Budgets close to being filled.
    - Discussed buttons on each page and how users will move between the pages.
- **Report/Proposal Team:**
  Need to have finished user stories before they continue with the proposal. We looked through the wireframes to further refine the stories to match.
- **Database Team:**
    - Decided how much design we want done for first milestone
    - Users, entities, key relationships.
    - Tables: Will likely have 5-6 tables. 2-3 are support tables
    - Preliminary tables:
        - Users
        - Entities (vendors you financially interact with, e.g. Sobeys, Amazon, Sporting Life, Nike)
        - Transactions (money transfer)
        - Budgets (How much you'd like to spend in a certain category over a given timeframe. I.e. \$150 for groceries this month, \$1200 in transportation this summer.)
##### Team building:
- Discussed weekends. Celebrated the birthdays shared yesterday. HBD Owen & Lucas 🎉

## June 2nd, 2026 (30 minutes)
##### Minutes:
- Going through what we need to deliver on Friday
- Subteam updates/status:
    - **Project proposal:** Almost done
    - **Wireframes:** Adding connections between screens and ui actions.
    - **Database:**
        - We decided that we aren't going to track the user's income (or "money in"). This is a budget app, and we are primarily concerned with tracking the user's spending.
        - Fundamental entity: Transaction. Money spent by the user at a certain vendor (entity), on a certain date, in a certain category.
            - People entities and company entities → 1 side of the transaction
            - Budget entities —> other side of the transaction.
        - Budget table design: Users can either create a new budget for the month or update the previous one.
        - Database team will get started with scaffolding what the data looks like in the repo

- **User stories**: finish the updated list
    - Add difficulty rating for the user stories (based on Fibonacci sequence)
    - Need to add priority to each user story

- **Definition of Done**
    - Gracie will create the "definition of done", in terms of finished parts of the web app
    - Will check if features meet their acceptance criteria.

## June 9th, 2026 (30 minutes)
##### Minutes:
- Begin work on Milestone #2
- **Front-end:** focus on front-end
	- No connection to the back-end as of now.
	- Change the sidebar design so there is room for other buttons/subpages.
	- Use forms for user input (e.g., add budget).
- **Back-end:** far enough along
	- All endpoints required for the demo are done.
	- Use endpoints and test data.
	- Get started on user authentication (right now, only looking at user IDs).
- **Database:** discuss any inconsistencies between "Milestone 1 Data planning" and repo "database init.sql"
    - Discuss database schema quality & normalization - map out ER diagram.
    - Ensure SQL correctness & clarity: CREATE statements run cleanly; data types/keys/constraints make sense.
            
- **Assign roles for milestone**: assigned tasks on Kanban
    - Look at CP476B-S26 - Project Outline -> Milestone 02 – Front-End Implementation & Database Design -> Deliverables and Rubric
    - Plan deliverables to be started and updated for the next meeting.

- **Further team understanding working with GitHub and Docker**
    - Push/pull requests, branches, committing, testing, approval, etc.
    - Troubleshoot Docker Desktop and linking with GitHub repo.
 

## June 25th, 2026 (30 minutes)
#### Minutes:
- Check in about Milestone #2
- **Front-end:**
	- Most core pages are made; however, not yet connected to the API
   	- Forms largely set up
- **Back-end:**
	- Endpoints complete and accessible for use
   	- Tests to see functionality have been made, and example uses are within the frontend
- **Database:**
  	- Design formalized for Milestone 2
  	- AUTH delayed to Milestone 3
- **Report Attachments:**
	- Adam will push ER diagram and database design document updates
- **Deadline Delay:**
  	- Milestone deadline pushed to Sunday

## Milestone 2 Contributions:

| Gracie Heer                | Lucas Duncan                | Jaime Beatty               | Charlie Carter              | Adam Bondi           | Jordan Franschman  | Yursa Hassan             | Evan Parisotto | Owen Macgowan                | Janaki Patel         |
|----------------------------|-----------------------------|----------------------------|-----------------------------|----------------------|--------------------|--------------------------|----------------|------------------------------|----------------------|
| Frontend: Add budget Popup | Backend: Endpoints          | Frontend: Main Page Layout | Frontend: Transaction Table | Database: ER Diagram | Backend: Endpoints | Frontend: Analytics Page |                | Frontend: Budget Status Card | Frontend: Login Page |
| Frontend: Budget Page      | Database: SQL Create Tables | Frontend: Landing Screen   | Frontend: Transactions Page | Database: init.sql   |                    |                          |                |                              |                      |

## July 7th, 2026 (30 minutes)
#### Minutes:
- Check-in for Milestone #03 – Full-Stack Integration, Testing Report, Final Demo & Presentation
- **Milestone 3:**
    - As a team, read through CP476B-S26 - Project Outline -> Milestone 03, to see what is ahead and how we are progressing.
    - Divided deliverables as done in the previous two milestones. Teams were created based on previous milestone tasks and group member strengths and comfort level.
    - Assigned specific sub-tasks and created initial deadlines for check-ins (see below table).
      
	| Connecting frontend & backend | Testing + Testing Report | Kanban, Presentation artifiact, and Wiki |
	|-------------------------------|--------------------------|------------------------------------------|
	| Owen Macgowan                 | Gracie Heer              | Adam Bondi
	| Charlie Carter                | Yursa Hassan             | Evan Parisotto
	| Lucas Duncan                  | Jamie Beatty             |
	| Jordan Franschman             | Janaki Patel             |										  |
										
    - Final Demo Video (10 minutes): ALL group members (to be discussed and planned out in the next meeting).
- **To be checked**: Deployment/execution instructions (README).
    - Already created clear steps to run locally from a clean machine setup (including any environment/config notes).
    - Need to double-check we are not missing anything.
- **Plan next meeting**: Tuesday, Jul 14 after class to discuss progress, challenges, concerns, etc.
