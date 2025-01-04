// JavaScript to toggle between views
const activitiesSection = document.getElementById('activities');
const goalsSection = document.getElementById('goals');
const navLinks = document.querySelectorAll('.nav-links a');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (link.textContent === 'Home') {
            activitiesSection.style.display = 'block';
            goalsSection.style.display = 'none';
        } else if (link.textContent === 'Goals & Progress') {
            activitiesSection.style.display = 'none';
            goalsSection.style.display = 'block';
        }
    });
});

window.onload = async () => {
    let json = await fetchPostAsync3()
    console.log(json)
    if (json != null && json.ifAdmin){
        window.location = 'http://127.0.0.1:4567/adminPage.html';
        alert("Jesteś na koncie admina, przenoszenie na stronę admina")
    } else if (json == null) {
        window.location = 'http://127.0.0.1:4567/login.html';
        alert("Nie jesteś zalogowany, przenoszenie na stronę logowania")
    } else {
        document.getElementById("profile-initial").innerText = json.username[0]
        let activityJson = await fetchPostAsync4()
        console.log(activityJson)
        for(let i = activityJson.length - 1;i>=0;i--){
            let activityDiv = document.createElement("div")
            activityDiv.id = activityJson[i].id
            activityDiv.classList.add("activityDiv");
            document.getElementById("activities").appendChild(activityDiv)
            activityDiv.innerHTML = activityJson[i].user + "<br>" + activityJson[i].time + ", " + activityJson[i].location + "<br>" + activityJson[i].title + ", " + activityJson[i].type + "<br>" + activityJson[i].duration + ", " + activityJson[i].distance + "<br>" + activityJson[i].pace + ", " + activityJson[i].elevation

        }
    }
}


document.getElementById("logOutBtn").onclick = async () => {
    let json = await fetchPostAsync()


    window.location = 'http://127.0.0.1:4567/login.html';
    console.log(json)
    alert(JSON.stringify(json, null, 5))
}

document.getElementById("user-profile").onclick = async () => {
    window.location = 'http://127.0.0.1:4567/profile.html';
}


    fetchPostAsync = async () => {
        const options = {
            method: "POST",
        };

        let response = await fetch("/logout", options);

        if (!response.ok) {
            return response.status; // Zwróć status w przypadku błędu
        } else {
            return await response.text(); // Pobierz odpowiedź jako tekst
        }

}

document.getElementById("addActivityBtn").onclick = async () => {
    let json = await fetchPostAsync2()

    if(json === "nie mozna dodac aktywnosci"){
        window.location = 'http://127.0.0.1:4567/login.html';
    } else {
        window.location = 'http://127.0.0.1:4567/addActivity.html';
    }
    console.log("Response from server:", json);
    alert(JSON.stringify(json, null, 5))
}


fetchPostAsync2 = async () => {
    const options = {
        method: "POST",
    };

    let response = await fetch("/goToAddActivitySite", options);

    if (!response.ok) {
        return response.status; // Zwróć status w przypadku błędu
    } else {
        return await response.text(); // Pobierz odpowiedź jako tekst
    }



}

fetchPostAsync3 = async () => {
    const options = {
        method: "POST",
    };

    let response = await fetch("/getCurrentUser", options);

    if (!response.ok) {
        return response.status;
    } else {
        return await response.json();
    }
}

fetchPostAsync4 = async () => {
    const options = {
        method: "POST",
    };

    let response = await fetch("/getActivityList", options);

    if (!response.ok) {
        return response.status;
    } else {
        return await response.json();
    }
}


