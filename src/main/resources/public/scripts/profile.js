window.onload = async () => {
    let json = await fetchPostAsync()
    console.log(json)
    if (json != null && !json.ifAdmin){
        for(let i=json.activities.length-1;i>=0;i--){
            let activityDiv = document.createElement("div")
            let checkbox = document.createElement("input")
            checkbox.type = "checkbox"
            checkbox.name = "checkbox"
            checkbox.id = json.activities[i].id
            document.getElementById("activityList").appendChild(activityDiv)
            activityDiv.innerText = json.activities[i].title
            activityDiv.appendChild(checkbox)
            activityDiv.innerHTML += "<br>"
            activityDiv.classList.add("activityDiv")
            checkbox.classList.add("activityCheckbox")

            activityDiv.innerHTML += "Tytuł: "
            let titleInput = document.createElement("input")
            titleInput.defaultValue = json.activities[i].title
            titleInput.name = json.activities[i].id
            activityDiv.appendChild(titleInput)
            activityDiv.innerHTML += "<br>"
            titleInput.classList.add("titleInput")

            activityDiv.innerHTML += "Data i Czas: "
            let timeInput = document.createElement("input")
            timeInput.defaultValue = json.activities[i].time
            timeInput.readOnly = true;
            timeInput.name = json.activities[i].id
            activityDiv.appendChild(timeInput)
            activityDiv.innerHTML += "<br>"
            timeInput.classList.add("timeInput")

            activityDiv.innerHTML += "Lokalizacja: "
            let locationInput = document.createElement("input")
            locationInput.defaultValue = json.activities[i].location
            locationInput.name = json.activities[i].id
            activityDiv.appendChild(locationInput)
            activityDiv.innerHTML += "<br>"
            locationInput.classList.add("locationInput")

            activityDiv.innerHTML += "Typ: "
            let typeInput = document.createElement("input")
            typeInput.defaultValue = json.activities[i].type
            typeInput.name = json.activities[i].id
            activityDiv.appendChild(typeInput)
            activityDiv.innerHTML += "<br>"
            typeInput.classList.add("typeInput")

            activityDiv.innerHTML += "Czas Trwania: "
            let durationInput = document.createElement("input")
            durationInput.defaultValue = json.activities[i].duration
            durationInput.name = json.activities[i].id
            activityDiv.appendChild(durationInput)
            activityDiv.innerHTML += "<br>"
            durationInput.classList.add("durationInput")

            activityDiv.innerHTML += "Dystans: "
            let distanceInput = document.createElement("input")
            distanceInput.defaultValue = json.activities[i].distance
            distanceInput.name = json.activities[i].id
            activityDiv.appendChild(distanceInput)
            activityDiv.innerHTML += "<br>"
            distanceInput.classList.add("distanceInput")

            activityDiv.innerHTML += "Przewyższenie: "
            let elevationInput = document.createElement("input")
            elevationInput.defaultValue = json.activities[i].elevation
            elevationInput.name = json.activities[i].id
            activityDiv.appendChild(elevationInput)
            activityDiv.innerHTML += "<br>"
            elevationInput.classList.add("elevationInput")

            document.getElementById("activityList").appendChild(activityDiv)

            let updateBtn = document.createElement("button")
            updateBtn.innerText = "Aktualizuj Aktywność"
            updateBtn.id = json.activities[i].id + "a"
            updateBtn.classList.add("updateBtn")
            document.getElementById("activityList").appendChild(updateBtn);
            document.getElementById("activityList").innerHTML += "<br>"

        }

        let elements = document.getElementsByClassName("updateBtn");

        for(let i = 0; i < elements.length; i++) {
            elements[i].onclick = e => {
                console.log(e.target)
                let id = e.target.id.substring(0, e.target.id.length - 1)
                let inputs  = document.getElementsByName(id)
                updateHandle(inputs, id)
            }
        }
    } else if (json != null && json.ifAdmin){
        alert("User jest adminem")
        window.location = 'http://127.0.0.1:4567/adminPage.html';
    } else {
        alert("User nie jest zalogowany")
        window.location = 'http://127.0.0.1:4567/login.html';
    }
}

document.getElementById("homePageBtn").onclick = async () => {
    window.location = 'http://127.0.0.1:4567/';
}
document.getElementById("accountDelBtn").onclick = async () => {
    let json = await fetchPostAsync3()
    if (json){
        alert("Pomyślnie usunięto konto")
    } else {
        alert("Nie udało się usunąć konta - użytkownik nie jest zalogowany")
    }
    window.location = 'http://127.0.0.1:4567/login.html';
}
document.getElementById("deleteBtn").onclick = async () => {
    let json = await fetchPostAsync2()
    alert(JSON.stringify(json, null, 5))
    if (json){
        location.reload()
    } else {
        window.location = 'http://127.0.0.1:4567/login.html';
    }
}
async function updateHandle(inputs, id) {
    let inputVals = []
    for(let i = 0;i<inputs.length;i++){
        inputVals.push(inputs[i].value)
    }
    console.log(inputVals)
    if((inputVals[3] == "run" || inputVals[3] == "bike" || inputVals[3] == "swim") && inputVals[0] != "" && inputVals[2] != "" && inputVals[4] != "" && inputVals[5] != "" && inputVals[6] != ""){
        let json = await fetchPostAsync4(inputVals, id)
        alert(JSON.stringify(json, null, 5))
        if(json){
            location.reload()
        } else {
            window.location = 'http://127.0.0.1:4567/login.html';
        }
    } else {
        alert("Niepoprawne dane")
    }
}

fetchPostAsync = async () => {

    const options = {
        method: "POST"
    }

    let response = await fetch("/getCurrentUser", options)

    if (!response.ok) {
        return response.status
    }
    else {
        return await response.json() // response.json
    }
}

fetchPostAsync2 = async () => {
    let checkedBoxes = document.querySelectorAll('input[name="checkbox"]:checked');
    let toDelete = [];
    console.log(checkedBoxes);
    for (let i = 0;i<checkedBoxes.length;i++){
        toDelete.push(checkedBoxes[i].id)
    }

    let dat = JSON.stringify((toDelete));
    const options = {
        method: "POST",
        body: dat,
    }

    let response = await fetch("/deleteActivities", options)

    if (!response.ok) {
        return response.status
    }
    else {
        return await response.json() // response.json
    }

}

fetchPostAsync3 = async () => {
    const options = {
        method: "POST",
    }

    let response = await fetch("/deleteUser", options)

    if (!response.ok) {
        return response.status
    }
    else {
        return await response.json() // response.json
    }

}

fetchPostAsync4 = async (inputVals, id) => {
    console.log("TEST")
    let dat = JSON.stringify({
        title: inputVals[0],
        time: inputVals[1],
        type: inputVals[3],
        duration: inputVals[4],
        location: inputVals[2],
        elevation: inputVals[6],
        distance: inputVals[5],
        id: id
    });

    const options = {
        method: "POST",
        body: dat,
    }

    let response = await fetch("/updateActivity", options)

    if (!response.ok) {
        return response.status
    }
    else {
        return await response.json() // response.json
    }

}