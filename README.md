node-screenshot
===============

This is a WIP app to take screenshots with a node-webkit application. The screenshots themeselves are taken from an external command line program.

TODO:
------------
- [x] Create proof of concept
- [x] Custom Event Binding when window is closed
- [x] Find/Create Windows CLI program with appropriate license
- [x] Organize code into event based system
- [x] Create settings UI
- [x] Hide initial UI to tray.
- [x] Setup template system for HAPI server
- [ ] Find/Create Linux/Mac CLI program with appropriate license
- [ ] Add additional popup dialog for progress and status after uploaded
- [ ] Add RethinkDB database layer for data storage
- [ ] Add Authentication with user groups to server
- [ ] Add Public/Team/Private/Password Screenshot privacy settings
- [ ] Clientside settings
- [ ] Fix capture box draw math
- [ ] Fix screenshot crop math
- [ ] Add Screenshot overview / team view / user view
- [ ] Add more featurecreep

Installation:
------------

Make sure you have Node-Webkit installed. You need to run ``npm install`` on both the client and the server folder to setup the required modules.



Credit:
------------
Windows screenshot cli app: https://code.google.com/p/screenshot-cmd/

