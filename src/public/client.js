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

const render = async (root, state) => root.innerHTML = App(fullPageHtml, state)


/* Higher order function:
- Take state and generator function  with the HTML markup for the page
- Use generator function to return the right markup for the current state */
const App = (pageHtmlGenerator, state) => pageHtmlGenerator(state)

// Listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ----- FULL PAGE ------
const fullPageHtml = (state) => {
    let rover = state.get('selectedRover')
    const navigation = showNavigation(state.get('rovers'))
    if (rover) {
        return navigation.concat(missionInfo(state.get('roverMissionData'), rover), photosGrid(state.get('roverPhotos')))
    }
    return navigation.concat(homepageHtml())
weatherDataObj}

// ----- COMPONENTS ------
// Show navigation buttons to select rover or homepage
const showNavigation = (rovers) => {
    return `
        <div id="buttons">
            <button id="home" onclick="setHomepageState(store)">Home</button>
            ${rovers.reduce((acc, curr) => appendHtmlElementToString(acc, buttonHtml, curr),'')}
        </div>
    `
}

// Homepage infographics
const homepageHtml = (rovers) => {
    return ''
}

// Display overview of mission data
const missionInfo = (missionDataObj, rover) => {
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

// Generate photo grid from array of objects with photo metadata
const photosGrid = (photoArray) => {
    return `
        <div id="photo-grid">
            ${photoArray.reduce((acc, curr) => appendHtmlElementToString(acc, photoDivHtml, curr),'')}
        </div>
    `
}

/* Higher order function: 
 - Takes an HTML string, an HTML generator function and some data
 - Calls the generator function to create a new HTML element which is then concatenated to the HTML string */
const appendHtmlElementToString = (htmlString, baseHtmlGenerator, elementData) => htmlString.concat(baseHtmlGenerator(elementData))

// Generates the HTML for a button component
const buttonHtml = (buttonData) => `<button onclick="addRoverInfoToStore(store)" id=${buttonData}>${buttonData}</button>`

// Generates the HTML for a photo div component
const photoDivHtml = (photoData) => {
    return `
        <div class="photo">
            <img src=${photoData.img_src}>
            <p><strong>${photoData.earth_date}</strong></p>
        </div>
    `
}

// Render homepage with rover infographics
const setHomepageState = async (state) => {
    const newState = state
        .set('selectedRover', '')
        .set('roverMissionData', {})
        .set('roverPhotos', [])
        .set('isHomepage', true)
    updateStore(state, newState)
}

// ------ API CALLS ------
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