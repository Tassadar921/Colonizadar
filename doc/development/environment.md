# Colonizadar - Development Environment Variables

### Development backend .env (back/.env)

```
PORT=3333
HOST=0.0.0.0
NODE_ENV=development
APP_KEY=
LOG_LEVEL=debug
DB_CONNECTION=pg
DB_HOST=db
DB_PORT=5432
DB_USER=superadmin
DB_PASSWORD=xxx
DB_DATABASE=colonizadar
LOGS_DB_USER=superadmin
LOGS_DB_PASSWORD=xxx
LOGS_DB_DATABASE=colonizadar_logs
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
FRONT_URI=http://localhost:5173
API_URI=http://localhost:3333
ACCOUNT_SENDER_EMAIL=account@colonizadar.fr
BREVO_API_KEY=
FRIEND_EMAILS=["paul.lecuisinier@gmail.com"]
```

| Variable               | Value                                                                                                   |
|------------------------|---------------------------------------------------------------------------------------------------------|
| `PORT`                 | 3333                                                                                                    |
| `HOST`                 | 0.0.0.0                                                                                                 |
| `NODE_ENV`             | development                                                                                             |
| `APP_KEY`              | **Run `node ace genetate:key` to generate this field**                                                  |
| `LOG_LEVEL`            | debug                                                                                                   |
| `DB_CONNECTION`        | pg                                                                                                      |
| `DB_HOST`              | db                                                                                                      |
| `DB_PORT`              | 5432                                                                                                    |
| `DB_USER`              | superadmin                                                                                              |
| `DB_PASSWORD`          | xxx                                                                                                     |
| `DB_DATABASE`          | colonizadar                                                                                             |
| `LOGS_DB_USER`         | superadmin                                                                                              |
| `LOGS_DB_PASSWORD`     | xxx                                                                                                     |
| `LOGS_DB_DATABASE`     | colonizadar_logs                                                                                        |
| `REDIS_HOST`           | 127.0.0.1                                                                                               |
| `REDIS_PORT`           | 6379                                                                                                    |
| `REDIS_PASSWORD`       |                                                                                                         |
| `FRONT_URI`            | http://localhost:5173                                                                                   |
| `API_URI`              | http://localhost:3333                                                                                   |
| `ACCOUNT_SENDER_EMAIL` | account@colonizadar.fr                                                                                  |
| `BREVO_API_KEY`        | **`A valid Brevo API key`**                                                                             |
| `FRIEND_EMAILS`        | ["paul.lecuisinier@gmail.com"] **Feel free to add other emails to create other users or test emailing** |

### Development frontend .env (front/.env)

```
VITE_API_BASE_URL=http://localhost:3333
VITE_FRONT_URI=http://localhost:5173
VITE_GITHUB_REPOSITORY=https://github.com/Tassadar921/Colonizadar
VITE_DEFAULT_IMAGE=/assets/default/image.png
```

| Variable                 | Value                                      |
|--------------------------|--------------------------------------------|
| `VITE_API_BASE_URL`      | http://localhost:3333                      |
| `VITE_FRONT_URI`         | http://localhost:5173                      |
| `VITE_GITHUB_REPOSITORY` | https://github.com/Tassadar921/Colonizadar |
| `VITE_DEFAULT_IMAGE`     | /assets/default/image.png                  |

### Development index documentation

[&larr; Back to index](index.md)
