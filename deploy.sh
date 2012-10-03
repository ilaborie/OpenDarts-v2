#!/bin/bash

# Heroku
git push heroku master

# CloudBees
# git push cloudbees master 

# Jelastic

# Google App Engine

# CouldFoundry
play dist
vmc update opendarts --path=dist/opendarts-2.0-SNAPSHOT.zip
