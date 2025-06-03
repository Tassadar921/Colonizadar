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

install-prod:
	cd back && npm install --production
	cd front && npm install

build-prod:
	# Temporary persisted directories creation
	mkdir -p back/.persist
	if [ -d back/build/public ]; then cp -r back/build/public back/.persist/public; fi
	if [ -d back/build/static ]; then cp -r back/build/static back/.persist/static; fi

	# Backend build
	cd back && npm run build && cp .env build/.env && cd build && npm install --omit=dev

	# Persisted directories restoration
	if [ -d back/.persist/public ]; then cp -r back/.persist/public back/build/; fi
	if [ -d back/.persist/static ]; then cp -r back/.persist/static/* back/build/static/ || true; fi

	# Fixture clearing
	mkdir -p back/build/static && cp -r back/static/* back/build/static/

	# Clear temporary persisted directories
	rm -rf back/.persist

	# Frontend build
	cd front && npm run build

migrate-prod:
	cd back && node ace migration:run && node ace migration:run --connection=logs

start-prod:
	pm2 start back/build/bin/server.js --name colonizadar -f

deploy: install-prod build-prod migrate-prod start-prod
