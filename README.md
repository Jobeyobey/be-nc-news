# Northcoders News API

## Database Environment Variables Setup

The environment variables for the project databases are not included in this repo and must be created manually for this project to run on your machine.

To set up your databases, create your own `.env.development` and `.env.test` files in the root of your project folder. Inside these files, set the PGDATABASE variables with relevant database names like so:

`PGDATABASE=[your_database_name]`

Once you have created these, run `npm run setup-dbs` to create the databases. If successful, your terminal should respond saying the databases have been created.

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
