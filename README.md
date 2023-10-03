# RideLink

Get Connected and Get Riding!

## Description

A React/Flask SQLAlchemy app where users can signup, login and view and create available bike routes. Check out stats for particular rides and stats for users too.

## Getting Started

* Node.js
* Python

### Installing

* Clone down this repo

#### From the /server folder run:
    pipenv install

    pipenv shell
#### From the /client folder run:
    npm install

    npm start

####  Run your backend from the /server folder by running:
    python app.py

#### Seed your database from the /server folder by running
    python seed.py

## Development Server Locations

### Database = http://127.0.0.1:5555/
    
Common Endpoints you may use:
- /users
- /rides
- /routes


### Frontend/Web App = http://127.0.0.1:3000/

## Overview of Domain Model

    User ---> Rides <--- Routes

## Author

Nolan Rummel
https://github.com/nolanrummel

## Acknowledgments

* Flatiron School and my amazing teachers, Adam and Emiley
* All of the help from the "Walking Devs" Cohort

* My seed file faker friends (RIP)
    - User: fernandokhan
    - User: kim88
    - User: lisariley

### Now get out there and hit some bike rides! Thanks for viewing!
