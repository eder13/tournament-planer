# Knockout Tournament Planner

A knockout tournament planner application written in Hapi and React.

![Showcase](./showcase.png)

## Prerequisites

-   NodeJS >=18
-   MySQL 8

## Setup

1. Create a `.env` file inside `server/` and setup the database as well as other important environment variables, example:

```txt
PORT="8080"
PROTOCOL="http"
HOST="localhost"

DATABASE_URL="mysql://db_tournament:my-secret-password-locally@localhost:3306/db_mario_kart_tournament"
COOKIE_SECRET="COOKIE_your_complex_secret_here1" # 32 characters long
JWT_SECRET="TOKEN_your_complex_secret_here12" # 32 characters long
JWT_AUD="tournament_planer"
EMAIL_HOST="smtp.myEmailHost.com"
EMAIL_USER="no-reply@my-email.com"
EMAIL_PASSWORD="my-password"
EMAIL_PORT="587" # 587 or 465
```

2. go to `/client` and run `npm i` and `npm run build`

3. go to `/server` and run `npm i` and `npm run build`

4. start the server in production mode inside `/server` by running `build:serve-prod`
