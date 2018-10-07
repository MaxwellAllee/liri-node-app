require("dotenv").config();
var fs = require("fs");
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var request = require("request");
var moment = require('moment');
var lineBreak = "--------------------------------------\r\n"
var service = process.argv[2]
var whatWant = ""
for (let index = 3; index < process.argv.length; index++) {
    if (index !== 3) { whatWant += " "; }
    whatWant += process.argv[index];
}
var printThis = ""
var printThisTot =""
var inpt = whatWant
whatWant = encodeURI(whatWant)
fs.appendFile("log.txt", "$ node liri.js " +service+" "+ inpt + "\r\n", function (err) {
    if (err) {
        return console.log(err);
    }
});
check()
function check() {
    //console.log (whatWant)

    switch (service) {
        case "movie-this":
            mvie();
            break;
        case "concert-this":
            cncert();
            break;
        case "spotify-this-song":
            sptify();
            break;
        case "do-what-it-says":
            doit()
            break;
    }
}
function sptify() {
    var track = whatWant
    if (whatWant === "") {
        track = "the%20sign"
    }
    spotify
        .search({ type: 'track', query: track, limit: "20" })
        .then(function (response) {
            theReturn = response.tracks.items
            for (let i = 0; i < theReturn.length; i++) {
                var art = "Artist(s): " + theReturn[i].album.artists[0].name
                var sng = "Song Name: " + theReturn[i].name
                var lnk = "Link to Song: " + theReturn[i].album.external_urls.spotify
                var albm = "Album: " + theReturn[i].album.name
                var thisCount= i+1
                printThis= thisCount + "\r\n" + art + "\r\n" + sng + "\r\n" + lnk + "\r\n" + albm + "\r\n" + "" + lineBreak
                console.log(printThis)
                printThisTot = printThisTot.concat(printThis)
            }
            fs.appendFile("log.txt",printThisTot, function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        })
        .catch(function (err) {
            console.log(err);
        });


}
function mvie() {
    if (whatWant === "") {
        whatWant = "Mr. Nobody"
    }
    var movie = whatWant
    
    request("http://www.omdbapi.com/?t=" + movie + "=&plot=short&apikey=trilogy", function (error, response, body) {
        if (!error && response.statusCode === 200) {

            var ttl = "Title: " + JSON.parse(body).Title
            var yr = "Year: " + JSON.parse(body).Year
            var mdb = "IMDB Rating: " + JSON.parse(body).Ratings[0].Value
            var rtm = "Rotten Tomato Rating: " + JSON.parse(body).Ratings[1].Value
            var cntry = "Country: " + JSON.parse(body).Country
            var lngge = "Language: " + JSON.parse(body).Language
            var plt = "Plot: " + JSON.parse(body).Plot
            var ctrs = "Actors: " + JSON.parse(body).Actors
            printThis=ttl + "\r\n" + yr + "\r\n" + mdb + "\r\n" + rtm + "\r\n" + cntry + "\r\n" + lngge + "\r\n" + plt + "\r\n" + ctrs + "\r\n"
            console.log(printThis)
            fs.appendFile("log.txt", printThis  + lineBreak, function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        }
    })
}
function cncert() {
    var artist = whatWant
    if (whatWant === "") {
        artist = "oar"
    }
    
    
    request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=28712c353ec64645faae102f822be11c", function (error, response, body) {
        if (!error && response.statusCode === 200) {
            body = JSON.parse(body)
            console.log("Upcoming concerts for "+inpt+": " )
            for (let i = 0; i < body.length; i++) {
                var vnm= body[i].venue.name
                var vct= body[i].venue.city
                var stt= body[i].venue.region
                var dttm = moment(body[i].datetime, "YYYY-MM-DD").format("MM/DD/YY")
                printThis = vct+","+ stt + " at "+ vnm + " "+ dttm + "\r"
                console.log(printThis)
                printThisTot = printThisTot.concat(printThis)
               
            }
            
            fs.appendFile("log.txt",  printThisTot + lineBreak, function (err) {
                if (err) {
                    return console.log(err);
                }
            });
            

        }
    })
}
function doit() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        var holder = data.split(",");
        service = holder[0]
        whatWant = holder[1]
        check()
    })
}
