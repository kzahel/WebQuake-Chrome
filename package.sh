rm package.zip

zip package.zip -r manifest.json *.png *.js *.html WebQuake-async/Client

#zip package.zip -r manifest.json *.png *.js *.html WebQuake/Client web-server-chrome/*.js

#zip package.zip -r * -x package.sh -x *.git* -x "*.*~" -x web-server-chrome/manifest.json -x web-server-chrome/*.png -x WebQuake/Server/* WebQuake/Server/id1/*

#web-server-chrome/*.js *.html *.js manifest.json WebQuake/* WebQuake/Client/* WebQuake/Client/id1/* WebQuake/Client/WebQuake/* *.png
