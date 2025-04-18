# Colonizadar

### Front : Svelte 5, TailwindCSS

### Back : Adonisjs 6.14.1

### Database : PostgreSQL

### ORM : Lucid

### Production links

- [Production (incoming)](https://app.colonizadar.fr)
- [MIT License](/doc/LICENSE.md)

### Development links

| Field    | Value                 |
|----------|-----------------------|
| Adminer  | http://localhost:8080 |
| Backend  | http://localhost:3333 |
| Frontend | http://localhost:5173 |


### Development Adminer connection

| Field    | Value       |
|----------|-------------|
| System   | PostgreSQL  |
| Server   | db          |
| Username | superadmin  |
| Password | xxx         |
| Database | colonizadar |

### Development commands

| Command             | Description                                                                                                                         |
|---------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| `make format-front` | Format code in the `front` directory using Prettier.                                                                                |
| `make format-back`  | Format code in the `back` directory using Prettier.                                                                                 |
| `make list-routes`  | List all routes defined in the backend using `node ace list:routes`.                                                                |
| `make db-fresh`     | Run a fresh migration on the database. **/!\\** **This call clear the previous database**.                                          |
| `make db-migrate`   | Run pending migrations on the database.                                                                                             |
| `make db-seed`      | Seed the backend database with initial data using Docker.                                                                           |
| `make db`           | Runs `db-fresh` followed by `db-seed`. Resets and seeds the database.                                                               |
| `make stop`         | Stops all Docker containers and removes orphans.                                                                                    |
| `make up`           | Stops containers and then builds and starts them in detached mode.                                                                  |
| `make rm`           | Fully stops and resets Colonizadar Docker containers and volumes.                                                                   |
| `make start`        | Fully stops and resets Colonizadar Docker containers and volumes, builds and starts containers, then resets and seeds the database. |
| `make prune`        | **/!\\** Stops containers and prunes Docker system resources.                                                                       |

### Development backend .env (back/.env)

| Variable               | Value                                                                                                    |
|------------------------|----------------------------------------------------------------------------------------------------------|
| `PORT`                 | 3333                                                                                                     |
| `HOST`                 | 0.0.0.0                                                                                                  |
| `NODE_ENV`             | development                                                                                              |
| `APP_KEY`              | **Run `node ace genetate:key` to generate this field**                                                   |
| `LOG_LEVEL`            | debug                                                                                                    |
| `DB_CONNECTION`        | pg                                                                                                       |
| `DB_HOST`              | db                                                                                                       |
| `DB_PORT`              | 5432                                                                                                     |
| `DB_USER`              | superadmin                                                                                               |
| `DB_PASSWORD`          | xxx                                                                                                      |
| `DB_DATABASE`          | colonizadar                                                                                              |
| `FRONT_URI`            | http://localhost:5173                                                                                    |
| `API_URI`              | http://localhost:3333                                                                                    |
| `ACCOUNT_SENDER_EMAIL` | account@colonizadar.fr                                                                                   |
| `BREVO_API_KEY`        | **`A valid Brevo API key`**                                                                              |
| `FRIEND_EMAILS`        | ["paul.lecuisinier@gmail.com"] **Feel free to add other emails to create other users or test emailing** |

### Development frontend .env (front/.env)


| Variable                 | Value                                        |
|--------------------------|----------------------------------------------|
| `VITE_API_BASE_URL`      | http://localhost:3333                        |
| `VITE_FRONT_URI`         | http://localhost:5173                        |
| `VITE_GITHUB_REPOSITORY` | https://github.com/Tassadar921/Colonizadar   |
| `VITE_DEFAULT_IMAGE`     | /assets/default/image.png                    |
