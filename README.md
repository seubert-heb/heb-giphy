heb-giphy
=========

heb-giphy is a project consisting of a server application, powered by Flask,
and a React frontend. I wanted to get these into a state where they could easily
be run together, but due to time constraints the two parts have to be run seperately
in their development modes.

server
======
The server piece is a Flask app backed by Postgres with SQLAlchemy. Usually apps like
this can use different SQL backends without issue, but I am using a Postgres-specific
datatype on one table, so we can't use SQLite or anything else.

A few environment variables need to be set for the server to behave correctly:
* A Giphy API key as `GIPHY_API_KEY`
* A JWT secret key as `JWT_SECRET_KEY`
* The Postgres connection string as `DATABASE_URL`
* The Flask app name for the development server to run: `FLASK_APP` with value `heb.py`

You also need to create the database you want to connect to in Postgres, but all tables
will be created upon startup.

In order to get the app running locally you should create a virtualenv and install
the `requirements.txt` list. From there, set the above env vars and simply run `flask run`.

frontend
========
The frontend app is a React app that can be configured to hit an arbitrary API host
for interaction. The only environment variable you need is:
* `REACT_APP_API_HOST` pointed to however you're running the server (in development, it will
usually be `http://localhost:5000`)

Just set that and run `npm start` after `npm install` for the dependencies.

Known Issues
============
* Some pages don't update after you complete an action (notably, adding a category). This can be fixed
with better data hierarchy management in the React app.
* Ugly app, just using bootstrap components. The gif results don't always display next to the button
that allows the user to favorite that gif as it overflows to the next row. Simply a matter of time constraints.
* Error messages are not formatted nicely at all. Error handling in the Ajax calls is not great.
* No pagination.
