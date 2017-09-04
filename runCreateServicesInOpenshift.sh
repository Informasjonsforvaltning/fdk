#!/usr/bin/env bash

#Installation script for creating services on Openshift

oc new-app dcatno/registration:latest
oc new-app dcatno/registration-auth:latest
oc new-app dcatno/registration-api:latest
oc new-app dcatno/registration-validator:latest
oc new-app dcatno/nginx:latest
oc new-app dcatno/gdoc:latest

oc expose dc/registration-api --port=8080
oc expose dc/registration-auth --port=8080
oc expose dc/registration --port=4200
oc expose dc/nginx --port=443
oc expose dc/gdoc --port=8080