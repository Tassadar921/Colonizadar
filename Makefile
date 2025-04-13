format: format-front format-back

format-front:
	cd front && npm run format

format-back:
	cd back && npm run format

list-routes:
	cd back && node ace list:routes

db-fresh:
	docker compose exec -T backend node ace migration:fresh

db-migrate:
	docker compose exec -T backend node ace migration:run

db-seed:
	docker compose exec -T backend node ace db:seed

db: db-fresh db-seed

stop:
	docker compose down --remove-orphans

up:
	make stop && docker compose up -d --build

start:
	docker compose down --volumes --remove-orphans && make up && make db

rm:
	make stop && docker system prune -f
