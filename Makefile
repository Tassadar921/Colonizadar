SHELL := /bin/bash

format:
	cd back && npx prettier --write "**/*.{js,ts,json,yml}"
	cd front && npx prettier --write "**/*.{js,ts,svelte,html,css,json,yml}"

format-check:
	cd back && npx prettier --check "**/*.{js,ts,json,yml}"
	cd front && npx prettier --check "**/*.{js,ts,svelte,html,css,json,yml}"

install:
	rm -rf .vite node_modules package-lock.json back/node_modules front/node_modules && npm install

upgrade:
	cd back && npx ncu -u
	cd front && npx ncu -u
	${MAKE} install

list-routes:
	cd back && node ace list:routes

db-fresh:
	set -a && source back/.env && set +a && docker compose exec -T backend node ace migration:fresh
	set -a && source back/.env && set +a && docker compose exec -T backend node ace migration:fresh --connection=logs

db-migrate:
	set -a && source back/.env && set +a && docker compose exec -T backend node ace migration:run
	set -a && source back/.env && set +a && docker compose exec -T backend node ace migration:run --connection=logs

db-seed:
	set -a && source back/.env && set +a && docker compose exec -T backend node ace db:seed

init-logs-db:
	./init-logs-db.sh

db: init-logs-db db-fresh db-seed

stop:
	set -a && source back/.env && set +a && docker compose down --remove-orphans

up:
	${MAKE} stop && set -a && source back/.env && set +a && docker compose up -d --build

rm:
	set -a && source back/.env && set +a && docker compose down --volumes --remove-orphans

start: install rm up db

prune:
	docker system prune -f
