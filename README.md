#Hybrid Mobile App Example v0.0.1

This is an example Hybrid App that we've been working through in the course that I am teaching.

I've posted it here so that students who missed a demo will have the same starting point as the rest of the class and so that there is always a version of it that they can go back to.

It currently just geolocates the user and then uses the Forecast.io API to retrieve weather data for the user and log it to the console.

I will push changes to this repository as we have more in-class demos.

##Instructions for Students

The following steps will be necessary to start using this repository:

1. Clone or download this repository to the desired location on your computer
2. `cd` into the directory where you've saved it
3. Run `bower install` to download the necessary dependencies
4. Edit `www/assets/js/index.js` and replace `[YOUR API KEY HERE]` with your actual API key
5. Run `cordova plugin add org.apache.cordova.geolocation` to allow access to the Geolocation API
6. If you'd like to develop and test some basic things in a regular browser environment, edit `www/assets/js/index.js` and replace `[default longitude here]` and `[default latitude here]` with a latitude and longitude you'd like to use

##Dependencies

* cordova
* bower
* Node