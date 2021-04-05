// Assign state to a store variable which is an immutable map
const store = Immutable.Map({
    rovers: Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
    selectedRover: '',
    roverMissionData: {},
    roverPhotos: [],
    isHomepage: true
})

// Add markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = store.merge(newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}

// Create content
const App = (state) => {
    let navigation = showNavigation(state.get('rovers'))
    return state.get('selectedRover') ? navigation + showRoverInfo(state) : navigation + showWeatherEmbed()
}

// Listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// COMPONENTS
// Show navigation buttons to select rover or homepage
const showNavigation = (rovers) => {
    return `
        <div id="buttons">
            <button id="home" onclick="setHomepageState(store)">Home</button>
            ${rovers.reduce((acc, curr, i, roversList) => {
                return acc += `<button onclick="addRoverInfoToStore(store)" id=${roversList.get(i)}>${roversList.get(i)}</button>`  
            },'')}
        </div>
    `
}

// Render homepage with weather embed
const setHomepageState = (state) => {
    const newState = state
        .set('selectedRover', '')
        .set('roverMissionData', {})
        .set('roverPhotos', [])
        .set('isHomepage', true)
    updateStore(state, newState)
}

const showWeatherEmbed = () => {
    return `
        <div id="weather-embed">
            <iframe src='https://mars.nasa.gov/layout/embed/image/mslweather/' width='100%' height='530'  scrolling='no' frameborder='0'></iframe>
        </div>
    `
}

// Higher order function returning the main html structure to display all rover info
// Calls two other functions to display mission data and photos
const showRoverInfo = (state) => {
    return `
        ${showMissionInfo(state.get('roverMissionData'), state.get('selectedRover'))}
        ${generateRoverPhotosGrid(state.get('roverPhotos'), insertPhotoIntoGrid)}
    `
}

// Display overview of mission data
const showMissionInfo = (missionDataObj, rover) => {
    return `
        <div id="mission-data">
            <img src="assets/images/${rover}.jpeg" alt="${rover} picture">
            <div id="mission-info">
                <h3><strong>${rover.toUpperCase()}</strong></h3>
                <p><strong>Launch:</strong> ${missionDataObj.launch_date}</p>
                <p><strong>Landing:</strong> ${missionDataObj.landing_date}</p>
                <p><strong>Status:</strong> ${missionDataObj.status}</p>
            </div>
        </div>
    `
}

/* Higher order function: 
 - Takes an array of photo objects and a function as arguments
 - Uses the function to reduce the array of objects into a grid of phot divs */
const generateRoverPhotosGrid = (photoArray, appendElementToGrid) => {
    return `
        <div id="photo-grid">
            ${photoArray.reduce((acc, curr) => appendElementToGrid(acc, curr),'')}
        </div>
    `
}

// Append a photo div including an image and the date on which it was taken to a grid
const insertPhotoIntoGrid = (grid, photoObj) => {
    return grid + `
        <div class="photo">
            <img src=${photoObj.img_src}>
            <p><strong>${photoObj.earth_date}</strong></p>
        </div>
    `
}

// API CALLS
// Call back-end APIs to update store with data for the rover selected on button click
const addRoverInfoToStore = async (state) => {
    const selectedRover = event.currentTarget.id
    const roverMissionData = await getMissionData(selectedRover)
    const roverPhotos = await getLatestPhotos(selectedRover)
    const newState = state
        .set('selectedRover', selectedRover)
        .set('roverMissionData', roverMissionData)
        .set('roverPhotos', roverPhotos)
        .set('isHomepage', false)
    updateStore(state, newState)
}

// Get mission information
const getMissionData = async (rover) => {
    let missionData = await fetch(`http://localhost:3000/${rover}`)
        .then(res => res.json())
        .then((data) => {
            return (({launch_date, landing_date, status}) => ({
                launch_date,
                landing_date,
                status
            }))(data.roverData.photo_manifest);
        })
    return missionData
}

// Get latest photos
const getLatestPhotos = async (rover) => {
    let latestPhotos = await fetch(`http://localhost:3000/${rover}/photos`)
        .then(res => res.json())
        .then((data) => {
            if (rover.toLowerCase() === 'curiosity') {
                return data.roverPhotos.latest_photos.map(photo => ({img_src: photo.img_src, earth_date: photo.earth_date}))
            }
            // Opportunity and Spirit API calls return an object where photos is the right key rather than latest_photos
            return data.roverPhotos.photos.map(photo => ({img_src: photo.img_src, earth_date: photo.earth_date}))
        })
    return latestPhotos
}