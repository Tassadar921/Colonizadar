format: format-front format-back

format-front:
	cd front && npm run format

format-back:
	cd back && npm run format

start:
	gnome-terminal --tab --title="front" -- zsh -c "cd front && npm run dev; exec zsh" & \
    exec gnome-terminal --tab --title="back" -- zsh -c "cd back && npm run dev; exec zsh"

list-routes:
	cd back && node ace list:routes

db:
	cd back && node ace migration:fresh && node ace db:seed
