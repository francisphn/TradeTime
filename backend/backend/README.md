# SENG365 API server


## Deploying

1. Use `npm install` to populate the `node_modules/` directory with up-to-date packages
2. Create a file called `.env`, following the instructions in the section below
3. Make sure you have MySQL installed and running. Create a database and refer to the section below for how to use the `.env` file.
2. Run `npm run start` or `npm run debug` to start the server
3. The server will be accessible on `localhost:4941`
4. Deploy via Firebase.

### `.env` file
Create a `.env` file in the root directory of this project including the following information (note that you will need to create the database first in phpMyAdmin):



For example:
```
SENG365_MYSQL_HOST=localhost:1000
SENG365_MYSQL_USER=abc123
SENG365_MYSQL_PASSWORD=password
SENG365_MYSQL_DATABASE=abc123_s365
```