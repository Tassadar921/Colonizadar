SHELL := /bin/bash

# Helper for sourcing back/.env
define SOURCE_ENV
set -a && source back/.env && set +a
endef

format:
	cd back && npx prettier --write "**/*.{js,ts,json,yml}"
	cd front && npx prettier --write "**/*.{js,ts,svelte,html,css,json,yml}"

format-check:
	cd back && npx prettier --check "**/*.{js,ts,json,yml}"
	cd front && npx prettier --check "**/*.{js,ts,svelte,html,css,json,yml}"

install:
	rm -rf .vite node_modules package-lock.json back/node_modules front/node_modules
	npm install

upgrade:
	cd back && npx ncu -u
	cd front && npx ncu -u
	${MAKE} install

list-routes:
	cd back && node ace list:routes

db-fresh:
	$(SOURCE_ENV) && docker compose exec -T backend node ace migration:fresh
	$(SOURCE_ENV) && docker compose exec -T backend node ace migration:fresh --connection=logs

db-migrate:
	$(SOURCE_ENV) && docker compose exec -T backend node ace migration:run
	$(SOURCE_ENV) && docker compose exec -T backend node ace migration:run --connection=logs

db-seed:
	$(SOURCE_ENV) && docker compose exec -T backend node ace db:seed

init-logs-db:
	./init-logs-db.sh

db: init-logs-db db-fresh db-seed

stop:
	$(SOURCE_ENV) && docker compose down --remove-orphans

up:
	${MAKE} stop
	$(SOURCE_ENV) && docker compose up -d --build

rm:
	$(SOURCE_ENV) && docker compose down --volumes --remove-orphans

start: install rm up db

prune:
	docker system prune -f

build-prod:
	# Temporary persisted directories creation
	mkdir -p back/.persist
	[ -d back/build/public ] && cp -r back/build/public back/.persist/public || true
	[ -d back/build/static ] && cp -r back/build/static back/.persist/static || true

	# Backend build
	cd back && \
	npm install && \
	npm run build && \
	cp .env build/.env && \
	cd build && \
	npm install --omit=dev

	# Persisted directories restoration
	[ -d back/.persist/public ] && cp -r back/.persist/public back/build/ || true
	[ -d back/.persist/static ] && cp -r back/.persist/static/* back/build/static/ || true

	# Fixture clearing
	mkdir -p back/build/static
	cp -r back/static/* back/build/static/

	# Clear temporary persisted directories
	rm -rf back/.persist

	# Frontend build
	cd front
	npm install
	npm run build

migrate-prod:
	cd back
	node ace migration:run
	node ace migration:run --connection=logs

start-prod:
	pm2 describe colonizadar > /dev/null
	pm2 restart colonizadar || pm2 start back/build/bin/server.js --name colonizadar

deploy: build-prod migrate-prod start-prod
