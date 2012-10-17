#!/bin/bash

DIST_PATH=dist/opendarts-2.0-SNAPSHOT.zip

# Build application
rm $DIST_PATH
play dist

# Github
git push origin master
git push origin develop

# Deploy on Heroku
git push heroku master

# Deploy on CouldFoundry
vmc update opendarts --path=$DIST_PATH

# Deploy on CloudBees
git push cloudbees master 
#bees app:deploy -ep eu -a ilaborie/opendarts2-2 -t play2 $DIST_PATH
play cloudbees-deploy

# TODO Deploy onJelastic

# TODO Google App Engine

