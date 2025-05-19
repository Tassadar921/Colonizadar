# Colonizadar Development Commands

| Command             | Description                                                                                                                         |
|---------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| `make format`       | Format code both in `front` and `back` directories using Prettier.                                                                  ||
| `make format-check` | Checks code format both in `front` and `back` directories using Prettier.                                                           ||
| `make upgrade`      | Updates dependencies in both `front` and `back` directories.                                                                        ||
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

### Development index documentation

[&larr; Back to index](index.md)
