let n = 5;
let menList = [];
let womenList = [];
for (let i = 1; i <= n; i++) {
    menList.push({
        num: i,
        nameElement: document.getElementById(`m${i}name`),
        descriptorElement: document.getElementById(`m${i}desc`)
    });
    womenList.push({
        num: i,
        nameElement: document.getElementById(`w${i}name`),
        descriptorElement: document.getElementById(`w${i}desc`)
    });
}

let startTime = document.getElementById("startTime");
let roundNumber = document.getElementById("roundNumber");
let prompt = document.getElementById("prompt");
let messageList = document.getElementById("messageList");

function generateText() {
    messageList.innerHTML = "";

    let minsToAdd = 14 * (roundNumber.value - 1);
    // Taken from https://stackoverflow.com/questions/17446466/add-15-minutes-to-string-in-javascript
    let newTime = new Date(new Date("1970/01/01 " + startTime.value).getTime() + minsToAdd * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    let filteredMenList = menList
        .filter(manObject => manObject.nameElement.value)
        .map(manObject => {
            return {
                name: manObject.nameElement.value,
                descriptor: manObject.descriptorElement.value,
                isBreakRound: false
            }
        });
    let filteredWomenList = womenList
        .filter(womanObject => womanObject.nameElement.value)
        .map(womanObject => {
            return {
                name: womanObject.nameElement.value,
                descriptor: womanObject.descriptorElement.value,
                isBreakRound: false
            }
        });

    if (filteredMenList.length < filteredWomenList.length) {
        let diff = filteredWomenList.length - filteredMenList.length;
        for (let i = 0; i < diff; i++) {
            filteredMenList.push({
                isBreakRound: true
            });
        }
    } else if (filteredWomenList.length < filteredMenList.length) {
        let diff = filteredMenList.length - filteredWomenList.length;
        for (let i = 0; i < diff; i++) {
            filteredWomenList.push({
                isBreakRound: true
            });
        }
    }

    // Rotate women list.
    filteredWomenList = filteredWomenList.slice(roundNumber.value - 1, filteredWomenList.length).concat(filteredWomenList.slice(0, roundNumber.value - 1));

    filteredMenList.forEach((manObject, index) => {
        if (!manObject.isBreakRound) {
            let li = document.createElement("li");
            li.appendChild(document.createTextNode(`Message for ${manObject.name}:`));
            li.appendChild(document.createElement("br"));
            li.appendChild(document.createElement("br"));
            li.appendChild(document.createTextNode(`Date ${roundNumber.value} starts at ${newTime}.`));
            li.appendChild(document.createElement("br"));

            let womanObject = filteredWomenList[index];
            li.appendChild(document.createTextNode(womanObject.isBreakRound ?
                `You are on a break round.\n\n` :
                `You will date: ${womanObject.name} ("${womanObject.descriptor}")`));
            li.appendChild(document.createElement("br"));
            li.appendChild(document.createElement("br"));
            li.appendChild(document.createTextNode('The prompt is:'));
            li.appendChild(document.createElement("br"));
            li.appendChild(document.createTextNode(prompt.value));
            li.appendChild(document.createElement("br"));
            li.appendChild(document.createElement("br"));
            li.appendChild(document.createTextNode('I will let you know when the date is over. Have fun!'));
            
            messageList.appendChild(li);
        }
    });
    filteredWomenList.forEach((womanObject, index) => {
        if (!womanObject.isBreakRound) {
            let li = document.createElement("li");
            li.appendChild(document.createTextNode(`Message for ${womanObject.name}:`));
            li.appendChild(document.createElement("br"));
            li.appendChild(document.createElement("br"));
            li.appendChild(document.createTextNode(`Date ${roundNumber.value} starts at ${newTime}.`));
            li.appendChild(document.createElement("br"));

            let manObject = filteredMenList[index];
            li.appendChild(document.createTextNode(manObject.isBreakRound ?
                `You are on a break round.\n\n` :
                `You will date: ${manObject.name} ("${manObject.descriptor}")`));
            li.appendChild(document.createElement("br"));
            li.appendChild(document.createElement("br"));
            li.appendChild(document.createTextNode('The prompt is:'));
            li.appendChild(document.createElement("br"));
            li.appendChild(document.createTextNode(prompt.value));
            li.appendChild(document.createElement("br"));
            li.appendChild(document.createElement("br"));
            li.appendChild(document.createTextNode('I will let you know when the date is over. Have fun!'));

            messageList.appendChild(li);
        }
    });

    saveDataInLocalStorage();
}

function saveDataInLocalStorage() {
    menList.forEach(manObject => {
        localStorage.setItem(`m${manObject.num}name`, manObject.nameElement.value);
        localStorage.setItem(`m${manObject.num}desc`, manObject.descriptorElement.value);
    });
    womenList.forEach(womanObject => {
        localStorage.setItem(`w${womanObject.num}name`, womanObject.nameElement.value);
        localStorage.setItem(`w${womanObject.num}desc`, womanObject.descriptorElement.value);
    });

    localStorage.setItem("startTime", startTime.value);
    localStorage.setItem("roundNumber", roundNumber.value);
    localStorage.setItem("prompt", prompt.value);

    localStorage.setItem("messageList", messageList.innerHTML);
}

function fetchDataFromLocalStorage() {
    menList.forEach(manObject => {
        manObject.nameElement.value = localStorage.getItem(`m${manObject.num}name`);
        manObject.descriptorElement.value = localStorage.getItem(`m${manObject.num}desc`);
    });
    womenList.forEach(womanObject => {
        womanObject.nameElement.value = localStorage.getItem(`w${womanObject.num}name`);
        womanObject.descriptorElement.value = localStorage.getItem(`w${womanObject.num}desc`);
    });

    startTime.value = localStorage.getItem("startTime");
    roundNumber.value = localStorage.getItem("roundNumber");
    prompt.value = localStorage.getItem("prompt");

    messageList.innerHTML = localStorage.getItem("messageList");
}

window.onload = fetchDataFromLocalStorage;