//where to put require statements
require("dotenv").config();

const fs = require("fs");
// need the ability for the user to iput some text
let userCommand = process.argv[2];
// console.log(userCommand);
let userInput =  process.argv.slice(3).join(" ");

// for spotify key
const Spotify = require("node-spotify-api");
// need for keys
const keys = require("./keys");
// need for axios requests
const axios = require("axios");
// need for moment
const moment = require("moment");

var spotify =  new Spotify(keys.spotify);
// var mov = new moves(keys.move);

// console.log(userInput);

//need to set up cases for the userCommand variable
if (userCommand === "") {
  console.log("Please enter a command");
} else if (userCommand === "concert-this") {
  concert(keys.concrt);
} else if (userCommand === "spotify-this-song"){
  //spotify-this-song
  spot();
} else if (userCommand === "movie-this"){
  //movie-this
  movie();
} else if (userCommand === "do-what-it-says"){
  //do-what-it-says
  command();
}


function concert() {
  axios.get("https://rest.bandsintown.com/artists/"+ userInput +"/events?app_id=" + keys.concrt).
  then(function(response){
    for (var i = 0; i < response.data.length; i++){
    var newTime = moment(response.data[i].datetime).format("MM DD YYYY")
    // console.log(response.data[i]); //only doing one right now so that console does not overload
    // console.log(newTime)
    console.log(
`
----------------
Name: ${response.data[i].venue.name}
Location: ${response.data[i].venue.city}, ${response.data[i].venue.region}, ${response.data[i].venue.country}
Concert Date: ${newTime}
----------------
`
    )
    }
    }).catch(function (error){
      console.log(error);
    });
  // name of the venue
  // venue location
  // date of the event (use moment to format this as MM/DD/YYYY)
};


function spot() {
  if (userInput === ""){
  
  spotify.request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE')
  .then(function(data){
    // console.log(Object.keys(data));
    console.log(
`
----------------
Artist(s): ${data.artists[0].name}
Track: ${data.name}
Album: ${data.album.name}
Preview Link: ${data.preview_url}
----------------
`
);
      // console.log(data.tracks.items[0].preview_url);
      // console.log(data.tracks.items[0].name);
      // console.log(data.tracks.items[0].album.name);
      // console.log(data.tracks.items[0].artists[0].name);
    }
  )} else {
  
  spotify.search({ type: 'track', query: userInput, limit: 20}, function(err, data) {
    if (err) {
      console.log("Error: " + err);
    } else {
      for (var i = 0; i < data.tracks.items.length; i++){
      console.log(
`
----------------
Artist(s): ${data.tracks.items[i].artists[0].name}
Track: ${data.tracks.items[i].name}
Album: ${data.tracks.items[i].album.name}
Preview Link: ${data.tracks.items[i].preview_url}
----------------
`
);
        } 
      }
    })
  }
  // artist(s)
  // the song's name
  // a preview link of the song from spotify
  // the album that the song is from
  // if no song is provided, default to "the sign" by ace of base
}

function movie() {
  // console.log(userInput + "3");
  if (userInput === ""){
    axios.get("http://www.omdbapi.com/?t=Mr.Nobody&apikey=trilogy").then(
    function(res){
      console.log(
`
----------------
Title: ${res.data.Title}
Release: ${res.data.Year}
IMDB Rating: ${res.data.imdbRating}
Rotten Tomatoes Rating: ${res.data.Ratings[1].Source}
Country: ${res.data.Country}
Language: ${res.data.Language}
Plot: ${res.data.Plot}
Actors: ${res.data.Actors}
----------------
`
      );
    })
  } else {
    let m = userInput.replace(/ /g,"+"); 
    console.log(m);
  axios.get("http://www.omdbapi.com/?t="+ m +"&apikey=trilogy").then(
    function(res){
      console.log(
`
----------------
Title: ${res.data.Title}
Release: ${res.data.Year}
IMDB Rating: ${res.data.imdbRating}
Rotten Tomatoes Rating: ${res.data.Ratings[1].Value}
Country: ${res.data.Country}
Language: ${res.data.Language}
Plot: ${res.data.Plot}
Actors: ${res.data.Actors}
----------------
`
      );
    }
  );
  // title of the movie
  // year the movie came out
  // imdb rating of the movie
  // rotten tomatoes rating of the movie
  // country where the movie was produced
  // language of the movie
  // plot of the movie
  // actors in the movie
  // if no movie is provided, default to Mr. Nobody
  }
}

function command() {
  console.log(userInput + "4");
  fs.readFile("random.txt", "utf8", function(err, data){
    let array = data.split(",")
    userInput = array[1];
    if (array[0] === "") {
      console.log("Please enter a command");
    } else if (array[0] === "concert-this") {
      concert(keys.concrt);
    } else if (array[0] === "spotify-this-song"){
      //spotify-this-song
      spot();
    } else if (array[0] === "movie-this"){
      //movie-this
      movie();
    } else if (array[0] === "do-what-it-says"){
      //do-what-it-says
      command();
    }
    
    console.log(array);
  });

  console.log("after calling readFile");
  // should run spotify-this-song for I want it that way
}
/*
app.js should be able to take these commands

concert-this
node liri.js concert-this <artist/band name here>
^^^ 
This will search the Bands in Town Artist Events API ("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp") for an artist and render the following information about each event to the terminal:

Name of the venue

Venue location

Date of the Event (use moment to format this as "MM/DD/YYYY")


spotify-this-song
node liri.js spotify-this-song '<song name here>'
^^^
This will show the following information about the song in your terminal/bash window

Artist(s)

The song's name

A preview link of the song from Spotify

The album that the song is from
If no song is provided then your program will default to "The Sign" by Ace of Base.

You will utilize the node-spotify-api package in order to retrieve song information from the Spotify API.

The Spotify API requires you sign up as a developer to generate the necessary credentials. You can follow these steps in order to generate a client id and client secret:
Step One: Visit https://developer.spotify.com/my-applications/#!/
Step Two: Either login to your existing Spotify account or create a new one (a free account is fine) and log in.
Step Three: Once logged in, navigate to https://developer.spotify.com/my-applications/#!/applications/create to register a new application to be used with the Spotify API. You can fill in whatever you'd like for these fields. When finished, click the "complete" button.
Step Four: On the next screen, scroll down to where you see your client id and client secret. Copy these values down somewhere, you'll need them to use the Spotify API and the node-spotify-api package.

movie-this
node liri.js movie-this '<movie name here>'
^^^
This will output the following information to your terminal/bash window:

  * Title of the movie.
  * Year the movie came out.
  * IMDB Rating of the movie.
  * Rotten Tomatoes Rating of the movie.
  * Country where the movie was produced.
  * Language of the movie.
  * Plot of the movie.
  * Actors in the movie.
If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
If you haven't watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/
It's on Netflix!
You'll use the axios package to retrieve data from the OMDB API. Like all of the in-class activities, the OMDB API requires an API key. You may use trilogy.

do-what-it-says
node liri.js do-what-it-says

Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
Edit the text in random.txt to test out the feature for movie-this and concert-this.
*/