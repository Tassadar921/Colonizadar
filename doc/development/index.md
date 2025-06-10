# Colonizadar - Development Documentation

### Development links

| Field    | Value                 |
|----------|-----------------------|
| Landing  | http://localhost:5174 |
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:3333 |
| Adminer  | http://localhost:8080 |

### Common management commands

- `make up` - Starts the Docker containers in detached mode.
- `make stop` - Stops all Docker containers and removes orphans.
- `make rm` - Fully stops and resets Colonizadar containers and volumes.
- `make db` - Resets and seeds the database
- `make start` - Runs `make rm`, builds the containers, then run `make db`.
- `make format` - Formats the codebase using Prettier.

### Related documentation

- [Getting started &rarr;](getting-started.md)
- [Adminer &rarr;](adminer.md)
- [Environment variables &rarr;](environment.md)
- [Commands &rarr;](commands.md)
- [Frontend icons &rarr;](commands.md)
- [Landing &rarr;](commands.md)
