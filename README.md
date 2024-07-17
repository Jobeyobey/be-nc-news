# Northcoders News API

This is a news API that allows you to host a CRUD database of articles and their comments. It uses Express for routing and error handling, and PostgreSQL as the RDBMS.

Currently, the API allows you to:

-   Search what topics are available
-   Search through articles. Sorting by various means, as well as filtering by topic.
-   Search for articles by id, and update their vote count
-   Search for comments posted to an article
-   Post comments to an article
-   Delete comments
-   View the userbase

## Using this API

You can find a hosted version of this API [here](https://be-nc-news-q2go.onrender.com).

To view what queries are available and information on how to use them, visit the `/api` endpoint.

## Setting up your own News API

### Step One: Create your repo

Fork this repo to your own account, then clone it down to your machine.

### Step Two: Database Environment Variables Setup

The environment variables for the project databases are not included in this repo and must be created manually for this project to run on your machine.

To set up your databases, create your own `.env.development` and `.env.test` files in the `env_files` directory. Inside these files, set the `PGDATABASE` variables with relevant database names like so:

`PGDATABASE=[your_database_name]`

Once you have created these, run `npm run setup-dbs` to create the databases. Your terminal should respond saying the databases have been created.

### Step Three: Install Dependencies

Run `npm install` to install all project dependencies.

This project was made with Node v22.2.0, and Postgres v16.3

### Step Four: Seed and Test the Database

Running `npm test` seeds the test database you set up in your `.env.test` file, then runs multiple tests to ensure it's working correctly. The tests should all pass, and you should be able to enter `psql` in your terminal to query that database now that it has been seeded.

Running `npm run seed` seeds the development database you set up in your `.env.development` file. Once this is done, you can host the app locally with `npm run start`. You should then be able to query your database via your browser or an API client.

By default, the development database is hosted on port 9095, so you once it's running, you should be able to query it with `localhost:9095/api`.

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
