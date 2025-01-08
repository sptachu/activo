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

            activityDiv.innerHTML += "Title: "
            let titleInput = document.createElement("input")
            titleInput.defaultValue = json.activities[i].title
            titleInput.name = json.activities[i].id
            activityDiv.appendChild(titleInput)
            activityDiv.innerHTML += "<br>"

            activityDiv.innerHTML += "Time: "
            let timeInput = document.createElement("input")
            timeInput.defaultValue = json.activities[i].time
            timeInput.readOnly = true;
            timeInput.name = json.activities[i].id
            activityDiv.appendChild(timeInput)
            activityDiv.innerHTML += "<br>"

            activityDiv.innerHTML += "Location: "
            let locationInput = document.createElement("input")
            locationInput.defaultValue = json.activities[i].location
            locationInput.name = json.activities[i].id
            activityDiv.appendChild(locationInput)
            activityDiv.innerHTML += "<br>"

            activityDiv.innerHTML += "Type: "
            let typeInput = document.createElement("input")
            typeInput.defaultValue = json.activities[i].type
            typeInput.name = json.activities[i].id
            activityDiv.appendChild(typeInput)
            activityDiv.innerHTML += "<br>"

            activityDiv.innerHTML += "Duration: "
            let durationInput = document.createElement("input")
            durationInput.defaultValue = json.activities[i].duration
            durationInput.name = json.activities[i].id
            activityDiv.appendChild(durationInput)
            activityDiv.innerHTML += "<br>"

            activityDiv.innerHTML += "Distance: "
            let distanceInput = document.createElement("input")
            distanceInput.defaultValue = json.activities[i].distance
            distanceInput.name = json.activities[i].id
            activityDiv.appendChild(distanceInput)
            activityDiv.innerHTML += "<br>"

            activityDiv.innerHTML += "Elevation: "
            let elevationInput = document.createElement("input")
            elevationInput.defaultValue = json.activities[i].elevation
            elevationInput.name = json.activities[i].id
            activityDiv.appendChild(elevationInput)
            activityDiv.innerHTML += "<br>"

            document.getElementById("activityList").appendChild(activityDiv)

        }
        let updateBtn = document.createElement("button")
        updateBtn.id = "updateBtn"
        updateBtn.innerText = "Update activities"
        document.getElementById("activityList").appendChild(updateBtn);
        document.getElementById("activityList").innerHTML += "<br>"

        updateBtn.onclick = async () => {
            console.log("KLIK")
            // let json = await fetchPostAsync2()
            // alert(JSON.stringify(json, null, 5))
            // if (json){
            //     location.reload()
            // } else {
            //     window.location = 'http://127.0.0.1:4567/login.html';
            // }
        }

        let submitBtn = document.createElement("button")
        submitBtn.id = "submitBtn"
        submitBtn.innerText = "Delete activities"
        document.getElementById("activityList").appendChild(submitBtn);

        submitBtn.onclick = async () => {
            let json = await fetchPostAsync2()
            alert(JSON.stringify(json, null, 5))
            if (json){
                location.reload()
            } else {
                window.location = 'http://127.0.0.1:4567/login.html';
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
function onUpdateClick() {
    console.log("KLIK")
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

fetchPostAsync4 = async (titleInput,timeInput,locationInput,typeInput,durationInput,distanceInput,elevationInput) => {
    console.log("TEST")
    let dat = JSON.stringify({
        title: titleInput.value,
        time: timeInput.value,
        type: typeInput.value,
        duration: durationInput.value,
        location: locationInput.value,
        elevation: elevationInput.value,
        distance: distanceInput.value,
        id: timeInput.name
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