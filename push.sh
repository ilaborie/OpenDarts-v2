#!/usr/bin/sh
git push heroku master
play dist
vmc push --path=dist/opendarts-2.0-SNAPSHOT.zip --runtime=java7
