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

            // activityDiv.innerHTML += "Time: "
            // let timeInput = document.createElement("input")
            // timeInput.value = json.activities[i].time
            // activityDiv.appendChild(timeInput)
            // activityDiv.innerHTML += "<br>"
            //
            // activityDiv.innerHTML += "Location: "
            // let locationInput = document.createElement("input")
            // locationInput.value = json.activities[i].location
            // activityDiv.appendChild(locationInput)
            // activityDiv.innerHTML += "<br>"

            // activityDiv.innerHTML += "Location: "
            // let locationInput = document.createElement("input")
            // locationInput.value = json.activities[i].location
            // activityDiv.appendChild(locationInput)
            // activityDiv.innerHTML += "<br>"

            // document.getElementById("activityList").appendChild(activityDiv)
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