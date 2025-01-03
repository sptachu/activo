window.onload = async () => {
    let json = await fetchPostAsync()
    if (json != null && json.ifAdmin){
        alert("User jest adminem")

        let userJson = await fetchPostAsync2()
        console.log(userJson)
        for (let i=0;i<userJson.length;i++){
            let userDiv = document.createElement("div")
            let h2 = document.createElement("h2")
            userDiv.id = userJson[i].username
            document.getElementById("userList").appendChild(userDiv)
            userDiv.appendChild(h2)
            h2.innerText = userJson[i].username
            for (let j=0;j<userJson[i].activities.length;j++){
                let activityDiv = document.createElement("div")
                let checkbox = document.createElement("input")
                checkbox.type = "checkbox"
                checkbox.name = "checkbox"
                checkbox.id = userJson[i].activities[j].id
                userDiv.appendChild(activityDiv)
                activityDiv.innerText = userJson[i].activities[j].title
                activityDiv.appendChild(checkbox)
            }
        }
        let submitBtn = document.createElement("button")
        submitBtn.id = "submitBtn"
        submitBtn.innerText = "Delete"
        document.getElementById("userList").appendChild(submitBtn);
        submitBtn.onclick = async () => {
            let json = await fetchPostAsync3()
            alert(JSON.stringify(json, null, 5))
            if (json){
                location.reload()
            } else {
                window.location = 'http://127.0.0.1:4567/login.html';
            }
        }
    } else {
        alert("User nie jest adminem lub nie jest zalogowany")
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
