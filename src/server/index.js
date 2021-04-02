require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// API Calls
const roverNames = ['curiosity', 'opportunity', 'spirit']


// Get mission data for each rover
const getRoverData = (rovers) => {
  rovers.forEach(rover => {
    app.get(`/${rover}` , async (req, res) => {
      try {
        let roverData = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${process.env.API_KEY}`)
          .then(res => res.json())
        res.send({ roverData })
      } catch (err) {
        console.log('error:', err);
      }
    })
  })
}

// Get latest photos for each rover
const getRoverPhotos = (rovers) => {
  rovers.forEach(rover => {
    app.get(`/${rover}/photos`, async (req, res) => {
      try {
        let roverPhotos = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${process.env.API_KEY}`)
        .then(res => res.json())
        res.send({ roverPhotos })
      } catch (err) {
        console.log('error:', err);
      }
    })
  })
}

getRoverData(roverNames)
getRoverPhotos(roverNames)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))