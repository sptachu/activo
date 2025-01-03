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


    window.location = 'http://127.0.0.1:4567/addActivity.html';
    console.log(json)
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


