let store = Immutable.Map({
    rovers: Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
    selectedRover: '',
    roverMissionData: {},
    roverPhotos: []
})

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = store.merge(newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let rovers = state.get('rovers')
    return showNavigation(rovers) + showRoverInfo(state)
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS
const showNavigation = (rovers) => {
    return `
        <ul>
            ${rovers.reduce((acc, curr, i, roversList) => {
                return acc += `<li><button onclick="addRoverInfoToStore(store)" id=${roversList.get(i)}>${roversList.get(i)}</button></li>`  
            },'')}
        </ul>
    `
}

const showRoverInfo = (state) => {
    return `
        <div id="mission-data">
            ${showMissionInfo(state.get('roverMissionData'))}
        </div>
        <div id="photo-grid">
            ${showRoverPhotos(state.get('roverPhotos'))}
        </div>
    `
}

const showMissionInfo = (missionDataObj) => {
    return `
        <p>Launch Date: ${missionDataObj.launch_date}</p>
        <p>Landing Date: ${missionDataObj.landing_date}</p>
        <p>Mission status: ${missionDataObj.status}</p>
    `
}

const showRoverPhotos = (photoArray) => {
    return `
        ${photoArray.reduce((acc, curr) => acc += photoDiv(curr),'')}
    `
}

const photoDiv = (photoObj) => {
    return `
        <div class="photo">
            <img src=${photoObj.img_src} width="200" height="200">
            <p>Date: ${photoObj.earth_date}</p>
    `
}

// ------------------------------------------------------  API CALLS

// Example API call
const addRoverInfoToStore = async (state) => {
    const selectedRover = event.currentTarget.id
    const roverMissionData = await getMissionData(selectedRover)
    const roverPhotos = await getLatestPhotos(selectedRover)
    const newState = state
        .set('selectedRover', selectedRover)
        .set('roverMissionData', roverMissionData)
        .set('roverPhotos', roverPhotos)
    updateStore(state, newState)
}

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

const getLatestPhotos = async (rover) => {
    let latestPhotos = await fetch(`http://localhost:3000/${rover}/photos`)
        .then(res => res.json())
        .then((data) => {
            return data.roverPhotos.latest_photos.map(photo => ({img_src: photo.img_src, earth_date: photo.earth_date}))
        })
    return latestPhotos
}