format:
	npx prettier --write "**/*.{js,ts,svelte,html,css,yml}"

upgrade:
	make upgrade-front && make upgrade-back && rm -rf .vite node_modules package-lock.json front/node_modules back/node_modules && npm install

upgrade-front:
	cd front && ncu -u

upgrade-back:
	cd back && ncu -u

install:
	rm -rf .vite node_modules package-lock.json front/node_modules back/node_modules && npm install

list-routes:
	cd back && node ace list:routes

db-fresh:
	docker compose exec -T backend node ace migration:fresh
	docker compose exec -T backend node ace migration:fresh --connection=logs

db-migrate:
	docker compose exec -T backend node ace migration:run
	docker compose exec -T backend node ace migration:run --connection=logs

db-seed:
	docker compose exec -T backend node ace db:seed

init-logs-db:
	./init-logs-db.sh

db: init-logs-db db-fresh db-seed

stop:
	docker compose down --remove-orphans

up:
	make stop && docker compose up -d --build

rm:
	docker compose down --volumes --remove-orphans

start: install rm up db

make prune:
	docker system prune -f
