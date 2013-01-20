#!/bin/bash

DIST_PATH=dist/opendarts-2.0-SNAPSHOT.zip

# Build application
echo "Build Application"
rm $DIST_PATH
play dist

# Github
# https://github.com/ilaborie/OpenDarts-v2
echo "Push to Github"
git push origin master
git push origin develop

# Deploy on Heroku
# https://dashboard.heroku.com/apps/opendarts
echo "Push & Deploy to Heroku"
git push heroku master

# Deploy on CouldFoundry
# http://blog.cloudfoundry.com/2012/05/31/cloud-foundry-now-supports-play/
echo "Deploy on CouldFoundry (need a vmc login before)"
vmc push opendarts --path=$DIST_PATH

# Deploy on CloudBees
# https://run.cloudbees.com/a/ilaborie#app-manage/development:ilaborie/opendarts2-2
echo "Push & Deploy to CloudBees"
git push cloudbees master 
play cloudbees-deploy

# Build for Jelastic
# https://app.jelastic.dogado.eu/
echo "Build for Jelastic"
rm target/*.war
play package
mv target/opendarts*.war target/ROOT.war

# TODO Google App Engine

# TODO OpenShift https://github.com/opensas/play2-openshift-quickstart#readme

## Links
echo "Heroku: http://opendarts.herokuapp.com/"
echo "CouldFoundry: http://opendarts.cloudfoundry.com/"
echo "CloudBees: http://opendarts2-2.ilaborie.cloudbees.net/"
echo "Jelastic: should deploy manualy at https://app.jelastic.dogado.eu/"
