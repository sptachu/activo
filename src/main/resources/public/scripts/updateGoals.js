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