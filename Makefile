ts    != date +"%Y-%m-%d-%H%M%S"
dst    = .backup/$(ts)
src    = js index.html css
vers   = js/libs/version.js

all: backup
	@echo var VERSION = \"$(ts)\" > $(vers);
	./mksingleton.pl index.html

backup:
	mkdir -p $(dst)
	cp -pRP $(src) $(dst)/



