# Knockout Tournament Planner

A knockout tournament planner application written in Hapi and React.

## Server

Run `npm install` inside `./server/` to install all the dependencies.

### Dev

1. Start the dev build by running `cd server && npm run serve-dev`
2. The server automatically restarts when changes are made.

ℹ️ Make sure to quit node processes with the task manager since some start in the background and won't quit automatically with CTRL+C.

### Prod

1. Run `cd server && npm run serve-prod` to start the server in prod mode.

### Environment Variables

The following environment variables need to be configured to use the server properly.

0. `DATABASE_URL`(database connection for prisma, example: DATABASE_URL="mysql://user:password@localhost:3306/db_to_use")
1. `COOKIE_SECRET` (used for cookie auth encryption, must be 32 characters)
2. `JWT_SECRET` (used for encrypting JWTs, must be 32 characters)
3. `JWT_AUD` (audience for JWT)
4. `EMAIL_HOST`, `EMAIL_USER` and `EMAIL_PASSWORD` (// TODO - exchange to something that I have on my own)

## Client

The client is directly deployed on the server. This can be achieved by just building the App, i.e. running
`cd client && npm run build`.

#### Using Prisma with MySQL

1. Create a user and grant privileges for the connection - Login via `root` user to mysql:

```sql
CREATE DATABASE IF NOT EXISTS db_mario_kart_tournament;
CREATE USER 'mariokart'@'localhost' IDENTIFIED BY 'my-secret-password-locally';
GRANT ALL PRIVILEGES ON db_mario_kart_tournament.* TO 'mariokart'@'localhost';
GRANT CREATE, DROP, REFERENCES, ALTER ON *.* TO 'mariokart'@'localhost';
```

1.1 You can now access the newly generated user via `mysql -u mariokart -p`

2. Install Prisma `npm install prisma --save-dev`

3. Initialize `npx prisma init`

4. Changed schema.prisma (to mysql) and .env (mysql url - mysql://food:my-secret-password-locally@localhost:3306/db_food_planer)

5. Added schema to schema.prisma

```
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
}
```

6. Run `npx prisma migrate dev --name init` to initialize the database via the schema define din schema.prisma

7. Install `npm install @prisma/client` to use the prisma client

--

Queries:

<b>Show all recipes from user x</b>

##### mysql

```
SELECT r.*
FROM Recipe r
JOIN User u ON r.authorId = u.id
WHERE u.email = 'simon.ranftl23@gmail.com';
```

##### prisma

```js
const recipes = await prisma.recipe.findMany({
    where: {
        author: {
            email: 'simon.ranftl23@gmail.com',
        },
    },
});
```

<b>Show all recipes that are favorited from user with email x</b>

##### mysql

```
SELECT r.*
FROM Recipe r
JOIN UserFavoriteRecipe ufr ON r.id = ufr.recipeId
JOIN User u ON ufr.userId = u.id
WHERE u.email = 'simon.ranftl82@gmail.com';
```

##### primsa

```js
const favoriteRecipes = await prisma.userFavoriteRecipe.findMany({
    where: {
        email: email,
    },
    include: {
        recipe: true,
    },
});

// Extract recipes from the join table result
const recipes = favoriteRecipes.map((fav) => fav.recipe);
```

### Notes for Client

1. Requests from client to protected route with cookie appended:

```
curl -X GET "http://localhost:3100/protected-unauthorized" -H "Cookie: sid-example=paste-cookie-value-here"
```

```js
fetch('http://localhost:3100/protected-unauthorized', {
    headers: {
        Cookie: 'sid-example=cookie-value-here',
    },
})
    .then((res) => {
        return res.json();
    })
    .then((res) => console.log(res));
```

2. Post request to register:

```
curl -v -X POST "http://localhost:3100/login" \
 -H "Content-Type: application/json" \
 -d '{"email": "dgdf", "password": "dfgdfg"}'
```

```js
fetch('http://localhost:3100/login', {
    method: 'post',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        email: 'simon.ranftl23@gmail.com',
        password: 'pw-here',
    }),
}).then((res) => {
    console.log(res);
});
```

## Environment variables

1. `COOKIE_SECRET` (used for cookie auth encryption, must be 32 characters)
2. `JWT_SECRET` (used for encrypting JWTs, must be 32 characters)
3. `JWT_AUD` (audience for JWT)
4. `EMAIL_HOST`, `EMAIL_USER` and `EMAIL_PASSWORD` (// TODO - exchange to something that I have on my own)

## Examples for protected routes and their handling:

1. Always accessible routes without Login

```js
   {
        method: 'POST',
        path: '/post-test',
        options: {
            auth: {
                mode: 'try',
            },
        },
        handler: async (request, h) => {
            return h.response({
                foo: 'bar',
            });
        },
    },
```

2. this redirects automatically to the login page if not logged in

```js
    {
        // Example: This automatically redirects to the login page if not logged in
        method: 'GET',
        path: '/protected-redirect',
        options: {
            auth: {
                mode: 'required',
            },
        },
        handler: async (request, h) => {
            return h.response({
                foo: 'bar',
            });
        },
    },
```

3. this throws 401 if the user is not logged in

```js

    {
        // Example: This throws a 401 error if not authenticated
        method: 'GET',
        path: '/protected-unauthorized',
        options: {
            auth: {
                mode: 'required',
            },
            plugins: {
                cookie: {
                    redirectTo: false,
                },
            },
        },
        handler: async (request, h) => {
            return h.response({
                foo: 'bar',
            });
        },
    },
```

4. Username and password

simon.ranftl82@gmail.com  
987654321
