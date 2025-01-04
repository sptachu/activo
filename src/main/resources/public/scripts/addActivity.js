let typeInput;
document.addEventListener("DOMContentLoaded", function() {
    const activityButtons = document.querySelectorAll(".activity-btn");
    typeInput = document.getElementById("type");

    activityButtons.forEach(button => {
        button.addEventListener("click", function () {
            activityButtons.forEach(btn => btn.classList.remove("selected"));
            this.classList.add("selected");
            typeInput.value = this.getAttribute("data-type");
        });
    });
});

document.getElementById("submitActivityBtn").onclick = async () => {
    if (!typeInput.value) {
        alert("Please select an activity type.");
        return;
    }
    let json = await fetchPostAsync()
    console.log(json)
    if (json){
        window.location = 'http://127.0.0.1:4567/';
    } else {
        window.location = 'http://127.0.0.1:4567/login.html';
    }
    alert(JSON.stringify(json, null, 5))
}

// function formatTimeUnit(unit) {
//     return unit.toString().padStart(2, '0');
// }

fetchPostAsync = async () => {
    let hours = document.getElementById("hours").value || 0;
    let minutes = document.getElementById("minutes").value || 0;
    let seconds = document.getElementById("seconds").value || 0;

    // hours = formatTimeUnit(hours);
    // minutes = formatTimeUnit(minutes);
    // seconds = formatTimeUnit(seconds);

    const duration = `${hours}:${minutes}:${seconds}`;

    const dat = JSON.stringify({
        title: document.getElementById("title").value,
        time: document.getElementById("time").value,
        type: document.getElementById("type").value,
        duration: duration,
        location: document.getElementById("location").value,
        elevation: document.getElementById("elevation").value,
        distance: document.getElementById("distance").value,
    })

    const options = {
        method: "POST",
        body: dat,
    }

    let response = await fetch("/addActivity", options)

    if (!response.ok) {
        return response.status
    }
    else {
        return await response.json() // response.json
    }

}