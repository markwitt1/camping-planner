# CampingPlanner

Public URL: http://www.camping-planner.xyz or http://camping-planner.herokuapp.com

The project consists of two parts, Frontend and Backend (in client folder).

Please view the following instructions if you want to run the project on your local machine.

## Environment variables

Create an environment variable called MONGO_CONNECTION and set it to your own MongoDB connection or use mine:
`mongodb+srv://admin:admin@campingplanner.onkya.mongodb.net/CampingPlannerDB-dev?retryWrites=true&w=majority`

You also need to add an environment variable called SESSION_SECRET. Just set it to a random string (and don't tell it to anyone!)

## Running the app

Ensure having Node.js installed.

`cd` to the root of the project.

Run `npm i && npm i --prefix="client"` to install all the dependencies for the project.

To run the backend, use `npm start`, or, while developing, `npm run dev` for auto restart on file change.

To run the fronted, run `npm run startClient`.

To build the frontend, run `npm run buildClient`.
