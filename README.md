# Knockout Tournament Planner

A knockout tournament planner application written in Hapi and React.

![Showcase](./showcase.png)

## Prerequisites

-   NodeJS >=18
-   MySQL 8

## Setup

1. Create the mysql database for the app

```txt
CREATE DATABASE IF NOT EXISTS db_tournament;
CREATE USER 'tournament'@'localhost' IDENTIFIED BY 'my-secret-password-locally';
GRANT ALL PRIVILEGES ON db_tournament.* TO 'tournament'@'localhost';
GRANT CREATE, DROP, REFERENCES, ALTER ON *.* TO 'tournament'@'localhost';
```

2. Create a `.env` file inside `server/` and setup the database as well as other important environment variables, example:

```txt
NODE_ENV=production
PORT="8080"
PROTOCOL="http"
HOST="localhost"

DATABASE_URL="mysql://tournament:my-secret-password-locally@localhost:3306/db_tournament"
COOKIE_SECRET="COOKIE_your_complex_secret_here1" # 32 characters long
JWT_SECRET="TOKEN_your_complex_secret_here12" # 32 characters long
JWT_AUD="tournament_planer"
EMAIL_HOST="smtp.myEmailHost.com"
EMAIL_USER="no-reply@my-email.com"
EMAIL_PASSWORD="my-password"
EMAIL_PORT="587" # 587 or 465
```

3. go to `/server` and init the database wih prisma

```txt
npx prisma migrate deploy
```

4. go to `/client` and run `npm i` and `npm run build`

5. go to `/server` and run `npm i` and `npm run build`

6. start the server in production mode inside `/server` by running `build:serve-prod`
