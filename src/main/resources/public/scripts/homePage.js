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
    }
}


document.getElementById("logOutBtn").onclick = async () => {
    let json = await fetchPostAsync()


    window.location = 'http://127.0.0.1:4567/login.html';
    console.log(json)
    alert(JSON.stringify(json, null, 5))
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


