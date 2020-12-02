#!/bin/bash
./wait_for_it.sh mongo:27017 -t 60 #wait max 60 seconds for database to start
npm start