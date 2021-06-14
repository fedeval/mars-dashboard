# Mars Dashboard 

## Introduction ##

This is a simple Single Page Application built using Node.js and Express which fetches data from the NASA Mars Rover Photos API and displays the latest picture taken by the NASA Rovers on Mars. I built this to practice Functional Programming concepts with vanilla JS as part of the [Intermediate Javascript Nanodegree](https://www.udacity.com/course/intermediate-javascript-nanodegree--nd032) on Udacity.

Note that only the Curiosity mission is still active so the Opportunity and Spirit pictures are taken from one of the final days for each mission where there were a good amount of pictures taken.

The app is live on https://mars-rovers-ph.herokuapp.com/, but below you can find instructions to get it up and running on your machine and should you want to build on top of it.

---
## Setup ##

The app relies on the NASA Open APIs, thus you will need to sign up for your own API key in order to run it on your machine. You can do so at https://api.nasa.gov/.

The `dotenv` package is already included in the app dependencies, so it is only necessary to create a `.env` file in the root folder with an API_KEY variable like so:

```
API_KEY=YOUR_KEY_HERE
```

**IMPORTANT: .env should be added to .gitignore and never committed to a public repo.**

---
## Getting Started ##

### Installing dependencies ###

After cloning the repo, all the project dependencies can be installed using yarn:

```
yarn install
```
### Executing the code ###

To execute the code use the following command in terminal:

```
yarn start
```

the app will then be available on port 3000 by default. Alternatively you can set a PORT environment variable of your choide in the `.env` file.

---
### Above and Beyond

The NASA API has a lot more data to offer than what I used here. Look here (https://api.nasa.gov/ at the Browse API's section) to see all that's available.
