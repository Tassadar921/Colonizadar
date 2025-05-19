# Colonizadar Getting Started

### 1) Clone the repository

```bash
  git clone git@github.com:Tassadar921/Colonizadar.git
```

### 2) Create `.env` files

For this part, refer to the [environment variables](environment.md) documentation.

### 3) Make sure you have Docker and the `compose` plugin installed

```bash
    docker --version
    docker compose version
```

- If you don't have Docker installed, you can follow the official [Docker installation guide](https://docs.docker.com/get-docker/).
- If you don't have the `compose` plugin installed, you can follow the official [Docker Compose installation guide](https://docs.docker.com/compose/install/).
- If you are on a Linux system and don't have docker rights, you can follow the official [Docker post-installation steps](https://docs.docker.com/engine/install/linux-postinstall/).

### 4) Make sure you have `make` installed

```bash
    make --version
```

If you don't have `make` installed, you can follow the official [GNU Make installation guide](https://www.gnu.org/software/make/).

### 5) Start the application

```bash
    make start
```

This command will build and start the application in detached mode. It will also reset and seed the database.

### 6) Access the application

You can access the application at http://localhost:5173.

### Development index documentation

[&larr; Back to index](index.md)
