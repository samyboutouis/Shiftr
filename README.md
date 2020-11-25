# Shifter


### Local Development
1. Using docker-compose
  * `docker-compose build` - builds the images. This must be run if we install more npm packages
  * `docker-compose up` - starts the containers (react, express, mongo)
  * `docker-compose down` - tears down  the containers, run this when done
  * `docker-compose exec servicename bash` - give you a bash shell in your selected container replace *servicename* with service, e.g. react, express, mongo. 
  * `docker-compose logs -f servicename` - attach terimal to log output of a service

2. Notes and GOTCHAS
  * note that all environment variables for **REACT** **MUST** be prefixed with `REACT_APP`
  * adding an npm package
    1. start the continaer and run `docker-compose exec servicename bash`
    2. you now have bash shell inside the container. run `npm install yourPackage --save`
    3. `exit`
    4. Pro Tip: Download Mongo Compass and use that to view/interact with the DB. 
    5. you're now outside the container, stop, build, and start the container 


### App Structure
* `express` - this directory contains your express app. This is your backend (models, controllers).
* `mongo` - this directory is where you should put any files you want to run directly in the db
* `mongo_data` - git ignored, this is where you db data is stored/mounted
* `react` - this directory contians youre react app. This is your Frontend(views).
* `docker-compose.yml` - defines the docker ecosystem needed to run the app. 


### Deployment
* TODO - openshift?