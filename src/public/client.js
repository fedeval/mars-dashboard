let store = {
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    currentRover: '',
    roverMissionData: {},
    roverPhotos: {},
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { rovers } = state

    return showNavigation(rovers)
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS
const showNavigation = (rovers) => {
    return `
        <ul>
            <li><button id=${rovers[0]}>${rovers[0]}</button></li>  
            <li><button id=${rovers[1]}>${rovers[1]}</button></li>  
            <li><button id=${rovers[2]}>${rovers[2]}</button></li>
        </ul>
    `
}


// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))

    return data
}
