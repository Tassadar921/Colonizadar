# Colonizadar - Development Documentation

### Development links

| Field    | Value                 |
|----------|-----------------------|
| Adminer  | http://localhost:8080 |
| Backend  | http://localhost:3333 |
| Frontend | http://localhost:5173 |

### Common management commands

- `make up` - Starts the Docker containers in detached mode.
- `make stop` - Stops all Docker containers and removes orphans.
- `make rm` - Fully stops and resets Colonizadar containers and volumes.
- `make start` - Runs `make rm`, builds and starts containers, then resets and seeds the database.
- `make db` - Resets and seeds the database
- `make format` - Formats the codebase using Prettier.


### Related documentation

- [Getting started &rarr;](getting-started.md)
- [Adminer &rarr;](adminer.md)
- [Environment variables &rarr;](environment.md)
- [Commands &rarr;](commands.md)
