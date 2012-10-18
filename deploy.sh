#!/bin/bash

DIST_PATH=dist/opendarts-2.0-SNAPSHOT.zip

# Build application
echo "Build Application"
rm $DIST_PATH
play dist

# Github
echo "Push to Github"
git push origin master
git push origin develop

# Deploy on Heroku
echo "Push & Deploy to Heroku"
git push heroku master

# Deploy on CouldFoundry
echo "Deploy on CouldFoundry"
vmc update opendarts --path=$DIST_PATH

# Deploy on CloudBees
echo "Push & Deploy to CloudBees"
git push cloudbees master 
bees app:deploy -a ilaborie/opendarts2-2 -t play2 $DIST_PATH

# TODO Deploy onJelastic

# TODO Google App Engine

## Links
echo "Heroku: http://opendarts.herokuapp.com/"
echo "CouldFoundry: http://opendarts.cloudfoundry.com/"
echo "CloudBees: http://opendarts2-2.ilaborie.cloudbees.net/"