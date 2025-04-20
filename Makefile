format: format-front format-back

format-front:
	cd front && npm run format

format-back:
	cd back && npm run format

upgrade:
	make upgrade-front && make upgrade-back && rm -rf node_modules package-lock.json front/node_modules back/node_modules && npm install

upgrade-front:
	cd front && ncu -u

upgrade-back:
	cd back && ncu -u

install:
	rm -rf node_modules package-lock.json front/node_modules back/node_modules && npm install

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

rm:
	docker compose down --volumes --remove-orphans

start:
	make install && make rm && make up && make db

make prune:
	docker system prune -f
