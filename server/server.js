const express = require('express')
const cors = require('cors')
const spotifyWebApi = require('spotify-web-api-node')
const {Client} = require("@googlemaps/google-maps-services-js");


const app = express()
const port = 8001

app.use(cors()) // To handle cross-origin requests
app.use(express.json()); // To parse JSON bodies

const credentials = {
  clientId: '91c83bb764d443b2b5d0a0cc9c53f7c7',
  clientSecret: 'b256a1ffc18c4012a3a07e7820bf2278',
  redirectUri: 'http://localhost:8000/',
};

var fs = require("fs");
var text = fs.readFileSync("./filtered_loc.dat");
var textByLine = text.toString().split("\n")

app.get('/', (req, res) => {
  let spotifyApi = new spotifyWebApi(credentials)
  spotifyApi.clientCredentialsGrant().then((data) => {
      res.json({
          accessToken : data.body.access_token,
      }) 
  })
  .catch((err) => {
      console.log(err);
      res.sendStatus(400)
  })
})

app.get('/location', (req, res) => {
  const artist = req.query.artist
  const artistIndex = textByLine.findIndex(line => {
    if (line.includes(artist)) {
      return true;
    }
  });
  line = textByLine.slice(artistIndex,artistIndex+1)
  const adress = line.toString().split("<sep>").slice(-1);
  const location = adress.toString().replace(/\s+/g, '+');

  const client = new Client({});
  client
  .geocode({
    params: {
      address: location,
      key: 'AIzaSyDG5tHtU1r_kJk-mLDO_AkPpJhfivUq2_c'
    },
  })
  .then(data => {
    res.json({
      location : data.data.results[0].geometry.location,
      city : adress.toString().split(',').slice(0,1)
    }) 
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(400)
  });
  console.log('succes')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})