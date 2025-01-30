.PHONY: format format-front format-back

format: format-front format-back

format-front:
	cd front && npm run format

format-back:
	cd back && npm run format
