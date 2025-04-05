format: format-front format-back

format-front:
	cd front && npm run format

format-back:
	cd back && npm run format

stop:
	docker compose down --remove-orphans

up:
	make stop && docker compose up -d --build

remove:
	make stop && docker system prune -f

list-routes:
	cd back && node ace list:routes

db-migrate:
	docker compose exec -T backend node ace migration:fresh

db-seed:
	docker compose exec -T backend node ace db:seed

db: db-migrate db-seed
