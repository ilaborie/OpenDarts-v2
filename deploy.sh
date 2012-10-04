#!/bin/bash
git push heroku master
play dist
vmc update opendarts --path=dist/opendarts-2.0-SNAPSHOT.zip
