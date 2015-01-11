# HackTheDrive
Repo for the Hack the Drive hackathon

setup
=====

- clone the repo
- run 'git submodule init'
- run 'git submodule update'

- if you do not use heroku:
	- cd into bmwcontroller/www/
	- run 'bower install'
	- start a static http-server, e.g. 'python -m SimpleHTTPServer'
	- visit localhost:8000/index.html

- if you want to start the highscore server:
	- cd into GameServer/
	- run 'npm install'
	- run 'npm start'
