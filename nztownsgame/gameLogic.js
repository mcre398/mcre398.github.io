let requestURL = 'https://mcre398.github.io/data/nztowns.json';
let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
let towns;
request.onload = function() {
    towns = request.response['towns'];
}

let numCorrect = 0;

String.prototype.RemoveApostrophes = function() {
    return this.replace(/'/g,'');
}

function checkInput() {
    let input = document.getElementById('townInput').value.RemoveApostrophes();
    const townObject = towns.find(town => town.name.toLowerCase() === input.toLowerCase());
    if (!(townObject==null) && !townObject.isFound) {
        townObject.isFound = true;
        clearInputBox();
        flashTick();
        addMarker(townObject);
        incrementScore();
        addToList(townObject.name);
    }
}

function clearInputBox() {
    document.getElementById('townInput').value = '';
}

function flashTick() {
    document.getElementById('tick').style.visibility = 'visible';
    setTimeout(() => {
        document.getElementById('tick').style.visibility = 'hidden';
    }, 1000);
}

function addMarker(townObject) {
    const lngLat = [(townObject.long<100)?townObject.long+100:townObject.long, townObject.lat];
    const popup = new mapboxgl.Popup({
        closeButton: false
    });
    popup.setLngLat(lngLat).setHTML(generateDescription(townObject));
    const marker = new mapboxgl.Marker({
        color: '#5E9E3E'
    }).setLngLat(lngLat).setPopup(popup);
    marker.addTo(map);
}

function generateDescription(townObject) {
    return `<p class='popup'>${townObject.name}</p>`;
}

function incrementScore() {
    document.getElementById('score').innerHTML = `You have named ${++numCorrect} ${numCorrect > 1 ? 'towns/cities' : 'town/city'}!`;
}

function addToList(town) {
    var node = document.createElement("LI");
    var textnode = document.createTextNode(town);
    node.appendChild(textnode);
    document.getElementById("foundTowns").appendChild(node);
}