window.onload = async () => {
    let json = await fetchPostAsync()
    console.log(json)
    if (json != null && json.ifAdmin){
        let userJson = await fetchPostAsync2()
        console.log(userJson)
        for (let i=0;i<userJson.length;i++){
            let userDiv = document.createElement("div")
            let h2 = document.createElement("h2")
            userDiv.id = userJson[i].username
            userDiv.className = "userDiv"
            document.getElementById("userList").appendChild(userDiv)
            userDiv.appendChild(h2)
            h2.innerText = userJson[i].username
            h2.className = "username"
            let userCheckbox = document.createElement("input")
            userCheckbox.type = "checkbox"
            userCheckbox.name = "userCheckbox"
            userCheckbox.id = userJson[i].username
            userCheckbox.className = "userCheckbox"
            if (userJson[i].username != json.username){
                h2.appendChild(userCheckbox)
            }

            for (let j=0;j<userJson[i].activities.length;j++){
                let activityDiv = document.createElement("div")
                activityDiv.className = "activityDiv"
                let checkbox = document.createElement("input")
                checkbox.type = "checkbox"
                checkbox.name = "checkbox"
                checkbox.id = userJson[i].activities[j].id
                checkbox.className = "activityCheckbox"
                userDiv.appendChild(activityDiv)
                activityDiv.innerText = userJson[i].activities[j].title
                activityDiv.appendChild(checkbox)
            }
        }
        let submitBtn = document.createElement("button")
        submitBtn.id = "submitBtn"
        submitBtn.innerText = "Usuń Aktywności"
        let submitBtn2 = document.createElement("button")
        submitBtn2.id = "submitBtn2"
        submitBtn2.innerText = "Usuń Użytkowników"

        document.getElementById("userList").appendChild(submitBtn);
        document.getElementById("userList").appendChild(submitBtn2);
        submitBtn.onclick = async () => {
            let json = await fetchPostAsync3()
            // alert(JSON.stringify(json, null, 5))
            if (json){
                location.reload()
            } else {
                window.location = 'http://127.0.0.1:4567/login.html';
            }
        }
        submitBtn2.onclick = async () => {
            let json = await fetchPostAsync4()
            // alert(JSON.stringify(json, null, 5))
            if (json){
                location.reload()
            } else {
                window.location = 'http://127.0.0.1:4567/login.html';
            }
        }
    } else if (json != null && !json.ifAdmin){
        alert("User nie jest adminem")
        window.location = 'http://127.0.0.1:4567/';
    } else {
        alert("User nie jest zalogowany")
        window.location = 'http://127.0.0.1:4567/login.html';
    }
}

document.getElementById("logOutBtn").onclick = async () => {
    let json = await fetchPostAsync5()


    window.location = 'http://127.0.0.1:4567/login.html';
    console.log(json)
    // alert(JSON.stringify(json, null, 5))
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

    const options = {
        method: "POST"
    }

    let response = await fetch("/getUserList", options)

    if (!response.ok) {
        return response.status
    }
    else {
        return await response.json() // response.json
    }

}

fetchPostAsync3 = async () => {
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
fetchPostAsync4 = async () => {
    let checkedBoxes = document.querySelectorAll('input[name="userCheckbox"]:checked');
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

    let response = await fetch("/deleteUsers", options)

    if (!response.ok) {
        return response.status
    }
    else {
        return await response.json() // response.json
    }

}

fetchPostAsync5 = async () => {
    const options = {
        method: "POST",
    };

    let response = await fetch("/logout", options);

    if (!response.ok) {
        return response.status;
    } else {
        return await response.text();
    }

}
