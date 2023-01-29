#!/usr/bin/env node

// Import packages
import moment from "moment-timezone";
import minimist from "minimist";
import fetch from "node-fetch";

const args = minimist(process.argv.slice(2));

//Handle help command
if("h" in args) {
    console.log(
`
Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
-h            Show this help message and exit.
-n, -s        Latitude: N positive; S negative.
-e, -w        Longitude: E positive; W negative.
-z            Time zone: uses tz.guess() from moment-timezone by default.
-d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
-j            Echo pretty JSON from open-meteo API and exit.
`
);
    process.exit(0);
}

//handle latitude and longitude for API
let latitude = undefined;
let longitude = undefined;
let timezone = moment.tz.guess();
const days = args["d"];

if ("n" in args){
    latitude = args["n"];
} else if ("s" in args){
    latitude = -args["s"];
}

if ("e" in args){
    longitude = ["e"];
} else if ("w" in args){
    longitude = -args["w"];
}

if (Math.abs(latitude)>90){
    console.log("Please put a valid latitude in");
    process.exit(0);
} 

if (Math.abs(longitude)>180){
    console.log("Please put a valid longitude");
    process.exit(0);
}

if ("t" in args){
    timezone = args["t"];
}

const request_url = 'https://api.open-meteo.com/v1/forecast?latitude='+latitude+'&longitude='+longitude+'&daily=precipitation_hours&current_weather=true&timezone=' + timezone;
const response = await fetch(request_url);

const data = await response.json();

// If JSON flags print all JSON, exit
if("j" in args) {
    console.log(data);
    process.exit(0);
}

//Days

if (days == 0) {
    console.log("At coordinates: (" + latitude + ", " + longitude + "), it will rain " + data["daily"]["precipitation_hours"][0] + " hours today.`\n");
} else if (days > 1) {
    console.log("At coordinates: (" + latitude + ", " + longitude + "), it will rain " + data["daily"]["precipitation_hours"][0] + " hours in " + days + " days.\n");
} else {
    console.log("At coordinates: (" + latitude + ", " + longitude + "), it will rain " + data["daily"]["precipitation_hours"][0] + " hours tomorrow.\n");
}