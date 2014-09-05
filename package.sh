rm package.zip

zip package.zip -r * -x package.sh -x *.git* -x "*.*~" -x web-server-chrome/manifest.json -x web-server-chrome/*.png

#web-server-chrome/*.js *.html *.js manifest.json WebQuake/* WebQuake/Client/* WebQuake/Client/id1/* WebQuake/Client/WebQuake/* *.png
