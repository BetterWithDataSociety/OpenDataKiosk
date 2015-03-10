
# open-data-kiosk

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.11.1.

Specifically, the project uses https://www.npmjs.com/package/generator-cg-angular to generate a modular angular app.

## Build & development

Run `grunt` for building and `grunt serve` for preview.


## Adding a new plugin

nvm use v0.12.0
yo cg-angular:partial -nameOfView, eg airMap-
vi index.html 


## Testing

Running `grunt test` will run the unit tests with karma.


Extra dev notes

see http://yeoman.io/

After getting your environment up (usually)

npm install -g yo bower grunt-cli gulp

and checking out the project with

git clone git@github.com:BetterWithDataSociety/OpenDataKiosk.git

Install dependencies using

npm install

Use

grunt serve

to start the app

grunt 

on its own should package up the app into the dist folder


# Creating new modules

yo cg-angular:module newModule

for example

yo cg-angular:module AirMap



https://docs.angularjs.org/tutorial/step_07




# To Deploy

grunt build
grunt buildcontrol:pages
