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

// window.onload = async () => {
//     let json = await fetchPostAsync3()
//     console.log(json)
//     if (json != null && json.ifAdmin){
//         window.location = 'http://127.0.0.1:4567/adminPage.html';
//         alert("Jesteś na koncie admina, przenoszenie na stronę admina")
//     } else if (json == null) {
//         window.location = 'http://127.0.0.1:4567/login.html';
//         alert("Nie jesteś zalogowany, przenoszenie na stronę logowania")
//     } else {
//         document.getElementById("profile-initial").innerText = json.username[0]
//         let activityJson = await fetchPostAsync4()
//         console.log(activityJson)
//         for(let i = activityJson.length - 1;i>=0;i--){
//             let activityDiv = document.createElement("div")
//             activityDiv.id = activityJson[i].id
//             activityDiv.classList.add("activityDiv");
//             document.getElementById("activities").appendChild(activityDiv)
//             activityDiv.innerHTML = activityJson[i].user + "<br>" + activityJson[i].time + ", " + activityJson[i].location + "<br>" + activityJson[i].title + ", " + activityJson[i].type + "<br>" + activityJson[i].duration + ", " + activityJson[i].distance + "<br>" + activityJson[i].pace + ", " + activityJson[i].elevation
//
//         }
//     }
// }

window.onload = async () => {
    let json = await fetchPostAsync3();
    console.log(json);
    if (json != null && json.ifAdmin) {
        window.location = 'http://127.0.0.1:4567/adminPage.html';
        alert("Jesteś na koncie admina, przenoszenie na stronę admina");
    } else if (json == null) {
        window.location = 'http://127.0.0.1:4567/login.html';
        alert("Nie jesteś zalogowany, przenoszenie na stronę logowania");
    } else {
        document.getElementById("profile-initial").innerText = json.username[0];
        let activityJson = await fetchPostAsync4();
        console.log(activityJson);

        for (let i = activityJson.length - 1; i >= 0; i--) {
            // Tworzenie głównego kontenera dla aktywności
            let activityDiv = document.createElement("div");
            activityDiv.classList.add("activity-card");

            // Nagłówek (kółko + informacje o użytkowniku)
            let header = document.createElement("div");
            header.classList.add("header");

            let initialCircle = document.createElement("div");
            initialCircle.classList.add("initial-circle");
            initialCircle.innerText = activityJson[i].user[0]; // Pierwsza litera użytkownika

            let userInfo = document.createElement("div");
            userInfo.classList.add("user-info");

            let likeWrapper = document.createElement("div");
            likeWrapper.classList.add("like-wrapper");

            let likeButton = document.createElement("button");
            likeButton.classList.add("like-button");
            likeButton.id = activityJson[i].id + "a"
            if (activityJson[i].likingUsers.includes(json.username)){
                likeButton.innerText = likeButton.innerText = "Już nie lubię";
            } else {
                likeButton.innerText = likeButton.innerText = "Lubię to";
            }

            let likeCounter = document.createElement("div");
            likeCounter.classList.add("like-counter");
            likeCounter.id = activityJson[i].id + "aa"
            if (activityJson[i].likingUsers[0] !== ""){
                likeCounter.innerText = activityJson[i].likingUsers.length;
            } else {
                likeCounter.innerText = activityJson[i].likingUsers.length - 1;
            }
            likeWrapper.appendChild(likeButton);
            likeWrapper.appendChild(likeCounter);

            let username = document.createElement("p");
            username.classList.add("username");
            username.innerText = activityJson[i].user;

            let dateLocation = document.createElement("p");
            dateLocation.classList.add("date-location");
            dateLocation.innerText = `${activityJson[i].time}, ${activityJson[i].location}`;

            userInfo.appendChild(username);
            userInfo.appendChild(dateLocation);
            header.appendChild(initialCircle);
            header.appendChild(userInfo);
            header.appendChild(likeWrapper);

            // Sekcja tytułu treningu
            let titleSection = document.createElement("div");
            titleSection.classList.add("title-section");
            titleSection.innerHTML = `${activityJson[i].title} - <span class="workout-type">${activityJson[i].type}</span>`;

            // Szczegóły treningu (grid)
            let details = document.createElement("div");
            details.classList.add("details");

            // Dodanie szczegółów do gridu
            details.appendChild(createDetail("czas:", activityJson[i].duration));
            details.appendChild(createDetail("dystans:", activityJson[i].distance +  " km"));
            details.appendChild(createDetail("śr. prędkość:", activityJson[i].pace));
            details.appendChild(createDetail("przewyższenie:", activityJson[i].elevation +  " m"));

            // Złożenie całej struktury w całość
            activityDiv.appendChild(header);
            activityDiv.appendChild(titleSection);
            activityDiv.appendChild(details);

            // Dodanie do głównego kontenera na stronie
            document.getElementById("activities").appendChild(activityDiv);
        }
        let elements = document.getElementsByClassName("like-button");

        for(let i = 0; i < elements.length; i++) {
            elements[i].onclick = e => {
                console.log(e.target)
                let id = e.target.id.substring(0, e.target.id.length - 1)
                let action = 0;
                if(e.target.innerText === "Lubię to") {
                    action = 1;
                } else if (e.target.innerText === "Już nie lubię") {
                    action = 2;
                }
                likeHandle(id, action)
            }
        }

        // dodawanie celów do tabelki
        document.getElementById("totalDistance").innerText = json.totalDistance + " km";
        document.getElementById("goalTotalDistance").innerText = json.goalTotalDistance + " km";
        document.getElementById("differenceTotalDistance").innerText = json.distanceDifference + " km";
        document.getElementById("totalTime").innerText = json.totalActiveTime;
        document.getElementById("goalTotalTime").innerText = json.goalTotalActiveTime;
        document.getElementById("differenceTotalTime").innerText = json.timeDifference;
        if(json.tenKmRunTime === "100:00:00") {
            document.getElementById("tenKmRun").innerText = "przebiegnnij 10 km"
            document.getElementById("differenceTenKmRun").innerText = "--:--:--";
        } else {
            document.getElementById("tenKmRun").innerText = json.tenKmRunTime;
            document.getElementById("differenceTenKmRun").innerText = json.timeDifferenceRun;
        }
        if(json.fortyKmBikeTime === "100:00:00") {
            document.getElementById("fortyKmBike").innerText = "przejedź 40 km"
            document.getElementById("differenceFortyKmBike").innerText = "--:--:--";
        } else {
            document.getElementById("fortyKmBike").innerText = json.fortyKmBikeTime
            document.getElementById("differenceFortyKmBike").innerText = json.timeDifferenceBike;
        }
        if(json.fourHundredMetersSwimTime === "100:00:00") {
            document.getElementById("fourHundredMetersSwim").innerText = "przepłyń 400 m"
            document.getElementById("differenceFourHundredMetersSwim").innerText = "--:--:--";
        } else {
            document.getElementById("fourHundredMetersSwim").innerText = json.fourHundredMetersSwimTime;
            document.getElementById("differenceFourHundredMetersSwim").innerText = json.timeDifferenceSwim;
        }
        document.getElementById("goalTenKmRun").innerText = json.goalTenKmRunTime;
        document.getElementById("goalFortyKmBike").innerText = json.goalFortyKmBikeTime;
        document.getElementById("goalFourHundredMetersSwim").innerText = json.goalFourHundredMetersSwimTime;
    }
};

// Funkcja pomocnicza do tworzenia szczegółów w gridzie
function createDetail(labelText, valueText) {
    let detail = document.createElement("div");
    detail.classList.add("detail");

    let label = document.createElement("p");
    label.classList.add("label");
    label.innerText = labelText;

    let value = document.createElement("p");
    value.classList.add("value");
    value.innerText = valueText;

    detail.appendChild(label);
    detail.appendChild(value);
    return detail;
}

async function likeHandle(id, action) {
    let json = await fetchPostAsync5(id)
    alert(JSON.stringify(json, null, 5))
    if(json){
        if (action === 1) {
            document.getElementById(id+"aa").innerText = parseInt(document.getElementById(id+"aa").innerText) + 1
            document.getElementById(id+"a").innerText = "Już nie lubię"
        } else if(action === 2) {
            document.getElementById(id+"aa").innerText = parseInt(document.getElementById(id+"aa").innerText) - 1
            document.getElementById(id+"a").innerText = "Lubię to"
        } else {
            alert("Błąd")
        }
    } else {
        window.location = 'http://127.0.0.1:4567/login.html';
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

fetchPostAsync5 = async (id) => {
    let dat = JSON.stringify(id);

    const options = {
        method: "POST",
        body: dat,
    }

    let response = await fetch("/likePost", options)

    if (!response.ok) {
        return response.status
    }
    else {
        return await response.json() // response.json
    }

}
