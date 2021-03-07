all:
	@echo "Not all!"

up:
	@docker-compose up

start:
	@npm install
	@npm run build
	@npm start