let huts;

async function loadHuts() {
    const response = await fetch('https://mcre398.github.io/data/huts.json');
    huts = await response.json();
}

let numCorrect = 0;


String.prototype.RemoveApostrophes = function() {
    return this.replace(/'/g,'');
}

String.prototype.matches = function(other) {
    if (this.toLowerCase().trim() === other.toLowerCase().trim()) {
        return true;
    }
    else if (this.toLowerCase().includes('bivvy')) {
        const chopped = this.toLowerCase().trim().substring(0,this.length-6);
        if (other.toLowerCase().trim() === chopped + " biv") {
            return true;
        }
    }
    return false;
}

function checkInput() {

    let input = document.getElementById('hutInput').value.RemoveApostrophes();
    const hutObject = huts.find(hut => hut.name.matches(input));
    if (!(hutObject==null) && !hutObject.isFound) {
        hutObject.isFound = true;
        clearInputBox();
        flashTick();
        addMarker(hutObject);
        incrementScore();
        addToList(hutObject.name);
    }
}

function clearInputBox() {
    document.getElementById('hutInput').value = '';
}

function flashTick() {
    document.getElementById('tick').style.visibility = 'visible';
    setTimeout(() => {
        document.getElementById('tick').style.visibility = 'hidden';
    }, 1000);
}

function addMarker(hutObject) {
    const lngLat = [hutObject.lon, hutObject.lat];
    const popup = new mapboxgl.Popup({
        closeButton: false
    });
    popup.setLngLat(lngLat).setHTML(generateDescription(hutObject));
    const color = getColor(hutObject);
    const marker = new mapboxgl.Marker({
        color: color
    }).setLngLat(lngLat).setPopup(popup);
    marker.addTo(map);
}

function getColor(hutObject) {
    switch (getType(hutObject).toLowerCase()) {
        case 'hut':
            return '#5E9E3E';
        case 'bivvy':
            return '#EBA628';
        case 'lodge':
            return '#5BC0EB';
        default:
            return '#5E9E3E';
    }
}

function getType(hutObject) {
    const type = hutObject.name.split(' ').pop();
    return type;
}

function generateDescription(hutObject) {
    return `<p class='popup'>${hutObject.name}</p>`;
}

function incrementScore() {
    document.getElementById('score').innerHTML = `You have named ${++numCorrect}/988 huts!`;
}

function addToList(hut) {
    var node = document.createElement("LI");
    var textnode = document.createTextNode(hut);
    node.appendChild(textnode);
    document.getElementById("foundHuts").appendChild(node);
}