document.addEventListener("DOMContentLoaded", async () => {
    let json = await fetchPostAsync();
    if (!json) {
        console.error("Nie udało się pobrać danych.");
        return;
    }
    console.log(json);

    let goalTotalActiveTime = json.goalTotalActiveTime.split(":");
    let goalTotalDistance = json.goalTotalDistance;
    let goalTenKmRunTime = json.goalTenKmRunTime.split(":");
    let goalFortyKmBikeTime = json.goalFortyKmBikeTime.split(":");
    let goalFourHundredMetersSwimTime = json.goalFourHundredMetersSwimTime.split(":");

    document.getElementById("goalTotalActiveTimeHours").value = goalTotalActiveTime[0];
    document.getElementById("goalTotalActiveTimeMinutes").value = goalTotalActiveTime[1];
    document.getElementById("goalTotalActiveTimeSeconds").value = goalTotalActiveTime[2];
    document.getElementById("goalTotalDistance").value = goalTotalDistance;
    document.getElementById("goalTenKmRunTimeHours").value = goalTenKmRunTime[0];
    document.getElementById("goalTenKmRunTimeMinutes").value = goalTenKmRunTime[1];
    document.getElementById("goalTenKmRunTimeSeconds").value = goalTenKmRunTime[2];
    document.getElementById("goalFortyKmBikeTimeHours").value = goalFortyKmBikeTime[0];
    document.getElementById("goalFortyKmBikeTimeMinutes").value = goalFortyKmBikeTime[1];
    document.getElementById("goalFortyKmBikeTimeSeconds").value = goalFortyKmBikeTime[2];
    document.getElementById("goalFourHundredMetersSwimTimeHours").value = goalFourHundredMetersSwimTime[0];
    document.getElementById("goalFourHundredMetersSwimTimeMinutes").value = goalFourHundredMetersSwimTime[1];
    document.getElementById("goalFourHundredMetersSwimTimeSeconds").value = goalFourHundredMetersSwimTime[2];
});

document.getElementById("submitGoalsBtn").onclick = async () => {
    let json = await fetchPostAsync2()
    console.log(json)
    if (json){
        window.location = 'http://127.0.0.1:4567/';
    }
    alert(JSON.stringify(json, null, 5))
}



fetchPostAsync = async () => {
    const options = {
        method: "POST",
    };

    let response = await fetch("/getCurrentUser", options); // wykorzytsuje ten getCurrentUser bo potrzebuje aktualnego usera - jego celów

    if (!response.ok) {
        return response.status;
    } else {
        return await response.json();
    }
}

fetchPostAsync2 = async () => {
    const dat = JSON.stringify({
        goalTotalActiveTime: document.getElementById("goalTotalActiveTimeHours").value + ":" + document.getElementById("goalTotalActiveTimeMinutes").value + ":" + document.getElementById("goalTotalActiveTimeSeconds").value,
        goalTotalDistance: document.getElementById("goalTotalDistance").value,
        goalTenKmRunTime: document.getElementById("goalTenKmRunTimeHours").value + ":" + document.getElementById("goalTenKmRunTimeMinutes").value + ":" + document.getElementById("goalTenKmRunTimeSeconds").value,
        goalFortyKmBikeTime: document.getElementById("goalFortyKmBikeTimeHours").value + ":" + document.getElementById("goalFortyKmBikeTimeMinutes").value + ":" + document.getElementById("goalFortyKmBikeTimeSeconds").value,
        goalFourHundredMetersSwimTime: document.getElementById("goalFourHundredMetersSwimTimeHours").value + ":" + document.getElementById("goalFourHundredMetersSwimTimeMinutes").value + ":" + document.getElementById("goalFourHundredMetersSwimTimeSeconds").value,
    })

    const options = {
        method: "POST",
        body: dat,
    }

    let response = await fetch("/setGoals", options)

    if (!response.ok) {
        return response.status
    }
    else {
        return await response.json() // response.json
    }

}